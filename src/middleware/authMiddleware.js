import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthMiddleware {
    async auth(req, res, next) {
        const authHeader = req.headers.authorization;

        // Verificar se o token existe
        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido!" });
        }

        // Retirar o token do Bearer Token
        const parts = authHeader.split(" ");

        if (parts.length !== 2) {
            return res.status(401).json({ error: "Token mal formatado!" });
        }

        const [schema, token] = parts;

        // Verificar se o token é válido
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            
            // Carregar dados do usuário
            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });
            
            if (!user) {
                return res.status(401).json({ error: "Usuário não encontrado!" });
            }

            req.user = user;
            return next();
        } catch (error) {
            return res.status(401).json({ error: "Token inválido!" });
        }
    }

    async isAdmin(req, res, next) {
        try {
            // Primeiro executar o middleware de autenticação
            await this.auth(req, res, async () => {
                // Verificar se o usuário é admin
                if (!req.user.isAdmin) {
                    return res.status(403).json({ error: "Acesso negado! Apenas administradores podem realizar esta ação." });
                }

                return next();
            });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}

export default new AuthMiddleware();
