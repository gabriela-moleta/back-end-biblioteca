import express from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Rotas públicas
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

// Rota protegida
authRouter.get("/profile", authMiddleware.auth, AuthController.profile);

export default authRouter;
