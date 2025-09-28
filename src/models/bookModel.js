import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BookModel {
    // Criar um novo livro
    async create(data) {
        return await prisma.book.create({
            data: {
                ...data,
                tags: JSON.stringify(data.tags)
            }
        });
    }

    // Buscar todos os livros com filtros
    async findAll(filters = {}) {
        const {
            q,
            title,
            author,
            genre,
            year,
            tag,
            sort = 'title',
            order = 'asc',
            page = 1,
            limit = 20
        } = filters;

        let where = {};
        
        // Filtros - REMOVIDO mode: 'insensitive' para compatibilidade com SQLite
        if (genre) where.genre = { contains: genre };
        if (author) where.author = { contains: author };
        if (title) where.title = { contains: title };
        if (year) where.publishYear = parseInt(year);
        if (tag) where.tags = { contains: tag };

        // Busca geral - REMOVIDO mode: 'insensitive'
        if (q) {
            where.OR = [
                { title: { contains: q } },
                { author: { contains: q } },
                { description: { contains: q } },
                { genre: { contains: q } }
            ];
        }

        // Ordenação
        let orderBy = {};
        const sortField = ['title', 'author', 'publishYear', 'createdAt'].includes(sort) ? sort : 'title';
        const sortOrder = ['asc', 'desc'].includes(order) ? order : 'asc';
        orderBy[sortField] = sortOrder;

        // Paginação
        const pageNum = parseInt(page) || 1;
        const limitNum = Math.min(parseInt(limit) || 20, 100);
        const skip = (pageNum - 1) * limitNum;

        // Buscar dados
        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            favorites: true,
                            reviews: true
                        }
                    }
                },
                orderBy,
                skip,
                take: limitNum
            }),
            prisma.book.count({ where })
        ]);

        return {
            data: books.map(book => ({
                ...book,
                tags: book.tags ? JSON.parse(book.tags) : []
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        };
    }

    // Buscar livro por ID
    async findById(id) {
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        favorites: true,
                        reviews: true
                    }
                }
            }
        });

        if (!book) return null;

        // Processar tags e calcular média
        const bookWithTags = {
            ...book,
            tags: book.tags ? JSON.parse(book.tags) : []
        };

        if (book.reviews && book.reviews.length > 0) {
            const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
            bookWithTags.averageRating = parseFloat((totalRating / book.reviews.length).toFixed(1));
        } else {
            bookWithTags.averageRating = 0;
        }

        return bookWithTags;
    }

    // Atualizar livro
    async update(id, data) {
        return await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tags: data.tags ? JSON.stringify(data.tags) : undefined
            }
        });
    }

    // Deletar livro
    async delete(id) {
        return await prisma.book.delete({
            where: { id: parseInt(id) }
        });
    }

    // Buscar livros por autor - REMOVIDO mode: 'insensitive'
    async findByAuthor(authorName) {
        const books = await prisma.book.findMany({
            where: {
                author: { equals: authorName }
            },
            include: {
                _count: {
                    select: {
                        favorites: true,
                        reviews: true
                    }
                }
            },
            orderBy: { publishYear: 'desc' }
        });

        return books.map(book => ({
            ...book,
            tags: book.tags ? JSON.parse(book.tags) : []
        }));
    }

    // Contar total de livros
    async count(filters = {}) {
        return await prisma.book.count({ where: filters });
    }

    // Buscar estatísticas dos livros
    async getStats() {
        const [total, byGenre, byYear] = await Promise.all([
            prisma.book.count(),
            prisma.book.groupBy({
                by: ['genre'],
                _count: { genre: true },
                orderBy: { _count: { genre: 'desc' } }
            }),
            prisma.book.groupBy({
                by: ['publishYear'],
                _count: { publishYear: true },
                orderBy: { publishYear: 'desc' },
                take: 10
            })
        ]);

        return {
            total,
            byGenre: byGenre.map(item => ({
                genre: item.genre,
                count: item._count.genre
            })),
            byYear: byYear.map(item => ({
                year: item.publishYear,
                count: item._count.publishYear
            }))
        };
    }
}

export default new BookModel();