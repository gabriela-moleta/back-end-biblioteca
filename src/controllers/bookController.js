import bookModel from '../models/bookModel.js';

class BookController {
    async create(req, res) {
        try {
            const { title, author, description, coverImage, publishYear, genre, tags, isbn } = req.body;

            const book = await bookModel.create({
                title,
                author,
                description,
                coverImage,
                publishYear,
                genre,
                tags,
                isbn
            });

            return res.status(201).json(book);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const result = await bookModel.findAll(req.query);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const book = await bookModel.findById(id);

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

            const book = await bookModel.update(id, {
                title,
                author,
                description,
                coverImage,
                publishYear,
                genre,
                tags,
                isbn
            });

            return res.json(book);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await bookModel.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new BookController();
