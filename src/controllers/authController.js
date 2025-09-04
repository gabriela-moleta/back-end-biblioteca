import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class AuthController {
    // Listar todos os usuários
    async getAllUsers(req, res) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    avatar: true,
                    isAdmin: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            res.json(users);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            res.status(500).json({ error: "Erro ao listar usuários" });
        }
    }

    // Registrar novo usuário
    async register(req, res) {
        try {
            const { name, email, password, bio, avatar } = req.body;

            // Validação básica
            if (!name || !email || !password) {
                return res.status(400).json({ error: "Os campos nome, email e senha são obrigatórios!" });
            }

            // Verificar se o usuário já existe
            const userExists = await prisma.user.findUnique({
                where: { email }
            });

            if (userExists) {
                return res.status(400).json({ error: "Este email já está em uso!" });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar usuário
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    bio,
                    avatar
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    avatar: true,
                    isAdmin: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            // Gerar token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                user,
                token
      });
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }

    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ error: "Email e senha são obrigatórios!" });
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // Verificar se usuário existe e senha está correta
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Email ou senha inválidos!" });
            }

            // Gerar token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // Remover senha do objeto do usuário
            const { password: _, ...userWithoutPassword } = user;

            return res.json({
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ error: "Erro ao fazer login" });
        }
    }

    // Perfil do usuário
    async profile(req, res) {
        try {
            const userId = req.userId; // Vem do middleware de autenticação

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    avatar: true,
                    isAdmin: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            shelves: true,
                            favorites: true,
                            reviews: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado!" });
            }

            return res.json(user);
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            res.status(500).json({ error: "Erro ao buscar perfil" });
        }
    }
}

export default new AuthController();
