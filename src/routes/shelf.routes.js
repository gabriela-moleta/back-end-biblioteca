import express from 'express';
import shelfController from '../controllers/shelfController.js';

const router = express.Router();

// Rotas de estantes (públicas para demonstração)
router.post('/', shelfController.create);
router.get('/', shelfController.findAll);
router.get('/:id', shelfController.findOne);
router.put('/:id', shelfController.update);
router.delete('/:id', shelfController.delete);

// Rotas de livros em estantes
router.post('/books', shelfController.addBook);
router.delete('/:shelfId/books/:bookId', shelfController.removeBook);

export default router;
