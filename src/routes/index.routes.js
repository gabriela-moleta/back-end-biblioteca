import express from "express";

// Importar todas as rotas
import authRouter from "./auth.routes.js";
import bookRouter from "./book.routes.js";
import authorRouter from "./author.routes.js";
import tagRouter from "./tag.routes.js";
import shelfRouter from "./shelf.routes.js";
import favoriteRouter from "./favorite.routes.js";
import reviewRouter from "./review.routes.js";
import modelRouter from "./model.routes.js";

const router = express.Router();

// Rota de saúde
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Biblioverse API funcionando!'
  });
});

// Rotas principais
router.use("/auth", authRouter);        // Autenticação (opcional)
router.use("/books", bookRouter);       // Livros
router.use("/authors", authorRouter);   // Autores
router.use("/tags", tagRouter);         // Tags
router.use("/shelves", shelfRouter);    // Estantes
router.use("/favorites", favoriteRouter); // Favoritos
router.use("/reviews", reviewRouter);   // Avaliações
router.use("/models", modelRouter);     // Modelos/Schema

export default router;
