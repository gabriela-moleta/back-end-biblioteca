import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/book/:bookId', reviewController.findByBook);

// Rotas protegidas
router.use(authMiddleware.auth);
router.post('/', reviewController.create);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete);
router.get('/user', reviewController.findByUser);

export default router;
