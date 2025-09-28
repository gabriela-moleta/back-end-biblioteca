import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FavoriteModel {
    // Adicionar aos favoritos
    async create(userId, bookId) {
        return await prisma.favorite.create({
            data: {
                userId: parseInt(userId),
                bookId: parseInt(bookId)
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        coverImage: true,
                        genre: true,
                        publishYear: true
                    }
                }
            }
        });
    }

    // Remover dos favoritos
    async delete(userId, bookId) {
        return await prisma.favorite.delete({
            where: {
                userId_bookId: {
                    userId: parseInt(userId),
                    bookId: parseInt(bookId)
                }
            }
        });
    }

    // Verificar se livro está nos favoritos
    async exists(userId, bookId) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_bookId: {
                    userId: parseInt(userId),
                    bookId: parseInt(bookId)
                }
            }
        });
        return !!favorite;
    }

    // Buscar favoritos de um usuário
    async findByUserId(userId) {
        return await prisma.favorite.findMany({
            where: { userId: parseInt(userId) },
            include: {
                book: {
                    include: {
                        _count: {
                            select: {
                                reviews: true,
                                favorites: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Buscar todos os favoritos de um livro
    async findByBookId(bookId) {
        return await prisma.favorite.findMany({
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

    // Contar favoritos
    async count() {
        return await prisma.favorite.count();
    }

    // Contar favoritos de um livro
    async countByBookId(bookId) {
        return await prisma.favorite.count({
            where: { bookId: parseInt(bookId) }
        });
    }

    // Contar favoritos de um usuário
    async countByUserId(userId) {
        return await prisma.favorite.count({
            where: { userId: parseInt(userId) }
        });
    }

    // Livros mais favoritados
    async getMostFavorited(limit = 10) {
        const favorites = await prisma.favorite.groupBy({
            by: ['bookId'],
            _count: { bookId: true },
            orderBy: { _count: { bookId: 'desc' } },
            take: limit
        });

        const bookIds = favorites.map(f => f.bookId);
        const books = await prisma.book.findMany({
            where: { id: { in: bookIds } },
            select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                genre: true
            }
        });

        return favorites.map(fav => {
            const book = books.find(b => b.id === fav.bookId);
            return {
                ...book,
                favoriteCount: fav._count.bookId
            };
        });
    }

    // Toggle favorite (adiciona se não existe, remove se existe)
    async toggle(userId, bookId) {
        const exists = await this.exists(userId, bookId);
        
        if (exists) {
            await this.delete(userId, bookId);
            return { action: 'removed', exists: false };
        } else {
            await this.create(userId, bookId);
            return { action: 'added', exists: true };
        }
    }

    // Obter estatísticas dos favoritos
    async getStats() {
        const [total, mostFavorited, avgFavoritesPerBook] = await Promise.all([
            prisma.favorite.count(),
            this.getMostFavorited(5),
            prisma.favorite.groupBy({
                by: ['bookId'],
                _count: { bookId: true }
            })
        ]);

        const averageFavoritesPerBook = avgFavoritesPerBook.length > 0
            ? avgFavoritesPerBook.reduce((sum, item) => sum + item._count.bookId, 0) / avgFavoritesPerBook.length
            : 0;

        return {
            total,
            mostFavorited,
            averageFavoritesPerBook: Math.round(averageFavoritesPerBook * 10) / 10,
            uniqueBooksWithFavorites: avgFavoritesPerBook.length
        };
    }
}

export default new FavoriteModel();