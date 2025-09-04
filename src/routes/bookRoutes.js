import express from 'express';
import bookController from '../controllers/bookController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', bookController.findAll);
router.get('/:id', bookController.findOne);

// Rotas protegidas (apenas para administradores)
router.use(authMiddleware.isAdmin);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);

export default router;
