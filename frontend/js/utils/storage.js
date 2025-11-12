/**
 * storage.js
 * 
 * Módulo centralizado para gerenciamento do localStorage e sessionStorage.
 * Abstrai o uso do armazenamento local para facilitar manutenção e padronização.
 */

/**
 * Chaves utilizadas no localStorage
 */
const STORAGE_KEYS = {
  USUARIOS: 'diabetsCare_usuarios',
  USUARIO_LOGADO: 'diabetsCare_usuarioLogado',
  GLICEMIAS: 'diabetsCare_glicemias',
  POSTS: 'diabetsCare_posts'
};

/**
 * Chaves utilizadas no sessionStorage
 */
const SESSION_KEYS = {
  USUARIO_ID: 'diabetsCare_userId',
  USUARIO_EMAIL: 'diabetsCare_userEmail'
};

/**
 * Storage Service - Funções genéricas para localStorage
 */
const StorageService = {
  /**
   * Salva dados no localStorage
   * @param {string} chave - Chave para armazenar
   * @param {any} dados - Dados a serem salvos (será convertido para JSON)
   */
  salvar(chave, dados) {
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
      return true;
    } catch (erro) {
      console.error(`Erro ao salvar ${chave}:`, erro);
      return false;
    }
  },

  /**
   * Carrega dados do localStorage
   * @param {string} chave - Chave para recuperar
   * @returns {any|null} Dados recuperados ou null se não existir
   */
  carregar(chave) {
    try {
      const dados = localStorage.getItem(chave);
      return dados ? JSON.parse(dados) : null;
    } catch (erro) {
      console.error(`Erro ao carregar ${chave}:`, erro);
      return null;
    }
  },

  /**
   * Remove dados do localStorage
   * @param {string} chave - Chave para remover
   */
  remover(chave) {
    try {
      localStorage.removeItem(chave);
      return true;
    } catch (erro) {
      console.error(`Erro ao remover ${chave}:`, erro);
      return false;
    }
  },

  /**
   * Limpa todo o localStorage
   */
  limpar() {
    try {
      localStorage.clear();
      return true;
    } catch (erro) {
      console.error('Erro ao limpar localStorage:', erro);
      return false;
    }
  }
};

/**
 * Session Service - Funções para sessionStorage
 */
const SessionService = {
  /**
   * Salva dados no sessionStorage
   * @param {string} chave - Chave para armazenar
   * @param {any} dados - Dados a serem salvos
   */
  salvar(chave, dados) {
    try {
      sessionStorage.setItem(chave, JSON.stringify(dados));
      return true;
    } catch (erro) {
      console.error(`Erro ao salvar no sessionStorage ${chave}:`, erro);
      return false;
    }
  },

  /**
   * Carrega dados do sessionStorage
   * @param {string} chave - Chave para recuperar
   * @returns {any|null} Dados recuperados ou null se não existir
   */
  carregar(chave) {
    try {
      const dados = sessionStorage.getItem(chave);
      return dados ? JSON.parse(dados) : null;
    } catch (erro) {
      console.error(`Erro ao carregar do sessionStorage ${chave}:`, erro);
      return null;
    }
  },

  /**
   * Remove dados do sessionStorage
   * @param {string} chave - Chave para remover
   */
  remover(chave) {
    try {
      sessionStorage.removeItem(chave);
      return true;
    } catch (erro) {
      console.error(`Erro ao remover do sessionStorage ${chave}:`, erro);
      return false;
    }
  },

  /**
   * Limpa todo o sessionStorage
   */
  limpar() {
    try {
      sessionStorage.clear();
      return true;
    } catch (erro) {
      console.error('Erro ao limpar sessionStorage:', erro);
      return false;
    }
  }
};

/**
 * Auth Service - Funções específicas para autenticação
 */
const AuthService = {
  /**
   * Verifica se o usuário está logado
   * @returns {boolean} True se estiver logado
   */
  estaLogado() {
    const userId = SessionService.carregar(SESSION_KEYS.USUARIO_ID);
    return userId !== null && userId !== '';
  },

  /**
   * Obtém o ID do usuário logado
   * @returns {string|null} ID do usuário ou null
   */
  obterUserId() {
    return SessionService.carregar(SESSION_KEYS.USUARIO_ID);
  },

  /**
   * Obtém o email do usuário logado
   * @returns {string|null} Email do usuário ou null
   */
  obterUserEmail() {
    return SessionService.carregar(SESSION_KEYS.USUARIO_EMAIL);
  },

  /**
   * Obtém os dados completos do usuário logado
   * @returns {Object|null} Dados do usuário ou null
   */
  obterUsuario() {
    // Primeiro tenta buscar do localStorage onde foi salvo diretamente
    const usuarioSalvo = StorageService.carregar(STORAGE_KEYS.USUARIO_LOGADO);
    if (usuarioSalvo) {
      return usuarioSalvo;
    }

    // Se não encontrou, busca pelo ID no array de usuários
    const userId = this.obterUserId();
    if (!userId) return null;

    const usuarios = StorageService.carregar(STORAGE_KEYS.USUARIOS) || [];
    const usuario = usuarios.find(u => u.id === userId);
    
    // Se encontrou, salva novamente no localStorage para facilitar acesso futuro
    if (usuario) {
      // Remove senha antes de salvar
      const { senha: _, ...usuarioSemSenha } = usuario;
      StorageService.salvar(STORAGE_KEYS.USUARIO_LOGADO, usuarioSemSenha);
      return usuarioSemSenha;
    }
    
    return null;
  },

  /**
   * Define o usuário como logado
   * @param {Object} usuario - Dados do usuário (já sem senha)
   */
  fazerLogin(usuario) {
    if (!usuario || !usuario.id) {
      console.error('Erro: tentativa de fazer login sem dados válidos do usuário');
      return;
    }
    
    SessionService.salvar(SESSION_KEYS.USUARIO_ID, usuario.id);
    SessionService.salvar(SESSION_KEYS.USUARIO_EMAIL, usuario.email);
    
    // Garante que a senha não seja salva
    const { senha: _, ...usuarioSemSenha } = usuario;
    StorageService.salvar(STORAGE_KEYS.USUARIO_LOGADO, usuarioSemSenha);
    
    console.log('Login realizado com sucesso para:', usuarioSemSenha.email);
  },

  /**
   * Faz logout do usuário
   */
  fazerLogout() {
    SessionService.remover(SESSION_KEYS.USUARIO_ID);
    SessionService.remover(SESSION_KEYS.USUARIO_EMAIL);
    StorageService.remover(STORAGE_KEYS.USUARIO_LOGADO);
  }
};

/**
 * User Service - Funções para gerenciamento de usuários
 */
const UserService = {
  /**
   * Obtém todos os usuários
   * @returns {Array} Array de usuários
   */
  obterTodos() {
    return StorageService.carregar(STORAGE_KEYS.USUARIOS) || [];
  },

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  buscarPorEmail(email) {
    const usuarios = this.obterTodos();
    return usuarios.find(u => u.email === email) || null;
  },

  /**
   * Busca usuário por ID
   * @param {string} id - ID do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  buscarPorId(id) {
    const usuarios = this.obterTodos();
    return usuarios.find(u => u.id === id) || null;
  },

  /**
   * Cria um novo usuário
   * @param {Object} dadosUsuario - Dados do usuário (nome, email, senha, tipoConta)
   * @returns {Object} Usuário criado com ID
   */
  criar(dadosUsuario) {
    const usuarios = this.obterTodos();
    
    // Verifica se email já existe
    if (this.buscarPorEmail(dadosUsuario.email)) {
      throw new Error('Email já cadastrado');
    }

    const novoUsuario = {
      id: Date.now().toString(),
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senha: dadosUsuario.senha, // Em produção, isso deveria ser hash
      tipoConta: dadosUsuario.tipoConta || 'comum',
      dataCadastro: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    StorageService.salvar(STORAGE_KEYS.USUARIOS, usuarios);
    
    return novoUsuario;
  },

  /**
   * Valida credenciais de login
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Object|null} Usuário se credenciais válidas, null caso contrário
   */
  validarLogin(email, senha) {
    const usuario = this.buscarPorEmail(email);
    if (!usuario) return null;
    
    if (usuario.senha !== senha) return null;
    
    // Remove senha antes de retornar
    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
};

/**
 * Glicemia Service - Funções para gerenciamento de registros de glicemia
 */
const GlicemiaService = {
  /**
   * Obtém todos os registros de glicemia
   * @returns {Array} Array de registros
   */
  obterTodos() {
    return StorageService.carregar(STORAGE_KEYS.GLICEMIAS) || [];
  },

  /**
   * Obtém registros de um usuário específico
   * @param {string} userId - ID do usuário
   * @returns {Array} Array de registros do usuário
   */
  obterPorUsuario(userId) {
    const todos = this.obterTodos();
    return todos.filter(r => r.userId === userId);
  },

  /**
   * Cria um novo registro de glicemia
   * @param {Object} dados - Dados do registro
   * @returns {Object} Registro criado
   */
  criar(dados) {
    const registros = this.obterTodos();
    const userId = AuthService.obterUserId();
    
    if (!userId) {
      throw new Error('Usuário não está logado');
    }

    const novoRegistro = {
      id: Date.now().toString(),
      userId: userId,
      glicemiaJejum: parseFloat(dados.glicemiaJejum),
      glicemiaPosPrandial: parseFloat(dados.glicemiaPosPrandial),
      glicemiaAntesDormir: parseFloat(dados.glicemiaAntesDormir),
      observacoes: dados.observacoes || '',
      dataHora: new Date().toISOString(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    registros.push(novoRegistro);
    StorageService.salvar(STORAGE_KEYS.GLICEMIAS, registros);
    
    return novoRegistro;
  }
};

/**
 * Post Service - Funções para gerenciamento de posts
 */
const PostService = {
  /**
   * Obtém todos os posts
   * @returns {Array} Array de posts ordenados por data (mais recente primeiro)
   */
  obterTodos() {
    const posts = StorageService.carregar(STORAGE_KEYS.POSTS) || [];
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Obtém posts de um usuário específico
   * @param {string} userId - ID do usuário
   * @returns {Array} Array de posts do usuário
   */
  obterPorUsuario(userId) {
    const todos = this.obterTodos();
    return todos.filter(p => p.authorId === userId);
  },

  /**
   * Cria um novo post
   * @param {Object} dados - Dados do post (titulo, conteudo)
   * @returns {Object} Post criado
   */
  criar(dados) {
    const posts = this.obterTodos();
    const userId = AuthService.obterUserId();
    const usuario = AuthService.obterUsuario();
    
    if (!userId || !usuario) {
      throw new Error('Usuário não está logado');
    }

    const novoPost = {
      id: Date.now().toString(),
      authorId: userId,
      authorName: usuario.nome,
      title: dados.titulo || dados.title || '',
      content: dados.conteudo || dados.content || '',
      createdAt: new Date().toISOString(),
      curtidas: 0,
      comentarios: []
    };

    posts.unshift(novoPost);
    StorageService.salvar(STORAGE_KEYS.POSTS, posts);
    
    return novoPost;
  },

  /**
   * Adiciona uma curtida a um post
   * @param {string} postId - ID do post
   */
  curtir(postId) {
    const posts = this.obterTodos();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      throw new Error('Post não encontrado');
    }

    post.curtidas = (post.curtidas || 0) + 1;
    StorageService.salvar(STORAGE_KEYS.POSTS, posts);
  },

  /**
   * Adiciona um comentário a um post
   * @param {string} postId - ID do post
   * @param {string} texto - Texto do comentário
   */
  comentar(postId, texto) {
    const posts = this.obterTodos();
    const post = posts.find(p => p.id === postId);
    const usuario = AuthService.obterUsuario();
    
    if (!post) {
      throw new Error('Post não encontrado');
    }

    if (!usuario) {
      throw new Error('Usuário não está logado');
    }

    if (!post.comentarios) {
      post.comentarios = [];
    }

    post.comentarios.push({
      id: Date.now().toString(),
      authorId: usuario.id,
      authorName: usuario.nome,
      texto: texto.trim(),
      createdAt: new Date().toISOString()
    });

    StorageService.salvar(STORAGE_KEYS.POSTS, posts);
  }
};

// Exporta todos os serviços
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StorageService,
    SessionService,
    AuthService,
    UserService,
    GlicemiaService,
    PostService,
    STORAGE_KEYS,
    SESSION_KEYS
  };
}

