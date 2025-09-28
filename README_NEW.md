# Biblioverse Backend 📚

Backend da aplicação Biblioverse - um catálogo universal de livros com funcionalidades de organização pessoal, favoritos e avaliações.

## 🚀 Funcionalidades

- **Catálogo de Livros**: API completa para gerenciamento de livros
- **Busca Avançada**: Filtros por título, autor, gênero, ano e tags
- **Favoritos**: Sistema de favoritos (gerenciado pelo frontend via localStorage)
- **Avaliações**: Sistema de reviews e ratings
- **Estantes Personalizadas**: Organização de livros em estantes
- **Tags**: Sistema de taxonomia flexível
- **Autores**: Listagem e busca de autores

## 🛠️ Tecnologias

- **Node.js** + **Express**: Framework web
- **Prisma**: ORM para banco de dados
- **SQLite**: Banco de dados (desenvolvimento)
- **CORS**: Habilitado para desenvolvimento

## ⚡ Como Executar

### Pré-requisitos
- Node.js (versão 16+ recomendada)
- npm

### Instalação

1. **Clone ou navegue até a pasta do projeto:**
   ```bash
   cd back-end-biblioteca
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o ambiente:**
   ```bash
   # O arquivo .env já está configurado com:
   PORT=4000
   DATABASE_URL="file:./dev.db"
   ```

4. **Execute as migrações e popule o banco:**
   ```bash
   npx prisma migrate reset --force
   npm run prisma:seed
   ```

5. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

O servidor estará rodando em http://localhost:4000

## 📚 Base de Dados

O banco vem pré-populado com 30 livros de diversos gêneros, incluindo:
- Clássicos da literatura (1984, Dom Casmurro, O Pequeno Príncipe)
- Fantasia (Harry Potter, Senhor dos Anéis, Game of Thrones)
- Ficção Científica (Dune, Neuromancer, Fundação)
- E muito mais...

## 🔗 Endpoints Principais

### Status
- `GET /health` - Status da API

### Livros
- `GET /books` - Lista livros (com filtros e paginação)
- `GET /books/:id` - Detalhes de um livro
- `POST /books` - Criar novo livro

### Busca e Filtros
- `GET /books?q=termo` - Busca geral
- `GET /books?author=autor` - Por autor
- `GET /books?genre=genero` - Por gênero
- `GET /books?tag=tag` - Por tag
- `GET /books?year=2020` - Por ano

### Favoritos
- `POST /favorites/toggle` - Alternar favorito
- `POST /favorites` - Adicionar favorito
- `DELETE /favorites/:bookId` - Remover favorito

### Avaliações
- `GET /reviews/book/:bookId` - Reviews de um livro
- `POST /reviews` - Criar review

### Autores e Tags
- `GET /authors` - Lista autores
- `GET /tags` - Lista tags
- `GET /authors/:name/books` - Livros de um autor
- `GET /tags/:name/books` - Livros de uma tag

📖 **[Documentação Completa da API](./API_DOCUMENTATION.md)**

## 🎯 Para o Frontend

Este backend foi projetado para funcionar **sem autenticação** para facilitar o desenvolvimento do frontend:

1. **Favoritos**: Gerencie no localStorage do frontend
2. **Reviews**: Use `userId: 1` por padrão nas requisições
3. **CORS**: Habilitado para desenvolvimento local
4. **Dados**: 30 livros pré-carregados com tags e reviews

### Exemplo de Uso no Frontend

```javascript
// Buscar livros
const response = await fetch('http://localhost:4000/books?q=fantasia&page=1&limit=10');
const data = await response.json();
console.log(data.data); // Array de livros
console.log(data.pagination); // Info de paginação

// Obter detalhes de um livro
const book = await fetch('http://localhost:4000/books/1').then(r => r.json());
console.log(book.title, book.author, book.tags);

// Alternar favorito (retorna apenas confirmação)
await fetch('http://localhost:4000/favorites/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookId: 1 })
});
```

## 📁 Estrutura do Projeto

```
src/
  controllers/         # Lógica de negócio
    bookController.js   # CRUD de livros
    favoriteController.js
    reviewController.js
    shelfController.js
  routes/             # Definição das rotas
    bookRoutes.js
    favoriteRoutes.js
    authorRoutes.js
    tagRoutes.js
    index.routes.js
  server.js           # Servidor Express
prisma/
  schema.prisma       # Schema do banco
  seed/
    seed.js          # Dados iniciais
```

## ⚙️ Scripts Disponíveis

```bash
npm run dev          # Inicia servidor com nodemon
npm run prisma:seed  # Popula o banco com dados
```

## 🤝 Integração Frontend

Este backend está pronto para ser consumido pelo seu frontend React/Next.js. Principais pontos:

- ✅ CORS configurado
- ✅ 30 livros com dados realistas
- ✅ Busca e filtros funcionais
- ✅ Paginação implementada
- ✅ Favoritos simplificados (sem auth)
- ✅ System de tags e autores
- ✅ Reviews com usuário padrão

## 🎨 Dados de Exemplo

Cada livro possui:
- Informações básicas (título, autor, descrição, ano)
- Capa de alta qualidade (via Unsplash)
- Tags temáticas (fantasia, clássico, ficção científica, etc.)
- ISBN único
- Contador de favoritos e reviews

## 🌐 URLs de Teste

- Status: http://localhost:4000/health
- Todos os livros: http://localhost:4000/books
- Livro específico: http://localhost:4000/books/1
- Busca: http://localhost:4000/books?q=1984
- Autores: http://localhost:4000/authors
- Tags: http://localhost:4000/tags

---

**Desenvolvido para integrar perfeitamente com o frontend Biblioverse** 🚀