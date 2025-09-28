import express from 'express';
import favoriteController from '../controllers/favoriteController.js';

const router = express.Router();

// Rotas de favoritos (públicas)
router.post('/toggle', favoriteController.toggle);
router.post('/', favoriteController.add);
router.delete('/:bookId', favoriteController.remove);
router.get('/', favoriteController.findAll);

export default router;
