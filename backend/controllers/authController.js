import {
  ErroAutenticacao,
  autenticarUsuario,
  deslogarUsuario,
  registrarUsuario,
} from "../services/authService.js";

/**
 * @param {Error} erro - Objeto de erro capturado
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} Resposta HTTP com código de status e mensagem de erro
 */
const tratarErroAutenticacao = (erro, res) => {
  if (erro instanceof ErroAutenticacao) {
    return res.status(erro.codigoStatus).json({ message: erro.message });
  }

  return res
    .status(500)
    .json({ 
      message: "Erro interno no serviço de autenticação.", 
      error: erro.message 
    });
};

/**
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} req.body - Corpo da requisição contendo: nome, email, senha, tipoConta
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Resposta HTTP com status 201 e dados do usuário criado
 */
export const register = async (req, res) => {
  try {
    const resultado = await registrarUsuario(req.body);
    return res.status(201).json(resultado);
  } catch (erro) {
    return tratarErroAutenticacao(erro, res);
  }
};

/**
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} req.body - Corpo da requisição contendo: email, senha
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Resposta HTTP com status 200, token JWT e dados do usuário
 */
export const login = async (req, res) => {
  try {
    const resultado = await autenticarUsuario(req.body);
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErroAutenticacao(erro, res);
  }
};

/**
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
    const autorizacao = req.headers.authorization || "";
    const token = req.body?.token || autorizacao.replace(/^Bearer\s+/i, "").trim();
    const resultado = deslogarUsuario(token);
    return res.status(200).json(resultado);
  } catch (erro) {
    return tratarErroAutenticacao(erro, res);
  }
};
