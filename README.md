# Biblioverse API

API do Biblioverse, uma plataforma social para leitores gerenciarem suas leituras, descobrirem novos livros e compartilharem suas opiniões.

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas variáveis de ambiente:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=4001
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Execute o seed para popular o banco com dados iniciais:
```bash
npx prisma db seed
```

## Usuários para Teste

### Administrador
- Email: admin@biblioverse.com
- Senha: admin123

### Usuário Normal
- Email: leitor@example.com
- Senha: user123

## Rotas da API

### Autenticação

#### 1. Registro de Usuário
```http
POST /auth/register
Content-Type: application/json

{
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "password": "senha123",
    "bio": "Amante de livros de fantasia",
    "avatar": "https://exemplo.com/avatar.jpg"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "leitor@example.com",
    "password": "user123"
}
```

#### 3. Perfil do Usuário
```http
GET /auth/profile
Authorization: Bearer {seu_token}
```

### Livros

#### 1. Listar Livros
```http
GET /books
Query Params (opcionais):
- genre: string
- author: string
- year: number
```

#### 2. Buscar Livro por ID
```http
GET /books/:id
```

#### 3. Criar Novo Livro (Admin)
```http
POST /books
Authorization: Bearer {token_admin}
Content-Type: application/json

{
    "title": "Novo Livro",
    "author": "Autor do Livro",
    "description": "Descrição do livro...",
    "coverImage": "https://exemplo.com/capa.jpg",
    "publishYear": 2025,
    "genre": "Ficção Científica",
    "tags": ["sci-fi", "space", "future"],
    "isbn": "9788533613123"
}
```

#### 4. Atualizar Livro (Admin)
```http
PUT /books/:id
Authorization: Bearer {token_admin}
Content-Type: application/json

{
    "title": "Título Atualizado",
    "description": "Nova descrição..."
}
```

#### 5. Deletar Livro (Admin)
```http
DELETE /books/:id
Authorization: Bearer {token_admin}
```

### Estantes

#### 1. Criar Estante
```http
POST /shelves
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Minha Nova Estante",
    "description": "Descrição da estante"
}
```

#### 2. Listar Estantes do Usuário
```http
GET /shelves
Authorization: Bearer {token}
```

#### 3. Buscar Estante por ID
```http
GET /shelves/:id
Authorization: Bearer {token}
```

#### 4. Adicionar Livro à Estante
```http
POST /shelves/books
Authorization: Bearer {token}
Content-Type: application/json

{
    "shelfId": 1,
    "bookId": 1
}
```

#### 5. Remover Livro da Estante
```http
DELETE /shelves/:shelfId/books/:bookId
Authorization: Bearer {token}
```

### Favoritos

#### 1. Alternar Favorito (Toggle)
```http
POST /favorites/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
    "bookId": 1
}
```

#### 2. Listar Favoritos
```http
GET /favorites
Authorization: Bearer {token}
```

### Avaliações

#### 1. Criar Avaliação
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
    "bookId": 1,
    "rating": 5,
    "comment": "Excelente livro! Recomendo."
}
```

#### 2. Listar Avaliações de um Livro
```http
GET /reviews/book/:bookId
```

#### 3. Listar Avaliações do Usuário
```http
GET /reviews/user
Authorization: Bearer {token}
```

#### 4. Atualizar Avaliação
```http
PUT /reviews/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "rating": 4,
    "comment": "Comentário atualizado"
}
```

#### 5. Deletar Avaliação
```http
DELETE /reviews/:id
Authorization: Bearer {token}
```

## Testando no Postman

1. Importe a coleção do Postman (disponível em `docs/Biblioverse.postman_collection.json`)

2. Configure uma variável de ambiente no Postman chamada `token` para armazenar o token JWT retornado no login

3. Fluxo de teste recomendado:
   - Faça login como admin ou usuário normal
   - Copie o token retornado para a variável de ambiente `token`
   - Teste as rotas na ordem sugerida acima
   - Para rotas que requerem permissão de admin, use o login do administrador

## Códigos de Status

- 200: Sucesso
- 201: Criado com sucesso
- 204: Sem conteúdo (deleção bem-sucedida)
- 400: Erro de validação
- 401: Não autenticado
- 403: Não autorizado (sem permissão)
- 404: Não encontrado
- 500: Erro interno do servidor
