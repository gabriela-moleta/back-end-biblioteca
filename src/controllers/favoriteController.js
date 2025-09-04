import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class FavoriteController {
    async toggle(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.userId; // Vem do middleware de autenticação

            // Verifica se já existe um favorito
            const existingFavorite = await prisma.favorite.findUnique({
                where: {
                    userId_bookId: {
                        userId,
                        bookId: parseInt(bookId)
                    }
                }
            });

            if (existingFavorite) {
                // Se existe, remove o favorito
                await prisma.favorite.delete({
                    where: {
                        userId_bookId: {
                            userId,
                            bookId: parseInt(bookId)
                        }
                    }
                });
                return res.status(204).send();
            } else {
                // Se não existe, cria um novo favorito
                const favorite = await prisma.favorite.create({
                    data: {
                        userId,
                        bookId: parseInt(bookId)
                    }
                });
                return res.status(201).json(favorite);
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const userId = req.userId;

            const favorites = await prisma.favorite.findMany({
                where: { userId },
                include: {
                    book: true
                }
            });

            return res.json(favorites);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new FavoriteController();
