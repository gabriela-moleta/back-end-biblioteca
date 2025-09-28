import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /models - Lista todos os modelos disponíveis
router.get('/', async (req, res) => {
    try {
        const models = {
            books: {
                name: 'Livros',
                description: 'Catálogo completo de livros',
                endpoints: [
                    'GET /books - Lista todos os livros',
                    'GET /books/:id - Detalhes de um livro',
                    'POST /books - Criar novo livro',
                    'PUT /books/:id - Atualizar livro',
                    'DELETE /books/:id - Remover livro'
                ],
                totalRecords: await prisma.book.count()
            },
            authors: {
                name: 'Autores',
                description: 'Lista de autores únicos',
                endpoints: [
                    'GET /authors - Lista todos os autores',
                    'GET /authors/:name/books - Livros de um autor'
                ],
                totalRecords: await prisma.book.groupBy({ by: ['author'] }).then(authors => authors.length)
            },
            tags: {
                name: 'Tags',
                description: 'Sistema de tags/categorias',
                endpoints: [
                    'GET /tags - Lista todas as tags',
                    'GET /tags/:name/books - Livros de uma tag'
                ],
                totalRecords: 'Dinâmico (baseado em JSON)'
            },
            reviews: {
                name: 'Avaliações',
                description: 'Sistema de reviews e ratings',
                endpoints: [
                    'GET /reviews/book/:bookId - Reviews de um livro',
                    'POST /reviews - Criar review',
                    'PUT /reviews/:id - Atualizar review',
                    'DELETE /reviews/:id - Remover review'
                ],
                totalRecords: await prisma.review.count()
            },
            favorites: {
                name: 'Favoritos',
                description: 'Sistema de favoritos (gerenciado pelo frontend)',
                endpoints: [
                    'POST /favorites/toggle - Alternar favorito',
                    'POST /favorites - Adicionar favorito',
                    'DELETE /favorites/:bookId - Remover favorito',
                    'GET /favorites - Listar favoritos'
                ],
                totalRecords: await prisma.favorite.count()
            },
            shelves: {
                name: 'Estantes',
                description: 'Estantes personalizadas de usuários',
                endpoints: [
                    'GET /shelves - Lista estantes',
                    'POST /shelves - Criar estante',
                    'PUT /shelves/:id - Atualizar estante',
                    'DELETE /shelves/:id - Remover estante',
                    'POST /shelves/books - Adicionar livro à estante',
                    'DELETE /shelves/:shelfId/books/:bookId - Remover livro da estante'
                ],
                totalRecords: await prisma.shelf.count()
            },
            users: {
                name: 'Usuários',
                description: 'Sistema de usuários (opcional/desabilitado)',
                endpoints: [
                    'POST /auth/register - Registrar usuário',
                    'POST /auth/login - Login'
                ],
                totalRecords: await prisma.user.count()
            }
        };

        return res.json({
            message: 'Modelos disponíveis na API Biblioverse',
            apiVersion: '1.0.0',
            totalModels: Object.keys(models).length,
            models
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET /models/schema - Retorna o schema do banco
router.get('/schema', async (req, res) => {
    try {
        const schema = {
            User: {
                fields: [
                    { name: 'id', type: 'Int', primaryKey: true },
                    { name: 'name', type: 'String' },
                    { name: 'email', type: 'String', unique: true },
                    { name: 'password', type: 'String' },
                    { name: 'bio', type: 'String', optional: true },
                    { name: 'avatar', type: 'String', optional: true },
                    { name: 'isAdmin', type: 'Boolean', default: false },
                    { name: 'createdAt', type: 'DateTime' },
                    { name: 'updatedAt', type: 'DateTime' }
                ],
                relations: ['shelves', 'favorites', 'reviews']
            },
            Book: {
                fields: [
                    { name: 'id', type: 'Int', primaryKey: true },
                    { name: 'title', type: 'String' },
                    { name: 'author', type: 'String' },
                    { name: 'description', type: 'String', optional: true },
                    { name: 'coverImage', type: 'String', optional: true },
                    { name: 'publishYear', type: 'Int' },
                    { name: 'genre', type: 'String' },
                    { name: 'tags', type: 'String', note: 'JSON array' },
                    { name: 'isbn', type: 'String', unique: true, optional: true },
                    { name: 'createdAt', type: 'DateTime' },
                    { name: 'updatedAt', type: 'DateTime' }
                ],
                relations: ['shelves', 'favorites', 'reviews']
            },
            Shelf: {
                fields: [
                    { name: 'id', type: 'Int', primaryKey: true },
                    { name: 'name', type: 'String' },
                    { name: 'description', type: 'String', optional: true },
                    { name: 'userId', type: 'Int', foreignKey: 'User' },
                    { name: 'createdAt', type: 'DateTime' },
                    { name: 'updatedAt', type: 'DateTime' }
                ],
                relations: ['user', 'books']
            },
            Favorite: {
                fields: [
                    { name: 'id', type: 'Int', primaryKey: true },
                    { name: 'userId', type: 'Int', foreignKey: 'User' },
                    { name: 'bookId', type: 'Int', foreignKey: 'Book' },
                    { name: 'createdAt', type: 'DateTime' }
                ],
                relations: ['user', 'book'],
                unique: ['userId', 'bookId']
            },
            Review: {
                fields: [
                    { name: 'id', type: 'Int', primaryKey: true },
                    { name: 'rating', type: 'Int', note: '1-5' },
                    { name: 'comment', type: 'String', optional: true },
                    { name: 'userId', type: 'Int', foreignKey: 'User' },
                    { name: 'bookId', type: 'Int', foreignKey: 'Book' },
                    { name: 'createdAt', type: 'DateTime' },
                    { name: 'updatedAt', type: 'DateTime' }
                ],
                relations: ['user', 'book'],
                unique: ['userId', 'bookId']
            }
        };

        return res.json({
            message: 'Schema do banco de dados',
            database: 'SQLite',
            orm: 'Prisma',
            schema
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET /models/stats - Estatísticas gerais
router.get('/stats', async (req, res) => {
    try {
        const stats = await Promise.all([
            prisma.book.count(),
            prisma.user.count(),
            prisma.review.count(),
            prisma.favorite.count(),
            prisma.shelf.count(),
            prisma.shelfBook.count()
        ]);

        const [bookCount, userCount, reviewCount, favoriteCount, shelfCount, shelfBookCount] = stats;

        // Estatísticas dos livros por gênero
        const booksByGenre = await prisma.book.groupBy({
            by: ['genre'],
            _count: { genre: true },
            orderBy: { _count: { genre: 'desc' } }
        });

        // Livros mais avaliados
        const mostReviewedBooks = await prisma.book.findMany({
            include: {
                _count: {
                    select: { reviews: true }
                }
            },
            orderBy: {
                reviews: { _count: 'desc' }
            },
            take: 5
        });

        // Estatísticas de anos de publicação
        const booksByYear = await prisma.book.groupBy({
            by: ['publishYear'],
            _count: { publishYear: true },
            orderBy: { publishYear: 'desc' },
            take: 10
        });

        return res.json({
            message: 'Estatísticas gerais da biblioteca',
            totals: {
                books: bookCount,
                users: userCount,
                reviews: reviewCount,
                favorites: favoriteCount,
                shelves: shelfCount,
                shelfBooks: shelfBookCount
            },
            booksByGenre: booksByGenre.map(item => ({
                genre: item.genre,
                count: item._count.genre
            })),
            mostReviewedBooks: mostReviewedBooks.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                reviewCount: book._count.reviews
            })),
            booksByYear: booksByYear.map(item => ({
                year: item.publishYear,
                count: item._count.publishYear
            })),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET /models/search - Busca global em todos os modelos
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.status(400).json({ 
                error: 'Query deve ter pelo menos 2 caracteres' 
            });
        }

        const query = q.toLowerCase();

        // Buscar em livros
        const books = await prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { author: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { genre: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10
        });

        // Buscar em reviews
        const reviews = await prisma.review.findMany({
            where: {
                comment: { contains: query, mode: 'insensitive' }
            },
            include: {
                book: { select: { title: true, author: true } },
                user: { select: { name: true } }
            },
            take: 5
        });

        // Buscar em estantes
        const shelves = await prisma.shelf.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                user: { select: { name: true } },
                _count: { select: { books: true } }
            },
            take: 5
        });

        return res.json({
            query: q,
            results: {
                books: {
                    count: books.length,
                    data: books.map(book => ({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        type: 'book'
                    }))
                },
                reviews: {
                    count: reviews.length,
                    data: reviews.map(review => ({
                        id: review.id,
                        comment: review.comment?.substring(0, 100) + '...',
                        book: review.book.title,
                        author: review.user.name,
                        type: 'review'
                    }))
                },
                shelves: {
                    count: shelves.length,
                    data: shelves.map(shelf => ({
                        id: shelf.id,
                        name: shelf.name,
                        description: shelf.description,
                        bookCount: shelf._count.books,
                        type: 'shelf'
                    }))
                }
            },
            totalResults: books.length + reviews.length + shelves.length
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;