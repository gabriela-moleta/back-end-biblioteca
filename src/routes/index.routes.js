import express from "express";

// Importar todas as rotas
import authRouter from "./auth.routes.js";
import bookRouter from "./bookRoutes.js";
import shelfRouter from "./shelfRoutes.js";
import favoriteRouter from "./favoriteRoutes.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

// Rotas públicas
router.use("/auth", authRouter);
router.use("/books", bookRouter);

// Rotas protegidas
router.use("/shelves", shelfRouter);
router.use("/favorites", favoriteRouter);
router.use("/reviews", reviewRouter);

export default router;
