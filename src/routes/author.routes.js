import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /authors - Lista todos os autores únicos
router.get('/', async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        
        let where = {};
        
        // Busca por nome do autor
        if (q) {
            where.author = { contains: q, mode: 'insensitive' };
        }

        // Paginação
        const pageNum = parseInt(page) || 1;
        const limitNum = Math.min(parseInt(limit) || 20, 100);
        const skip = (pageNum - 1) * limitNum;

        // Buscar autores únicos com contagem de livros
        const authors = await prisma.book.groupBy({
            by: ['author'],
            where,
            _count: {
                author: true
            },
            skip,
            take: limitNum,
            orderBy: {
                author: 'asc'
            }
        });

        // Contar total de autores únicos
        const totalAuthors = await prisma.book.groupBy({
            by: ['author'],
            where,
            _count: {
                author: true
            }
        });

        const totalPages = Math.ceil(totalAuthors.length / limitNum);

        const response = authors.map(item => ({
            name: item.author,
            bookCount: item._count.author
        }));

        return res.json({
            data: response,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalAuthors.length,
                pages: totalPages
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// GET /authors/:name/books - Lista livros de um autor específico
router.get('/:name/books', async (req, res) => {
    try {
        const { name } = req.params;
        const decodedName = decodeURIComponent(name);

        const books = await prisma.book.findMany({
            where: {
                author: { equals: decodedName, mode: 'insensitive' }
            },
            include: {
                _count: {
                    select: {
                        favorites: true,
                        reviews: true
                    }
                }
            },
            orderBy: {
                publishYear: 'desc'
            }
        });

        // Processar tags JSON para array
        const booksWithTags = books.map(book => ({
            ...book,
            tags: book.tags ? JSON.parse(book.tags) : []
        }));

        return res.json({
            data: booksWithTags,
            author: decodedName,
            total: books.length
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

export default router;