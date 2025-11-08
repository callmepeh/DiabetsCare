/**
 * authController.js
 * 
 * Controlador de rotas de autenticação.
 * 
 * Este módulo atua como uma camada intermediária entre as rotas HTTP e os serviços
 * de autenticação. É responsável por receber requisições HTTP, extrair dados do corpo
 * da requisição, chamar os serviços apropriados e retornar respostas HTTP formatadas.
 * 
 * Funcionalidades:
 * - Processa requisições de registro de novos usuários
 * - Processa requisições de login
 * - Processa requisições de logout
 * - Trata erros e retorna respostas HTTP apropriadas
 */

import {
  ErroAutenticacao,
  autenticarUsuario,
  deslogarUsuario,
  registrarUsuario,
} from "../services/authService.js";

/**
 * Trata erros de autenticação e retorna respostas HTTP apropriadas.
 * 
 * Se o erro for uma instância de ErroAutenticacao, retorna o código de status
 * específico definido no erro. Caso contrário, retorna um erro genérico 500.
 * 
 * @param {Error} erro - Objeto de erro capturado
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} Resposta HTTP com código de status e mensagem de erro
 */
const tratarErroAutenticacao = (erro, res) => {
  // Verifica se o erro é uma instância de ErroAutenticacao
  if (erro instanceof ErroAutenticacao) {
    // Retorna o código de status específico do erro
    return res.status(erro.codigoStatus).json({ message: erro.message });
  }

  // Se for outro tipo de erro, retorna erro genérico 500 (erro interno do servidor)
  return res
    .status(500)
    .json({ 
      message: "Erro interno no serviço de autenticação.", 
      error: erro.message 
    });
};

/**
 * Controlador para registro de novos usuários.
 * 
 * Rota: POST /auth/register
 * 
 * Recebe os dados do novo usuário no corpo da requisição e chama o serviço
 * de registro para criar o usuário no banco de dados.
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} req.body - Corpo da requisição contendo: nome, email, senha, tipoConta
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Resposta HTTP com status 201 e dados do usuário criado
 */
export const register = async (req, res) => {
  try {
    // Chama o serviço de registro passando os dados do corpo da requisição
    const resultado = await registrarUsuario(req.body);
    
    // Retorna resposta de sucesso com status 201 (Created)
    return res.status(201).json(resultado);
  } catch (erro) {
    // Se houver erro, trata e retorna resposta apropriada
    return tratarErroAutenticacao(erro, res);
  }
};

/**
 * Controlador para autenticação de usuários (login).
 * 
 * Rota: POST /auth/login
 * 
 * Recebe e-mail e senha no corpo da requisição e chama o serviço de autenticação
 * para validar as credenciais e gerar um token JWT.
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} req.body - Corpo da requisição contendo: email, senha
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Resposta HTTP com status 200, token JWT e dados do usuário
 */
export const login = async (req, res) => {
  try {
    // Chama o serviço de autenticação passando as credenciais do corpo da requisição
    const resultado = await autenticarUsuario(req.body);
    
    // Retorna resposta de sucesso com status 200 (OK)
    return res.status(200).json(resultado);
  } catch (erro) {
    // Se houver erro, trata e retorna resposta apropriada
    return tratarErroAutenticacao(erro, res);
  }
};

/**
 * Controlador para logout de usuários.
 * 
 * Rota: POST /auth/logout
 * 
 * Recebe o token JWT do usuário (via header Authorization ou corpo da requisição)
 * e chama o serviço de logout para remover a sessão do sistema.
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} req.headers - Cabeçalhos da requisição
 * @param {string} req.headers.authorization - Header Authorization com token Bearer (opcional)
 * @param {Object} req.body - Corpo da requisição contendo token (opcional)
 * @param {string} req.body.token - Token JWT do usuário (opcional)
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} Resposta HTTP com status 200 e mensagem de sucesso
 */
export const logout = (req, res) => {
  try {
    // Tenta obter o token do header Authorization ou do corpo da requisição
    const autorizacao = req.headers.authorization || "";
    
    // Extrai o token do header Authorization (formato: "Bearer <token>")
    // ou usa o token do corpo da requisição se disponível
    const token = req.body?.token || autorizacao.replace(/^Bearer\s+/i, "").trim();

    // Chama o serviço de logout para remover a sessão
    const resultado = deslogarUsuario(token);
    
    // Retorna resposta de sucesso com status 200 (OK)
    return res.status(200).json(resultado);
  } catch (erro) {
    // Se houver erro, trata e retorna resposta apropriada
    return tratarErroAutenticacao(erro, res);
  }
};
