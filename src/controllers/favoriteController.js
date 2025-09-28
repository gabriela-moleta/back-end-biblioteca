import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class FavoriteController {
    async toggle(req, res) {
        try {
            const { bookId } = req.body;
            
            // Para funcionar sem autenticação, vamos usar um ID de sessão temporário
            // ou trabalhar com os favoritos enviados do frontend
            const sessionId = req.headers['x-session-id'] || 'guest';
            
            // Verifica se o livro existe
            const book = await prisma.book.findUnique({
                where: { id: parseInt(bookId) }
            });

            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            // Como não temos autenticação, vamos apenas retornar sucesso
            // O frontend deve gerenciar os favoritos localmente
            return res.json({ 
                success: true, 
                message: 'Favorito alterado com sucesso',
                bookId: parseInt(bookId)
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async add(req, res) {
        try {
            const { bookId } = req.body;
            
            // Verifica se o livro existe
            const book = await prisma.book.findUnique({
                where: { id: parseInt(bookId) }
            });

            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            return res.status(201).json({ 
                success: true, 
                message: 'Livro adicionado aos favoritos',
                bookId: parseInt(bookId)
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async remove(req, res) {
        try {
            const { bookId } = req.params;
            
            // Verifica se o livro existe
            const book = await prisma.book.findUnique({
                where: { id: parseInt(bookId) }
            });

            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            return res.json({ 
                success: true, 
                message: 'Livro removido dos favoritos',
                bookId: parseInt(bookId)
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            // Para demonstração, retornamos uma lista vazia
            // O frontend deve gerenciar os favoritos usando localStorage
            return res.json({ 
                data: [],
                message: 'Use localStorage no frontend para gerenciar favoritos'
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new FavoriteController();
