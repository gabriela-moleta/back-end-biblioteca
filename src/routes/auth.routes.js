import express from "express";
import AuthController from "../controllers/authController.js";

const authRouter = express.Router();

// Rotas de autenticação (opcionais - não serão usadas pelo frontend)
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

export default authRouter;
