import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ShelfModel {
    // Criar nova estante
    async create(data) {
        return await prisma.shelf.create({
            data: {
                ...data,
                userId: parseInt(data.userId)
            }
        });
    }

    // Buscar estante por ID
    async findById(id) {
        return await prisma.shelf.findUnique({
            where: { id: parseInt(id) },
            include: {
                books: {
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
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                _count: {
                    select: { books: true }
                }
            }
        });
    }

    // Buscar estantes de um usuário
    async findByUserId(userId) {
        return await prisma.shelf.findMany({
            where: { userId: parseInt(userId) },
            include: {
                books: {
                    include: {
                        book: true
                    }
                },
                _count: {
                    select: { books: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Buscar todas as estantes
    async findAll() {
        return await prisma.shelf.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                _count: {
                    select: { books: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Atualizar estante
    async update(id, data) {
        return await prisma.shelf.update({
            where: { id: parseInt(id) },
            data
        });
    }

    // Deletar estante
    async delete(id) {
        return await prisma.shelf.delete({
            where: { id: parseInt(id) }
        });
    }

    // Adicionar livro à estante
    async addBook(shelfId, bookId) {
        return await prisma.shelfBook.create({
            data: {
                shelfId: parseInt(shelfId),
                bookId: parseInt(bookId)
            },
            include: {
                book: true,
                shelf: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    // Remover livro da estante
    async removeBook(shelfId, bookId) {
        return await prisma.shelfBook.delete({
            where: {
                shelfId_bookId: {
                    shelfId: parseInt(shelfId),
                    bookId: parseInt(bookId)
                }
            }
        });
    }

    // Verificar se livro está na estante
    async hasBook(shelfId, bookId) {
        const shelfBook = await prisma.shelfBook.findUnique({
            where: {
                shelfId_bookId: {
                    shelfId: parseInt(shelfId),
                    bookId: parseInt(bookId)
                }
            }
        });
        return !!shelfBook;
    }

    // Contar estantes
    async count() {
        return await prisma.shelf.count();
    }

    // Contar livros em todas as estantes
    async countBooks() {
        return await prisma.shelfBook.count();
    }

    // Obter estatísticas das estantes
    async getStats() {
        const [totalShelves, totalBooks, avgBooksPerShelf] = await Promise.all([
            prisma.shelf.count(),
            prisma.shelfBook.count(),
            prisma.shelfBook.groupBy({
                by: ['shelfId'],
                _count: { bookId: true }
            })
        ]);

        const averageBooksPerShelf = avgBooksPerShelf.length > 0 
            ? avgBooksPerShelf.reduce((sum, item) => sum + item._count.bookId, 0) / avgBooksPerShelf.length
            : 0;

        return {
            totalShelves,
            totalBooks,
            averageBooksPerShelf: Math.round(averageBooksPerShelf * 10) / 10
        };
    }
}

export default new ShelfModel();