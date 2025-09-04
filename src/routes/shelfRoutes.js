import express from 'express';
import shelfController from '../controllers/shelfController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas de estantes requerem autenticação
router.use(authMiddleware.auth);

// Rotas de estantes
router.post('/', shelfController.create);
router.get('/', shelfController.findAll);
router.get('/:id', shelfController.findOne);
router.put('/:id', shelfController.update);
router.delete('/:id', shelfController.delete);

// Rotas de livros em estantes
router.post('/books', shelfController.addBook);
router.delete('/:shelfId/books/:bookId', shelfController.removeBook);

export default router;
