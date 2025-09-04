import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class ShelfController {
    async create(req, res) {
        try {
            const { name, description } = req.body;
            const userId = req.userId; // Vem do middleware de autenticação

            const shelf = await prisma.shelf.create({
                data: {
                    name,
                    description,
                    userId
                }
            });

            return res.status(201).json(shelf);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const userId = req.userId; // Vem do middleware de autenticação

            const shelves = await prisma.shelf.findMany({
                where: { userId },
                include: {
                    books: {
                        include: {
                            book: true
                        }
                    },
                    _count: {
                        select: {
                            books: true
                        }
                    }
                }
            });

            return res.json(shelves);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const shelf = await prisma.shelf.findFirst({
                where: { 
                    id: parseInt(id),
                    userId 
                },
                include: {
                    books: {
                        include: {
                            book: true
                        }
                    }
                }
            });

            if (!shelf) {
                return res.status(404).json({ error: 'Estante não encontrada' });
            }

            return res.json(shelf);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const userId = req.userId;

            const shelf = await prisma.shelf.update({
                where: { 
                    id: parseInt(id),
                    userId
                },
                data: {
                    name,
                    description
                }
            });

            return res.json(shelf);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            await prisma.shelf.delete({
                where: { 
                    id: parseInt(id),
                    userId
                }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async addBook(req, res) {
        try {
            const { shelfId, bookId } = req.body;
            const userId = req.userId;

            // Verifica se a estante pertence ao usuário
            const shelf = await prisma.shelf.findFirst({
                where: { 
                    id: parseInt(shelfId),
                    userId 
                }
            });

            if (!shelf) {
                return res.status(404).json({ error: 'Estante não encontrada' });
            }

            const shelfBook = await prisma.shelfBook.create({
                data: {
                    shelfId: parseInt(shelfId),
                    bookId: parseInt(bookId)
                },
                include: {
                    book: true
                }
            });

            return res.status(201).json(shelfBook);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async removeBook(req, res) {
        try {
            const { shelfId, bookId } = req.params;
            const userId = req.userId;

            // Verifica se a estante pertence ao usuário
            const shelf = await prisma.shelf.findFirst({
                where: { 
                    id: parseInt(shelfId),
                    userId 
                }
            });

            if (!shelf) {
                return res.status(404).json({ error: 'Estante não encontrada' });
            }

            await prisma.shelfBook.delete({
                where: {
                    shelfId_bookId: {
                        shelfId: parseInt(shelfId),
                        bookId: parseInt(bookId)
                    }
                }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new ShelfController();
