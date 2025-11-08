import bcrypt from "bcrypt";

// Armazena os usuários cadastrados em memória usando uma estrutura Map
// Chave: e-mail normalizado (lowercase, sem espaços)
// Valor: objeto com dados do usuário (id, nome, email, senha hash, tipoConta, criadoEm)
const armazenamentoUsuarios = new Map();

/**
 * Normaliza o e-mail removendo espaços e convertendo para minúsculas.
 * Isso garante que a busca e o armazenamento sejam consistentes.
 * 
 * @param {string} email - E-mail a ser normalizado
 * @returns {string} E-mail normalizado
 */
const normalizarEmail = (email) => {
  return (email || "").trim().toLowerCase();
};
/**
 * Gera um ID único para um novo usuário.
 * @returns {string} Identificador único no formato: usuario_timestamp_random
 */
const gerarId = () => {
  return `usuario_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
};
/**
 * Busca um usuário pelo e-mail normalizado.
 * @param {string} email - E-mail do usuário a ser buscado
 * @returns {Promise<Object|null>} Objeto do usuário encontrado ou null se não encontrado
 */
export const buscarUsuarioPorEmail = async (email) => {
  const emailNormalizado = normalizarEmail(email);
  return armazenamentoUsuarios.get(emailNormalizado) || null;
};
/**
 * Cria um novo usuário no armazenamento.
 * A senha é automaticamente criptografada usando bcrypt antes de ser armazenada.
 * @param {string} nome - Nome completo do usuário
 * @param {string} email - E-mail do usuário (será normalizado)
 * @param {string} senha - Senha em texto plano (será criptografada)
 * @param {string} tipoConta - Tipo de conta: "comum" ou "profissional"
 * @returns {Promise<Object>} Objeto do usuário criado (incluindo senha hash)
 */
export const criarUsuario = async (nome, email, senha, tipoConta) => {
  const emailNormalizado = normalizarEmail(email);
  const id = gerarId();
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = {
    id,
    nome: nome.trim(),
    email: emailNormalizado,
    senha: senhaHash,
    tipoConta,
    criadoEm: new Date().toISOString(),
  };

  armazenamentoUsuarios.set(emailNormalizado, usuario);
  return usuario;
};

/**
 * Verifica se já existe um usuário cadastrado com o e-mail fornecido.
 * @param {string} email - E-mail a ser verificado
 * @returns {Promise<boolean>} True se o e-mail já está cadastrado, False caso contrário
 */
export const emailJaCadastrado = async (email) => {
  const usuario = await buscarUsuarioPorEmail(email);
  return usuario !== null;
};

/**
 * Obtém todos os usuários cadastrados.
 * @returns {Array<Object>} Array com todos os usuários cadastrados
 */
export const obterTodosUsuarios = () => {
  return Array.from(armazenamentoUsuarios.values());
};

/**
 * Remove um usuário do armazenamento pelo e-mail.
 * @param {string} email - E-mail do usuário a ser removido
 * @returns {boolean} True se o usuário foi removido, False se não foi encontrado
 */
export const removerUsuario = (email) => {
  const emailNormalizado = normalizarEmail(email);
  return armazenamentoUsuarios.delete(emailNormalizado);
};
/**
 * Limpa todos os usuários do armazenamento.
 * @returns {void}
 */
export const limparTodosUsuarios = () => {
  armazenamentoUsuarios.clear();
};

