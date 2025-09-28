import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /tags - Lista todas as tags únicas
router.get('/', async (req, res) => {
    try {
        const { q } = req.query;

        // Buscar todos os livros para extrair tags
        const books = await prisma.book.findMany({
            select: {
                tags: true
            }
        });

        // Extrair todas as tags únicas
        const allTags = new Set();
        books.forEach(book => {
            if (book.tags) {
                try {
                    const tags = JSON.parse(book.tags);
                    if (Array.isArray(tags)) {
                        tags.forEach(tag => allTags.add(tag.toLowerCase()));
                    }
                } catch (error) {
                    // Ignorar tags malformadas
                }
            }
        });

        let tagsArray = Array.from(allTags).sort();

        // Filtrar por query se fornecido
        if (q) {
            const query = q.toLowerCase();
            tagsArray = tagsArray.filter(tag => tag.includes(query));
        }

        // Contar livros para cada tag (simplificado)
        const tagsWithCount = await Promise.all(
            tagsArray.map(async (tag) => {
                const count = await prisma.book.count({
                    where: {
                        tags: { contains: tag }
                    }
                });
                return {
                    name: tag,
                    bookCount: count
                };
            })
        );

        return res.json({
            data: tagsWithCount,
            total: tagsWithCount.length
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// GET /tags/:name/books - Lista livros de uma tag específica
router.get('/:name/books', async (req, res) => {
    try {
        const { name } = req.params;
        const decodedName = decodeURIComponent(name).toLowerCase();

        const books = await prisma.book.findMany({
            where: {
                tags: { contains: decodedName }
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
                title: 'asc'
            }
        });

        // Processar tags JSON para array e filtrar apenas livros que realmente contêm a tag
        const booksWithTags = books
            .map(book => ({
                ...book,
                tags: book.tags ? JSON.parse(book.tags) : []
            }))
            .filter(book => 
                book.tags.some(tag => tag.toLowerCase() === decodedName)
            );

        return res.json({
            data: booksWithTags,
            tag: decodedName,
            total: booksWithTags.length
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

export default router;