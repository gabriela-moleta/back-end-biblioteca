import express from 'express';
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Rotas de reviews (públicas para demonstração)
router.get('/book/:bookId', reviewController.findByBook);
router.post('/', reviewController.create);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete);
router.get('/user', reviewController.findByUser);

export default router;
