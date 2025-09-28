import reviewModel from '../models/reviewModel.js';

class ReviewController {
    async create(req, res) {
        try {
            const { bookId, rating, comment, userId = 1 } = req.body;

            const review = await reviewModel.create({
                rating,
                comment,
                userId,
                bookId
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

            const review = await reviewModel.update(id, {
                rating,
                comment
            });

            return res.json(review);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await reviewModel.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findByBook(req, res) {
        try {
            const { bookId } = req.params;
            const reviews = await reviewModel.findByBookId(bookId);
            return res.json(reviews);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findByUser(req, res) {
        try {
            const { userId = 1 } = req.query;
            const reviews = await reviewModel.findByUserId(userId);
            return res.json(reviews);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new ReviewController();
