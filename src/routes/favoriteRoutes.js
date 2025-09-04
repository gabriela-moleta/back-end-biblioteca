import express from 'express';
import favoriteController from '../controllers/favoriteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas de favoritos requerem autenticação
router.use(authMiddleware.auth);

router.post('/toggle', favoriteController.toggle);
router.get('/', favoriteController.findAll);

export default router;
