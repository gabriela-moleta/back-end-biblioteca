import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class BookController {
    async create(req, res) {
        try {
            const { title, author, description, coverImage, publishYear, genre, tags, isbn } = req.body;

            const book = await prisma.book.create({
                data: {
                    title,
                    author,
                    description,
                    coverImage,
                    publishYear,
                    genre,
                    tags: JSON.stringify(tags),
                    isbn
                }
            });

            return res.status(201).json(book);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { genre, author, year } = req.query;
            let where = {};

            if (genre) where.genre = genre;
            if (author) where.author = { contains: author };
            if (year) where.publishYear = parseInt(year);

            const books = await prisma.book.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            favorites: true,
                            reviews: true
                        }
                    }
                }
            });

            return res.json(books);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;

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
                            favorites: true
                        }
                    }
                }
            });

            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            return res.json(book);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, author, description, coverImage, publishYear, genre, tags, isbn } = req.body;

            const book = await prisma.book.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    author,
                    description,
                    coverImage,
                    publishYear,
                    genre,
                    tags: tags ? JSON.stringify(tags) : undefined,
                    isbn
                }
            });

            return res.json(book);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await prisma.book.delete({
                where: { id: parseInt(id) }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new BookController();
