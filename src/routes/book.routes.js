import express from 'express';
import bookController from '../controllers/bookController.js';

const router = express.Router();

// Rotas de livros (todas públicas)
router.get('/', bookController.findAll);
router.get('/:id', bookController.findOne);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);

export default router;
