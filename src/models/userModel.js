import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserModel {
    // Criar novo usuário
    async create(data) {
        return await prisma.user.create({
            data
        });
    }

    // Buscar usuário por email
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    // Buscar usuário por ID
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: parseInt(id) },
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
    }

    // Buscar todos os usuários
    async findAll() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatar: true,
                isAdmin: true,
                createdAt: true,
                _count: {
                    select: {
                        shelves: true,
                        favorites: true,
                        reviews: true
                    }
                }
            }
        });
    }

    // Atualizar usuário
    async update(id, data) {
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data
        });
    }

    // Deletar usuário
    async delete(id) {
        return await prisma.user.delete({
            where: { id: parseInt(id) }
        });
    }

    // Contar usuários
    async count() {
        return await prisma.user.count();
    }

    // Verificar se usuário é admin
    async isAdmin(id) {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { isAdmin: true }
        });
        return user?.isAdmin || false;
    }
}

export default new UserModel();