import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  buscarUsuarioPorEmail,
  criarUsuario,
  emailJaCadastrado,
} from "./userStorageService.js";
import { salvarSessao, removerSessao } from "./storageService.js";

// Tempo padrão de expiração do token JWT (2 horas)
const TEMPO_EXPIRACAO_PADRAO_JWT = "2h";
export class ErroAutenticacao extends Error {
  /**
   * @param {string} mensagem - Mensagem de erro descritiva
   * @param {number} codigoStatus - Código HTTP de status (padrão: 400)
   */
  constructor(mensagem, codigoStatus = 400) {
    super(mensagem);
    this.name = "ErroAutenticacao";
    this.codigoStatus = codigoStatus;
  }
}

/**
 * Remove informações sensíveis do objeto de usuário antes de enviar para o cliente.
 * Remove especificamente a senha do objeto para evitar vazamento de dados.
 * @param {Object} usuario - Objeto do usuário completo (incluindo senha)
 * @returns {Object|null} Objeto do usuário sem a senha ou null se usuário não fornecido
 */
const sanitizarUsuario = (usuario) => {
  if (!usuario) {
    return null;
  }
  const { senha, ...resto } = usuario;
  return resto;
};
/**
 * @param {Object} dadosUsuario - Objeto com os dados do novo usuário
 * @param {string} dadosUsuario.nome - Nome completo do usuário
 * @param {string} dadosUsuario.email - E-mail do usuário (será usado como login)
 * @param {string} dadosUsuario.senha - Senha em texto plano (será criptografada)
 * @param {string} dadosUsuario.tipoConta - Tipo de conta: "comum" ou "profissional"
 * @returns {Promise<Object>} Objeto com mensagem de sucesso e dados do usuário criado
 * @throws {ErroAutenticacao} Se houver erro de validação ou e-mail já cadastrado
 */
export const registrarUsuario = async ({ nome, email, senha, tipoConta }) => {
  if (!nome || !email || !senha || !tipoConta) {
    throw new ErroAutenticacao("Preencha todos os campos!", 400);
  }

  if (await emailJaCadastrado(email)) {
    throw new ErroAutenticacao("E-mail já cadastrado!", 400);
  }
  const usuario = await criarUsuario(nome, email, senha, tipoConta);
  return {
    message: "Usuário cadastrado com sucesso!",
    usuario: sanitizarUsuario(usuario),
  };
};

/**
 * @param {Object} credenciais - Objeto com as credenciais de login
 * @param {string} credenciais.email - E-mail do usuário
 * @param {string} credenciais.senha - Senha em texto plano
 * @returns {Promise<Object>} Objeto com mensagem, token JWT e dados do usuário
 * @throws {ErroAutenticacao} Se usuário não encontrado, senha incorreta ou erro de configuração
 */
export const autenticarUsuario = async ({ email, senha }) => {
  if (!email || !senha) {
    throw new ErroAutenticacao("Informe e-mail e senha.", 400);
  }
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new ErroAutenticacao("Usuário não encontrado", 404);
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new ErroAutenticacao("Senha incorreta", 401);
  }

  const chaveSecreta = process.env.JWT_SECRET;
  if (!chaveSecreta) {
    throw new ErroAutenticacao("Segredo JWT não configurado", 500);
  }

  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      tipoConta: usuario.tipoConta 
    },
    chaveSecreta,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || TEMPO_EXPIRACAO_PADRAO_JWT 
    }
  );
  salvarSessao(token, { userId: usuario.id });
  return {
    message: "Login realizado com sucesso!",
    token,
    usuario: sanitizarUsuario(usuario),
  };
};

/**
 * @param {string} token - Token JWT do usuário a ser deslogado
 * @returns {Object} Objeto com mensagem de sucesso
 * @throws {ErroAutenticacao} Se o token não foi fornecido
 */
export const deslogarUsuario = (token) => {
  if (!token) {
    throw new ErroAutenticacao("Token não informado", 400);
  }
  removerSessao(token);
  return { message: "Logout realizado com sucesso!" };
};
