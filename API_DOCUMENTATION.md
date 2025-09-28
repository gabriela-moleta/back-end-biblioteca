# 📚 Biblioverse API - Documentação Completa

> **Backend completo para o Biblioverse** - Sistema de biblioteca digital sem autenticação obrigatória

## 🌐 Base URL
```
http://localhost:4000
```

## ✅ Status da API

### Verificar saúde do servidor
```http
GET /health
```

**Resposta de sucesso:**
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2025-09-28T10:30:00.000Z",
  "message": "Biblioverse API funcionando perfeitamente!"
}
```

---

## 📖 Livros - Endpoints Completos

### 1. Listar todos os livros (com busca e filtros avançados)
```http
GET /books
```

**Parâmetros de query disponíveis:**
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `q` | string | Busca geral (título, autor, descrição, gênero) | `q=harry potter` |
| `title` | string | Filtro específico por título | `title=1984` |
| `author` | string | Filtro específico por autor | `author=George Orwell` |
| `genre` | string | Filtro por gênero | `genre=Fantasia` |
| `year` | number | Filtro por ano de publicação | `year=2020` |
| `tag` | string | Filtro por tag específica | `tag=clássico` |
| `sort` | string | Campo para ordenação | `sort=publishYear` |
| `order` | string | Direção (`asc` ou `desc`) | `order=desc` |
| `page` | number | Número da página (início: 1) | `page=2` |
| `limit` | number | Itens por página (max: 100) | `limit=10` |

**Campos disponíveis para ordenação (`sort`):**
- `title` - Por título
- `author` - Por autor
- `publishYear` - Por ano de publicação
- `createdAt` - Por data de criação
- `updatedAt` - Por data de atualização

**Exemplos de uso:**
```http
# Busca geral
GET /books?q=fantasia

# Livros de fantasia publicados após 2000, ordenados por ano
GET /books?genre=Fantasia&year=2000&sort=publishYear&order=desc

# Página 2 com 5 livros por página
GET /books?page=2&limit=5

# Livros do autor específico
GET /books?author=J.K. Rowling

# Combinando filtros
GET /books?q=dragon&genre=Fantasia&sort=title&order=asc&page=1&limit=20
```

**Resposta de sucesso:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Harry Potter e a Pedra Filosofal",
      "author": "J.K. Rowling",
      "description": "Um jovem bruxo descobre seu destino mágico...",
      "coverImage": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      "publishYear": 1997,
      "genre": "Fantasia",
      "tags": ["fantasia", "magia", "jovem adulto", "aventura", "clássico moderno"],
      "isbn": "978-0439708180",
      "_count": {
        "favorites": 15,
        "reviews": 8
      },
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "pages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Obter detalhes completos de um livro específico
```http
GET /books/:id
```

**Exemplo:**
```http
GET /books/1
```

**Resposta de sucesso:**
```json
{
  "id": 1,
  "title": "Harry Potter e a Pedra Filosofal",
  "author": "J.K. Rowling",
  "description": "Um jovem bruxo descobre seu destino mágico em uma escola de magia e bruxaria. Uma jornada épica de amizade, coragem e descobertas.",
  "coverImage": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  "publishYear": 1997,
  "genre": "Fantasia",
  "tags": ["fantasia", "magia", "jovem adulto", "aventura", "clássico moderno"],
  "isbn": "978-0439708180",
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Obra-prima da literatura fantástica! Mudou minha vida.",
      "user": {
        "id": 1,
        "name": "Leitor Apaixonado",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
      },
      "createdAt": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 2,
      "rating": 4,
      "comment": "Excelente início de série, muito envolvente.",
      "user": {
        "id": 2,
        "name": "Crítico Literário",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
      },
      "createdAt": "2025-09-28T09:30:00.000Z"
    }
  ],
  "_count": {
    "favorites": 15,
    "reviews": 8
  },
  "averageRating": 4.6,
  "createdAt": "2025-09-28T10:00:00.000Z",
  "updatedAt": "2025-09-28T10:00:00.000Z"
}
```

### 3. Criar um novo livro
```http
POST /books
```

**Body (application/json):**
```json
{
  "title": "O Nome do Vento",
  "author": "Patrick Rothfuss",
  "description": "A história lendária de Kvothe, contada por ele mesmo...",
  "coverImage": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
  "publishYear": 2007,
  "genre": "Fantasia Épica",
  "tags": ["fantasia", "épico", "magia", "aventura", "música"],
  "isbn": "978-0756404079"
}
```

**Resposta de sucesso (201):**
```json
{
  "id": 33,
  "title": "O Nome do Vento",
  "author": "Patrick Rothfuss",
  "description": "A história lendária de Kvothe, contada por ele mesmo...",
  "coverImage": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
  "publishYear": 2007,
  "genre": "Fantasia Épica",
  "tags": ["fantasia", "épico", "magia", "aventura", "música"],
  "isbn": "978-0756404079",
  "createdAt": "2025-09-28T11:00:00.000Z",
  "updatedAt": "2025-09-28T11:00:00.000Z"
}
```

### 4. Atualizar um livro existente
```http
PUT /books/:id
```

**Body (campos opcionais):**
```json
{
  "title": "Título Atualizado",
  "description": "Nova descrição mais detalhada...",
  "tags": ["nova-tag", "atualizada"]
}
```

### 5. Excluir um livro
```http
DELETE /books/:id
```

**Resposta de sucesso (204): No Content**

---

## 👥 Autores - Endpoints Completos

### 1. Listar todos os autores
```http
GET /authors
```

**Parâmetros de query:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `q` | string | Busca por nome do autor |
| `page` | number | Número da página |
| `limit` | number | Itens por página (max: 100) |

**Exemplo:**
```http
GET /authors?q=tolkien&page=1&limit=10
```

**Resposta:**
```json
{
  "data": [
    {
      "name": "J.R.R. Tolkien",
      "bookCount": 3,
      "genres": ["Fantasia", "Épico"],
      "mostRecentBook": "O Retorno do Rei"
    },
    {
      "name": "George R.R. Martin",
      "bookCount": 2,
      "genres": ["Fantasia", "Drama"],
      "mostRecentBook": "A Dança dos Dragões"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. Obter livros de um autor específico
```http
GET /authors/:authorName/books
```

**Exemplo:**
```http
GET /authors/J.K.%20Rowling/books
```

**Resposta:**
```json
{
  "author": "J.K. Rowling",
  "books": [
    {
      "id": 1,
      "title": "Harry Potter e a Pedra Filosofal",
      "publishYear": 1997,
      "genre": "Fantasia",
      "reviewCount": 8
    }
  ],
  "totalBooks": 1
}
```

---

## 🏷️ Tags - Sistema Completo

### 1. Listar todas as tags
```http
GET /tags
```

**Parâmetros de query:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `q` | string | Busca por nome da tag |
| `sort` | string | Ordenação (`name`, `bookCount`) |
| `order` | string | Direção (`asc`, `desc`) |
| `limit` | number | Limite de resultados |

**Exemplo:**
```http
GET /tags?sort=bookCount&order=desc&limit=20
```

**Resposta:**
```json
{
  "data": [
    {
      "name": "fantasia",
      "bookCount": 12
    },
    {
      "name": "clássico",
      "bookCount": 9
    },
    {
      "name": "romance",
      "bookCount": 7
    }
  ],
  "total": 45
}
```

### 2. Obter livros por tag
```http
GET /tags/:tagName/books
```

**Parâmetros de query:**
- Todos os parâmetros de `/books` (paginação, ordenação, etc.)

**Exemplo:**
```http
GET /tags/fantasia/books?sort=publishYear&order=desc&page=1&limit=10
```

---

## ⭐ Favoritos - Sistema Completo

### 1. Alternar favorito (adicionar/remover)
```http
POST /favorites/toggle
```

**Body:**
```json
{
  "bookId": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "action": "added",
  "message": "Livro adicionado aos favoritos",
  "bookId": 1
}
```

### 2. Adicionar aos favoritos
```http
POST /favorites
```

**Body:**
```json
{
  "bookId": 1
}
```

### 3. Remover dos favoritos
```http
DELETE /favorites/:bookId
```

### 4. Listar favoritos
```http
GET /favorites
```

**Nota:** Como não há autenticação obrigatória, o frontend deve gerenciar favoritos usando localStorage. Esta API valida a existência dos livros.

---

## 📝 Avaliações (Reviews) - Sistema Completo

### 1. Criar avaliação
```http
POST /reviews
```

**Body:**
```json
{
  "bookId": 1,
  "userId": 1,
  "rating": 5,
  "comment": "Livro fantástico! Recomendo muito para quem gosta de fantasia."
}
```

**Validações:**
- `rating`: 1-5 (obrigatório)
- `bookId`: deve existir
- `userId`: deve existir
- `comment`: opcional, mas recomendado

### 2. Obter avaliações de um livro
```http
GET /reviews/book/:bookId
```

**Parâmetros de query:**
- `page`, `limit`: paginação
- `sort`: `rating`, `createdAt`
- `order`: `asc`, `desc`

### 3. Obter avaliações de um usuário
```http
GET /reviews/user?userId=1
```

### 4. Atualizar avaliação
```http
PUT /reviews/:reviewId
```

**Body:**
```json
{
  "rating": 4,
  "comment": "Após uma segunda leitura, ainda é muito bom!"
}
```

### 5. Excluir avaliação
```http
DELETE /reviews/:reviewId
```

---

## 📚 Estantes (Shelves) - Sistema Completo

### 1. Criar estante
```http
POST /shelves
```

**Body:**
```json
{
  "name": "Lidos em 2025",
  "description": "Todos os livros que li este ano",
  "userId": 1,
  "isPublic": true
}
```

### 2. Listar estantes de um usuário
```http
GET /shelves?userId=1
```

### 3. Obter detalhes de uma estante
```http
GET /shelves/:shelfId
```

### 4. Adicionar livro à estante
```http
POST /shelves/books
```

**Body:**
```json
{
  "shelfId": 1,
  "bookId": 1
}
```

### 5. Remover livro da estante
```http
DELETE /shelves/:shelfId/books/:bookId
```

---

## 🔐 Autenticação (Opcional)

### Sistema de usuários disponível mas não obrigatório

### 1. Registrar usuário
```http
POST /auth/register
```

### 2. Fazer login
```http
POST /auth/login
```

### 3. Obter perfil do usuário
```http
GET /auth/profile/:userId
```

---

## 🚨 Códigos de Resposta HTTP

| Código | Status | Descrição |
|--------|--------|-----------|
| `200` | OK | Sucesso na consulta |
| `201` | Created | Recurso criado com sucesso |
| `204` | No Content | Sucesso em operação de exclusão |
| `400` | Bad Request | Dados inválidos na requisição |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito (ex: livro já existe) |
| `422` | Unprocessable Entity | Erro de validação |
| `500` | Internal Server Error | Erro interno do servidor |

## 🔧 Formato de Erro Padronizado

```json
{
  "error": {
    "message": "Mensagem de erro descritiva",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "title",
      "reason": "Campo obrigatório"
    },
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

---

## 💻 Guia de Integração Frontend

### 1. **Configuração Base**
```javascript
const API_BASE_URL = 'http://localhost:4000';

// Função auxiliar para requisições
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
```

### 2. **Exemplos Práticos**

#### Listar livros com busca
```javascript
async function searchBooks(query, page = 1) {
  return apiRequest(`/books?q=${encodeURIComponent(query)}&page=${page}&limit=12`);
}
```

#### Obter detalhes de um livro
```javascript
async function getBookDetails(bookId) {
  return apiRequest(`/books/${bookId}`);
}
```

#### Gerenciar favoritos (com localStorage)
```javascript
// Como não há autenticação obrigatória, use localStorage
function toggleFavorite(bookId) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const index = favorites.indexOf(bookId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(bookId);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  return favorites.includes(bookId);
}

function isFavorite(bookId) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return favorites.includes(bookId);
}
```

#### Criar avaliação
```javascript
async function createReview(bookId, rating, comment) {
  return apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify({
      bookId: parseInt(bookId),
      userId: 1, // ID fixo ou do localStorage
      rating: parseInt(rating),
      comment: comment
    })
  });
}
```

### 3. **Funcionalidades Prontas para Uso**

✅ **Catálogo de Livros**: 32+ livros pré-cadastrados  
✅ **Busca Avançada**: Por título, autor, gênero, tags  
✅ **Filtros**: Ano, gênero, ordenação personalizada  
✅ **Paginação**: Sistema completo implementado  
✅ **Detalhes do Livro**: Informações completas + reviews  
✅ **Sistema de Tags**: Navegação por categorias  
✅ **Autores**: Listagem e livros por autor  
✅ **Favoritos**: Pronto para localStorage  
✅ **Avaliações**: Sistema de 1-5 estrelas + comentários  
✅ **Estantes**: Organizador de coleções  
✅ **CORS**: Configurado para desenvolvimento  

### 4. **Dados de Exemplo Disponíveis**

- **30+ livros** de diversos gêneros
- **Gêneros**: Fantasia, Ficção Científica, Romance, Mistério, Clássicos, etc.
- **Tags**: +40 tags diferentes para navegação
- **Imagens**: URLs do Unsplash para todas as capas
- **Reviews**: Exemplos pré-cadastrados
- **Usuários**: Sistema básico disponível

---

## 🚀 Como Iniciar

### 1. **Servidor em desenvolvimento:**
```bash
cd back-end-biblioteca
npm run dev
```

### 2. **Popular dados (se necessário):**
```bash
npm run prisma:seed
```

### 3. **Testar endpoints:**
- Health: http://localhost:4000/health
- Livros: http://localhost:4000/books
- Livro específico: http://localhost:4000/books/1
- Busca: http://localhost:4000/books?q=harry

### 4. **Integração Frontend:**
- ✅ Sem necessidade de autenticação para funcionalidades básicas
- ✅ CORS configurado para desenvolvimento
- ✅ Dados de exemplo já incluídos
- ✅ API totalmente funcional e testada

---

## 📋 Checklist para Frontend

- [ ] Configurar API_BASE_URL
- [ ] Implementar função de busca
- [ ] Sistema de paginação
- [ ] Gerenciamento de favoritos (localStorage)
- [ ] Página de detalhes do livro
- [ ] Sistema de avaliações
- [ ] Navegação por tags/gêneros
- [ ] Filtros avançados
- [ ] Tratamento de erros
- [ ] Loading states

**🎉 Seu backend está 100% funcional e pronto para integração!**