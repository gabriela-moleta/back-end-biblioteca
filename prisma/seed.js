import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Administrador',
            email: 'admin@biblioverse.com',
            password: adminPassword,
            isAdmin: true
        }
    });

    // Criar alguns livros
    const books = await prisma.book.createMany({
        data: [
            {
                title: 'Dom Casmurro',
                author: 'Machado de Assis',
                description: 'Um dos grandes clássicos da literatura brasileira, que narra a história de Bentinho e seu ciúme por Capitu.',
                publishYear: 1899,
                genre: 'Ficção Literária',
                tags: JSON.stringify(['clássico', 'literatura brasileira', 'romance']),
                isbn: '9788535914660'
            },
            {
                title: '1984',
                author: 'George Orwell',
                description: 'Uma distopia que retrata um futuro totalitário onde o governo mantém controle total sobre os cidadãos.',
                publishYear: 1949,
                genre: 'Ficção Científica',
                tags: JSON.stringify(['distopia', 'política', 'clássico']),
                isbn: '9788535914677'
            },
            {
                title: 'O Senhor dos Anéis: A Sociedade do Anel',
                author: 'J.R.R. Tolkien',
                description: 'A primeira parte da épica jornada de Frodo para destruir o Um Anel e derrotar o Senhor do Escuro Sauron.',
                publishYear: 1954,
                genre: 'Fantasia',
                tags: JSON.stringify(['fantasia', 'aventura', 'clássico']),
                isbn: '9788533613379'
            },
            {
                title: 'Harry Potter e a Pedra Filosofal',
                author: 'J.K. Rowling',
                description: 'O primeiro ano de Harry Potter na Escola de Magia e Bruxaria de Hogwarts.',
                publishYear: 1997,
                genre: 'Fantasia',
                tags: JSON.stringify(['fantasia', 'magia', 'young adult']),
                isbn: '9788532530783'
            },
            {
                title: 'Memórias Póstumas de Brás Cubas',
                author: 'Machado de Assis',
                description: 'Um defunto autor narra suas memórias com ironia e sarcasmo.',
                publishYear: 1881,
                genre: 'Ficção Literária',
                tags: JSON.stringify(['clássico', 'literatura brasileira', 'realismo']),
                isbn: '9788535910663'
            }
        ]
    });

    // Criar usuário normal com algumas estantes
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
        data: {
            name: 'Leitor Exemplo',
            email: 'leitor@example.com',
            password: userPassword,
            bio: 'Amante de livros e aventuras literárias',
            shelves: {
                create: [
                    {
                        name: 'Lendo',
                        description: 'Livros que estou lendo atualmente'
                    },
                    {
                        name: 'Quero Ler',
                        description: 'Minha lista de desejos'
                    },
                    {
                        name: 'Lidos',
                        description: 'Livros que já li'
                    }
                ]
            }
        }
    });

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
