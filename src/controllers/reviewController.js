import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class ReviewController {
    async create(req, res) {
        try {
            const { bookId, rating, comment } = req.body;
            const userId = req.userId; // Vem do middleware de autenticação

            const review = await prisma.review.create({
                data: {
                    rating,
                    comment,
                    userId,
                    bookId: parseInt(bookId)
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

            return res.status(201).json(review);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;

            const review = await prisma.review.update({
                where: { 
                    id: parseInt(id),
                    userId 
                },
                data: {
                    rating,
                    comment
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

            return res.json(review);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            await prisma.review.delete({
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

    async findByBook(req, res) {
        try {
            const { bookId } = req.params;

            const reviews = await prisma.review.findMany({
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
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.json(reviews);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findByUser(req, res) {
        try {
            const userId = req.userId;

            const reviews = await prisma.review.findMany({
                where: { userId },
                include: {
                    book: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.json(reviews);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new ReviewController();
