# Documentação Completa - DiabetsCare

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Sistema de Armazenamento](#sistema-de-armazenamento)
4. [Sistema de Autenticação](#sistema-de-autenticação)
5. [Proteção de Rotas](#proteção-de-rotas)
6. [Páginas e Funcionalidades](#páginas-e-funcionalidades)
7. [Serviços e Módulos](#serviços-e-módulos)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Como Usar](#como-usar)

---

## 🎯 Visão Geral

O **DiabetsCare** é um sistema web para gerenciamento de diabetes que utiliza **localStorage** e **sessionStorage** do navegador para simular um backend. O sistema permite:

- Cadastro e autenticação de usuários
- Registro e acompanhamento de níveis de glicemia
- Criação e interação com posts na comunidade
- Visualização de estatísticas e gráficos
- Gerenciamento de perfil de usuário

### Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização
- **JavaScript Puro** - Toda a lógica (sem frameworks)
- **localStorage** - Armazenamento persistente de dados
- **sessionStorage** - Armazenamento de sessão do usuário
- **Chart.js** - Gráficos de evolução da glicemia

---

## 📁 Estrutura de Arquivos

```
DiabetsCare/
└── frontend/
    ├── css/                    # Estilos das páginas
    │   ├── style.css
    │   ├── loginStyle.css
    │   ├── cadastroStyles.css
    │   ├── dashboardStyle.css
    │   ├── glicemia.css
    │   ├── feedStyle.css
    │   ├── perfilStyle.css
    │   └── ...
    │
    ├── js/                     # Scripts JavaScript
    │   ├── utils/
    │   │   ├── storage.js     # ⭐ MÓDULO PRINCIPAL - Sistema de storage
    │   │   └── api.js           # (não usado - mantido para compatibilidade)
    │   │
    │   ├── auth/
    │   │   ├── login.js         # Lógica de login
    │   │   └── register.js      # Lógica de cadastro
    │   │
    │   ├── dashboar/
    │   │   └── dashboard.js     # Lógica do dashboard
    │   │
    │   ├── glicemia/
    │   │   └── glicemia.js      # Lógica de registro de glicemia
    │   │
    │   ├── feed/
    │   │   └── feed.js          # Lógica do feed de posts
    │   │
    │   ├── perfil/
    │   │   ├── perfilComum.js   # (não usado - funcionalidade em perfil.html)
    │   │   └── perfilProf.js    # (não usado - funcionalidade em perfil.html)
    │   │
    │   └── main.js              # ⭐ SCRIPT PRINCIPAL - Proteção de rotas
    │
    ├── img/                     # Imagens e assets
    │   ├── logoDiabetesCare.png
    │   ├── user.png
    │   └── ...
    │
    └── *.html                   # Páginas HTML
        ├── index.html           # Página inicial (pública)
        ├── login.html           # Login (pública)
        ├── cadastro.html        # Cadastro (pública)
        ├── dashboard.html       # Dashboard (protegida)
        ├── glicemia.html        # Registro de glicemia (protegida)
        ├── feed.html            # Feed de posts (protegida)
        ├── post.html            # Criar post (protegida)
        ├── postView.html        # Ver post detalhado (protegida)
        ├── perfil.html          # Perfil do usuário (protegida)
        ├── perfil-prof.html     # Perfil profissional (protegida)
        ├── perfil_comum_edit.html      # Editar perfil comum (protegida)
        └── perfil_profissional_edit.html # Editar perfil profissional (protegida)
```

---

## 💾 Sistema de Armazenamento

### Arquivo: `js/utils/storage.js`

Este é o **módulo central** do sistema. Contém todos os serviços para gerenciar dados no localStorage e sessionStorage.

#### Chaves de Armazenamento

**localStorage:**
- `diabetsCare_usuarios` - Array com todos os usuários cadastrados
- `diabetsCare_usuarioLogado` - Dados do usuário atualmente logado (sem senha)
- `diabetsCare_glicemias` - Array com todos os registros de glicemia
- `diabetsCare_posts` - Array com todos os posts da comunidade

**sessionStorage:**
- `diabetsCare_userId` - ID do usuário logado (sessão)
- `diabetsCare_userEmail` - Email do usuário logado (sessão)

#### Serviços Disponíveis

##### 1. StorageService
Funções genéricas para localStorage:
- `salvar(chave, dados)` - Salva dados no localStorage
- `carregar(chave)` - Carrega dados do localStorage
- `remover(chave)` - Remove dados do localStorage
- `limpar()` - Limpa todo o localStorage

##### 2. SessionService
Funções para sessionStorage:
- `salvar(chave, dados)` - Salva dados no sessionStorage
- `carregar(chave)` - Carrega dados do sessionStorage
- `remover(chave)` - Remove dados do sessionStorage
- `limpar()` - Limpa todo o sessionStorage

##### 3. AuthService
Gerenciamento de autenticação:
- `estaLogado()` - Verifica se há usuário logado
- `obterUserId()` - Retorna o ID do usuário logado
- `obterUserEmail()` - Retorna o email do usuário logado
- `obterUsuario()` - Retorna objeto completo do usuário logado (sem senha)
- `fazerLogin(usuario)` - Define usuário como logado
- `fazerLogout()` - Remove dados de autenticação

##### 4. UserService
Gerenciamento de usuários:
- `obterTodos()` - Retorna todos os usuários
- `buscarPorEmail(email)` - Busca usuário por email
- `buscarPorId(id)` - Busca usuário por ID
- `criar(dadosUsuario)` - Cria novo usuário
- `validarLogin(email, senha)` - Valida credenciais de login

##### 5. GlicemiaService
Gerenciamento de registros de glicemia:
- `obterTodos()` - Retorna todos os registros
- `obterPorUsuario(userId)` - Retorna registros de um usuário específico
- `criar(dados)` - Cria novo registro de glicemia

##### 6. PostService
Gerenciamento de posts:
- `obterTodos()` - Retorna todos os posts (ordenados por data)
- `obterPorUsuario(userId)` - Retorna posts de um usuário
- `criar(dados)` - Cria novo post
- `curtir(postId)` - Adiciona curtida a um post
- `comentar(postId, texto)` - Adiciona comentário a um post

---

## 🔐 Sistema de Autenticação

### Fluxo de Login

1. **Usuário preenche formulário** (`login.html`)
2. **Validação de campos** (email e senha obrigatórios, formato de email)
3. **Busca usuário** usando `UserService.buscarPorEmail(email)`
4. **Valida senha** comparando com a senha armazenada
5. **Se válido**: `AuthService.fazerLogin(usuario)` salva:
   - ID e email no sessionStorage
   - Dados completos (sem senha) no localStorage
6. **Redireciona** para `dashboard.html`

### Fluxo de Cadastro

1. **Usuário preenche formulário** (`cadastro.html`)
2. **Validações**:
   - Todos os campos obrigatórios
   - Email válido (regex)
   - Senha com mínimo de 6 caracteres
   - Tipo de conta selecionado
3. **Verifica se email já existe** usando `UserService.buscarPorEmail()`
4. **Se não existe**: `UserService.criar()` cria novo usuário com:
   - ID único (timestamp)
   - Nome, email, senha, tipoConta
   - Data de cadastro
5. **Salva no localStorage** em `diabetsCare_usuarios`
6. **Redireciona** para `login.html`

### Estrutura de Dados do Usuário

```javascript
{
  id: "1234567890",              // ID único (timestamp)
  nome: "João Silva",            // Nome completo
  email: "joao@email.com",       // Email (único)
  senha: "senha123",             // Senha (em produção deveria ser hash)
  tipoConta: "comum",            // "comum" ou "profissional"
  dataCadastro: "2025-01-15...", // ISO string
  // Campos opcionais (adicionados na edição):
  idade: 35,
  tipoDiabetes: "Tipo 2",
  bio: "Descrição do usuário",
  avatar: "data:image/...",      // Base64 da imagem
  especialidade: "Endocrinologista", // Apenas profissionais
  crm: "12345",                  // Apenas profissionais
  experiencia: 10                // Apenas profissionais
}
```

---

## 🛡️ Proteção de Rotas

### Arquivo: `js/main.js`

Este script é responsável por proteger todas as páginas que requerem autenticação.

#### Como Funciona

1. **Execução Imediata**: Quando o script é carregado, executa `protegerRotas()` imediatamente (antes do DOM carregar)

2. **Verificação de Disponibilidade**: Aguarda `AuthService` estar disponível (storage.js carregado)

3. **Verificação de Página**: Verifica se a página atual requer autenticação:
   - **Páginas Públicas**: `login.html`, `cadastro.html`, `index.html`
   - **Todas as outras**: Requerem autenticação

4. **Verificação de Login**: Se a página requer autenticação:
   - Verifica se `AuthService.estaLogado()` retorna `true`
   - Se não estiver logado: redireciona para `login.html`

5. **Execução no DOMContentLoaded**: Executa novamente quando o DOM carrega (camada extra de segurança)

#### Páginas Protegidas

Todas estas páginas redirecionam para `login.html` se não autenticado:

- `dashboard.html`
- `glicemia.html`
- `feed.html`
- `post.html`
- `postView.html`
- `perfil.html`
- `perfil-prof.html`
- `perfil_comum_edit.html`
- `perfil_profissional_edit.html`

#### Ordem de Carregamento dos Scripts

**IMPORTANTE**: A ordem no HTML deve ser:

```html
<script src="js/utils/storage.js"></script>  <!-- 1º: Carrega serviços -->
<script src="js/main.js"></script>            <!-- 2º: Protege rotas -->
<script src="js/[outro].js"></script>        <!-- 3º: Scripts específicos -->
```

---

## 📄 Páginas e Funcionalidades

### Páginas Públicas

#### 1. `index.html` - Página Inicial
- **Acesso**: Público
- **Funcionalidade**: Página de apresentação do sistema
- **Scripts**: `storage.js`, `main.js`
- **Navegação**: Links para outras páginas

#### 2. `login.html` - Login
- **Acesso**: Público
- **Funcionalidade**: Autenticação de usuários
- **Scripts**: `storage.js`, `login.js`
- **Validações**:
  - Email obrigatório e formato válido
  - Senha obrigatória
- **Ação**: Redireciona para `dashboard.html` após login bem-sucedido

#### 3. `cadastro.html` - Cadastro
- **Acesso**: Público
- **Funcionalidade**: Criação de novas contas
- **Scripts**: `storage.js`, `register.js`
- **Validações**:
  - Nome completo obrigatório
  - Email válido e único
  - Senha com mínimo 6 caracteres
  - Tipo de conta selecionado
- **Ação**: Redireciona para `login.html` após cadastro

### Páginas Protegidas

#### 4. `dashboard.html` - Dashboard
- **Acesso**: Protegido (requer login)
- **Funcionalidade**: Visualização de estatísticas e gráficos de glicemia
- **Scripts**: `storage.js`, `main.js`, `dashboard.js`, Chart.js (CDN)
- **Exibe**:
  - Média de glicemia em jejum
  - Média de glicemia pós-prandial
  - Média de glicemia antes de dormir
  - Gráfico de evolução com 3 linhas (jejum, pós-prandial, antes de dormir)
- **Ações**:
  - Botão "Voltar" → `index.html`
  - Botão "Novo Registro" → `glicemia.html`

#### 5. `glicemia.html` - Registro de Glicemia
- **Acesso**: Protegido
- **Funcionalidade**: Registrar novos valores de glicemia
- **Scripts**: `storage.js`, `main.js`, `glicemia.js`
- **Campos**:
  - Glicemia em jejum (slider 50-200 mg/dL)
  - Glicemia pós-prandial (slider 50-250 mg/dL)
  - Glicemia antes de dormir (slider 50-250 mg/dL)
  - Observações (textarea)
- **Interatividade**:
  - Sliders atualizam número em tempo real
  - Status muda dinamicamente (Baixa/Normal/Alta)
  - Valores de referência:
    - Baixa: < 70 mg/dL
    - Normal: 70-140 mg/dL
    - Alta: > 140 mg/dL
- **Ação**: Salva registro e oferece redirecionar para dashboard

#### 6. `feed.html` - Feed de Posts
- **Acesso**: Protegido
- **Funcionalidade**: Visualizar e criar posts da comunidade
- **Scripts**: `storage.js`, `main.js`, `feed.js`
- **Funcionalidades**:
  - Exibe todos os posts (mais recentes primeiro)
  - Campo para criar novo post (sem título)
  - Botão "Publicar" para criar post
  - Curtir posts (botão com contador)
  - Comentar posts (prompt para comentário)
  - Posts com título são clicáveis → `postView.html`
- **Formatação de Data**: "Há X minutos/horas/dias" ou data completa

#### 7. `post.html` - Criar Post
- **Acesso**: Protegido
- **Funcionalidade**: Criar posts com título e conteúdo formatado
- **Scripts**: `storage.js`, `main.js`
- **Campos**:
  - Título (obrigatório)
  - Editor de texto rico (contenteditable)
  - Toolbar com formatação (negrito, itálico, listas, etc.)
- **Ação**: Salva post e redireciona para `feed.html`

#### 8. `postView.html` - Ver Post Detalhado
- **Acesso**: Protegido
- **Funcionalidade**: Visualizar post completo
- **Scripts**: `storage.js`, `main.js`
- **Recebe ID**: Via URL (`?id=123`) ou sessionStorage
- **Exibe**: Título, autor, data formatada, conteúdo completo
- **Ação**: Botão "Voltar ao Feed" → `feed.html`

#### 9. `perfil.html` - Perfil do Usuário
- **Acesso**: Protegido
- **Funcionalidade**: Visualizar perfil do usuário logado
- **Scripts**: `storage.js`, `main.js`
- **Exibe**:
  - Nome do usuário
  - Tipo de conta
  - Biografia
  - Estatísticas de glicemia (último registro)
  - Posts recentes do usuário
- **Ações**:
  - Botão "Consultar dashboard" → `dashboard.html`
  - Botão "Editar perfil" → página de edição correspondente

#### 10. `perfil-prof.html` - Perfil Profissional
- **Acesso**: Protegido (apenas profissionais)
- **Funcionalidade**: Perfil específico para profissionais
- **Scripts**: `storage.js`, `main.js`
- **Validação**: Verifica se `tipoConta === 'profissional'`
- **Exibe**:
  - Nome, especialidade, CRM/COREN
  - Anos de experiência
  - Biografia profissional
  - Artigos publicados
- **Ações**:
  - Botão "Editar Perfil" → `perfil_profissional_edit.html`
  - Botão "Criar Artigo" → `post.html`

#### 11. `perfil_comum_edit.html` - Editar Perfil Comum
- **Acesso**: Protegido
- **Funcionalidade**: Editar dados do perfil
- **Scripts**: `storage.js`, `main.js`
- **Campos Editáveis**:
  - Nome completo
  - Idade
  - Tipo de diabetes
  - Biografia
  - Avatar (upload de imagem)
  - Últimas medidas (opcional)
- **Ação**: Salva alterações e redireciona para `perfil.html`

#### 12. `perfil_profissional_edit.html` - Editar Perfil Profissional
- **Acesso**: Protegido (apenas profissionais)
- **Funcionalidade**: Editar dados do perfil profissional
- **Scripts**: `storage.js`, `main.js`
- **Validação**: Verifica se é profissional
- **Campos Editáveis**:
  - Nome completo
  - Especialidade
  - CRM/CRN/COREN
  - Anos de experiência
  - Bio profissional
  - Avatar
- **Ação**: Salva alterações e redireciona para `perfil.html`

---

## 🔄 Fluxo de Dados

### 1. Cadastro de Usuário

```
cadastro.html
    ↓ (preenche formulário)
register.js
    ↓ (valida dados)
UserService.criar()
    ↓ (salva)
localStorage['diabetsCare_usuarios']
    ↓
Redireciona para login.html
```

### 2. Login

```
login.html
    ↓ (preenche email/senha)
login.js
    ↓ (valida)
UserService.validarLogin()
    ↓ (retorna usuário sem senha)
AuthService.fazerLogin()
    ↓ (salva)
sessionStorage['diabetsCare_userId']
sessionStorage['diabetsCare_userEmail']
localStorage['diabetsCare_usuarioLogado']
    ↓
Redireciona para dashboard.html
```

### 3. Registro de Glicemia

```
glicemia.html
    ↓ (preenche valores)
glicemia.js
    ↓ (captura dados)
GlicemiaService.criar()
    ↓ (associa ao userId)
localStorage['diabetsCare_glicemias']
    ↓
Redireciona para dashboard.html (opcional)
```

### 4. Visualização no Dashboard

```
dashboard.html
    ↓ (carrega)
dashboard.js
    ↓
AuthService.obterUsuario()
    ↓ (obtém userId)
GlicemiaService.obterPorUsuario(userId)
    ↓ (filtra registros)
Calcula médias e renderiza gráfico
```

### 5. Criação de Post

```
post.html ou feed.html
    ↓ (escreve conteúdo)
PostService.criar()
    ↓ (associa ao authorId)
localStorage['diabetsCare_posts']
    ↓
Redireciona para feed.html
```

### 6. Interação com Posts

```
feed.html
    ↓ (clica curtir/comentar)
PostService.curtir(postId)
PostService.comentar(postId, texto)
    ↓ (atualiza array)
localStorage['diabetsCare_posts']
    ↓
Recarrega posts na tela
```

---

## 🎨 Estrutura de Dados

### Usuário

```javascript
{
  id: "1234567890",
  nome: "João Silva",
  email: "joao@email.com",
  senha: "senha123",  // ⚠️ Em produção deveria ser hash
  tipoConta: "comum" | "profissional",
  dataCadastro: "2025-01-15T10:30:00.000Z",
  // Opcionais:
  idade: 35,
  tipoDiabetes: "Tipo 2",
  bio: "Descrição...",
  avatar: "data:image/png;base64,...",
  especialidade: "Endocrinologista",  // Apenas profissionais
  crm: "12345",                       // Apenas profissionais
  experiencia: 10                     // Apenas profissionais
}
```

### Registro de Glicemia

```javascript
{
  id: "1234567890",
  userId: "9876543210",  // ID do usuário que criou
  glicemiaJejum: 95,
  glicemiaPosPrandial: 140,
  glicemiaAntesDormir: 120,
  observacoes: "Me senti bem hoje",
  dataHora: "2025-01-15T10:30:00.000Z",
  data: "15/01/2025",
  hora: "10:30"
}
```

### Post

```javascript
{
  id: "1234567890",
  authorId: "9876543210",      // ID do autor
  authorName: "João Silva",    // Nome do autor
  title: "Dicas de alimentação",  // Opcional
  content: "<p>Conteúdo...</p>",  // HTML
  createdAt: "2025-01-15T10:30:00.000Z",
  curtidas: 5,
  comentarios: [
    {
      id: "111",
      authorId: "999",
      authorName: "Maria",
      texto: "Ótima dica!",
      createdAt: "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

---

## 🚀 Como Usar

### Para Desenvolvedores

1. **Abrir o projeto**: Abra a pasta `frontend` em um servidor local
2. **Ordem de scripts**: Sempre carregue `storage.js` antes de `main.js`
3. **Testar autenticação**: Use modo anônimo do navegador
4. **Limpar dados**: Use `localStorage.clear()` no console para resetar

### Para Usuários

1. **Cadastro**: Acesse `cadastro.html` e crie uma conta
2. **Login**: Faça login com email e senha
3. **Registrar Glicemia**: Vá em "Novo Registro" e preencha os valores
4. **Ver Estatísticas**: Acesse o Dashboard para ver médias e gráficos
5. **Interagir**: Use o Feed para ver e criar posts
6. **Editar Perfil**: Acesse seu perfil e clique em "Editar"

### Comandos Úteis no Console

```javascript
// Ver usuários cadastrados
JSON.parse(localStorage.getItem('diabetsCare_usuarios'))

// Ver usuário logado
JSON.parse(localStorage.getItem('diabetsCare_usuarioLogado'))

// Ver registros de glicemia
JSON.parse(localStorage.getItem('diabetsCare_glicemias'))

// Ver posts
JSON.parse(localStorage.getItem('diabetsCare_posts'))

// Limpar tudo
localStorage.clear()
sessionStorage.clear()

// Verificar se está logado
AuthService.estaLogado()

// Obter usuário atual
AuthService.obterUsuario()
```

---

## ⚠️ Observações Importantes

### Segurança

1. **Senhas em texto plano**: As senhas são armazenadas em texto plano. Em produção, deveriam ser hasheadas.
2. **Sem validação de servidor**: Toda validação é client-side. Em produção, deveria haver validação no servidor.
3. **Dados locais**: Todos os dados ficam no navegador. Ao limpar o navegador, os dados são perdidos.

### Limitações

1. **Sem persistência real**: Dados são perdidos ao limpar localStorage
2. **Sem sincronização**: Cada navegador tem seus próprios dados
3. **Sem validação de servidor**: Tudo é validado apenas no cliente

### Melhorias Futuras

1. Implementar hash de senhas
2. Adicionar validação de servidor
3. Implementar sincronização com backend real
4. Adicionar recuperação de senha
5. Implementar notificações
6. Adicionar exportação de dados

---

## 📝 Notas de Desenvolvimento

### Decisões de Design

1. **localStorage apenas para usuários**: Conforme solicitado, localStorage é usado apenas para dados de usuários. Outros dados (glicemias, posts) também usam localStorage, mas isso pode ser migrado no futuro.

2. **Proteção dupla**: `main.js` protege rotas em duas camadas (imediata + DOMContentLoaded) para garantir segurança.

3. **Serviços centralizados**: Toda lógica de storage está centralizada em `storage.js` para facilitar manutenção.

4. **Sem dependências externas**: Sistema usa apenas JavaScript puro, sem frameworks, para facilitar aprendizado.

---

## 🔧 Troubleshooting

### Problema: Página não redireciona para login

**Solução**: Verifique se `storage.js` está sendo carregado ANTES de `main.js` no HTML.

### Problema: Dados não aparecem

**Solução**: 
1. Verifique o console do navegador (F12) para erros
2. Verifique se os dados existem no localStorage
3. Verifique se está logado: `AuthService.estaLogado()`

### Problema: Sliders não atualizam

**Solução**: Verifique se `glicemia.js` está carregado e se os elementos HTML têm os IDs corretos.

### Problema: Gráfico não aparece

**Solução**: 
1. Verifique se Chart.js está carregado (CDN)
2. Verifique se há registros de glicemia
3. Verifique o console para erros

---

## 📚 Referências

- **localStorage API**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- **sessionStorage API**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/sessionStorage)
- **Chart.js**: [Documentação](https://www.chartjs.org/docs/)

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0
**Autor**: Sistema DiabetsCare

