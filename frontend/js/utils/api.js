/**
 * api.js
 * 
 * Configuração da URL base da API do backend.
 * 
 * Este módulo centraliza a definição da URL do servidor backend, facilitando
 * a manutenção e permitindo alterar o endereço em um único lugar caso seja
 * necessário (ex: mudança de ambiente de desenvolvimento para produção).
 * 
 * IMPORTANTE: Certifique-se de que esta URL corresponde ao endereço onde
 * o servidor backend está rodando. Por padrão, o servidor Express roda
 * na porta 3000.
 */

// URL base da API do backend
// Esta constante é exportada para ser usada em outros módulos que precisam
// fazer requisições HTTP para o servidor
export const urlApi = "http://localhost:3000";
