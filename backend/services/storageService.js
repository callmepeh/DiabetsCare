// Armazena as sessões ativas em memória usando uma estrutura Map
// Chave: token JWT do usuário
// Valor: objeto com dados da sessão (userId, createdAt, etc.)
const armazenamentoSessoes = new Map();
/**
 * @param {string} token - Token JWT do usuário autenticado
 * @param {Object} dadosSessao - Objeto contendo os dados da sessão (ex: { userId: 123 })
 * @returns {void}
*/
export const salvarSessao = (token, dadosSessao) => {
  if (!token) {
    return;
  }
  armazenamentoSessoes.set(token, {
    ...dadosSessao, // Espalha os dados da sessão fornecidos
    criadoEm: new Date().toISOString(), // Adiciona data/hora de criação em formato ISO
  });
};
/**
 * @param {string} token - Token JWT do usuário
 * @returns {Object|null} Objeto com os dados da sessão ou null se não encontrado
*/
export const obterSessao = (token) => {
  if (!token) {
    return null;
  }
  return armazenamentoSessoes.get(token) || null;
};
/**
 * @param {string} token
 * @returns {void}
*/
export const removerSessao = (token) => {
  if (!token) {
    return;
  }
  armazenamentoSessoes.delete(token);
};
/**
 * Limpa todas as sessões ativas do sistema.
 * @returns {void}
*/
export const limparTodasSessoes = () => {
  armazenamentoSessoes.clear();
};
