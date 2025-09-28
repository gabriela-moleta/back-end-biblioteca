import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ReviewModel {
    // Criar nova avaliação
    async create(data) {
        return await prisma.review.create({
            data: {
                ...data,
                rating: parseInt(data.rating),
                userId: parseInt(data.userId),
                bookId: parseInt(data.bookId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            }
        });
    }

    // Buscar avaliação por ID
    async findById(id) {
        return await prisma.review.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            }
        });
    }

    // Buscar avaliações de um livro
    async findByBookId(bookId) {
        return await prisma.review.findMany({
            where: { bookId: parseInt(bookId) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Buscar avaliações de um usuário
    async findByUserId(userId) {
        return await prisma.review.findMany({
            where: { userId: parseInt(userId) },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        coverImage: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Buscar avaliação específica de usuário para um livro
    async findByUserAndBook(userId, bookId) {
        return await prisma.review.findUnique({
            where: {
                userId_bookId: {
                    userId: parseInt(userId),
                    bookId: parseInt(bookId)
                }
            }
        });
    }

    // Atualizar avaliação
    async update(id, data) {
        return await prisma.review.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                rating: data.rating ? parseInt(data.rating) : undefined
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });
    }

    // Deletar avaliação
    async delete(id) {
        return await prisma.review.delete({
            where: { id: parseInt(id) }
        });
    }

    // Buscar todas as avaliações
    async findAll(limit = 50) {
        return await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    // Contar avaliações
    async count() {
        return await prisma.review.count();
    }

    // Calcular média de avaliações de um livro
    async getBookAverageRating(bookId) {
        const result = await prisma.review.aggregate({
            where: { bookId: parseInt(bookId) },
            _avg: { rating: true },
            _count: { rating: true }
        });

        return {
            average: result._avg.rating || 0,
            count: result._count.rating
        };
    }

    // Obter estatísticas das avaliações
    async getStats() {
        const [total, avgRating, ratingDistribution] = await Promise.all([
            prisma.review.count(),
            prisma.review.aggregate({
                _avg: { rating: true }
            }),
            prisma.review.groupBy({
                by: ['rating'],
                _count: { rating: true },
                orderBy: { rating: 'asc' }
            })
        ]);

        return {
            total,
            averageRating: avgRating._avg.rating || 0,
            ratingDistribution: ratingDistribution.map(item => ({
                rating: item.rating,
                count: item._count.rating
            }))
        };
    }
}

export default new ReviewModel();