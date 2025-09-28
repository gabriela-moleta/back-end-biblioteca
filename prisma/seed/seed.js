import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seed de livros...");

  // Limpar dados existentes
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.shelfBook.deleteMany({});
  await prisma.shelf.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Criando usuário padrão para reviews...");

  // Criar um usuário padrão para as reviews
  const defaultUser = await prisma.user.create({
    data: {
      name: "Leitor Padrão",
      email: "leitor@exemplo.com",
      password: "senha123",
      bio: "Apaixonado por livros",
      avatar: "https://ui-avatars.com/api/?name=Leitor+Padrão&background=6366f1&color=ffffff"
    }
  });

  console.log("Criando livros...");

  // Array de livros com dados realistas
  const books = [
    {
      title: "1984",
      author: "George Orwell",
      description: "Uma distopia sobre um estado totalitário que controla todos os aspectos da vida humana.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      publishYear: 1949,
      genre: "Distopia",
      tags: ["clássico", "ficção", "político", "distopia"],
      isbn: "978-0451524935"
    },
    {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      description: "Romance que narra a história de Bentinho e sua obsessão por Capitu.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      publishYear: 1899,
      genre: "Romance",
      tags: ["clássico", "brasileiro", "romance", "machado de assis"],
      isbn: "978-8525406958"
    },
    {
      title: "O Pequeno Príncipe",
      author: "Antoine de Saint-Exupéry",
      description: "Uma fábula poética sobre amizade, amor e a natureza humana.",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      publishYear: 1943,
      genre: "Fábula",
      tags: ["infantil", "filosofia", "amizade", "clássico"],
      isbn: "978-0156012195"
    },
    {
      title: "Cem Anos de Solidão",
      author: "Gabriel García Márquez",
      description: "A saga da família Buendía na fictícia cidade de Macondo.",
      coverImage: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop",
      publishYear: 1967,
      genre: "Realismo Mágico",
      tags: ["realismo mágico", "família", "américa latina", "nobel"],
      isbn: "978-0060883287"
    },
    {
      title: "Harry Potter e a Pedra Filosofal",
      author: "J.K. Rowling",
      description: "O início da jornada mágica do jovem bruxo Harry Potter.",
      coverImage: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=400&h=600&fit=crop",
      publishYear: 1997,
      genre: "Fantasia",
      tags: ["fantasia", "magia", "juventude", "aventura"],
      isbn: "978-0439708180"
    },
    {
      title: "O Senhor dos Anéis: A Sociedade do Anel",
      author: "J.R.R. Tolkien",
      description: "A primeira parte da épica jornada para destruir o Um Anel.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      publishYear: 1954,
      genre: "Fantasia Épica",
      tags: ["fantasia", "épico", "aventura", "tolkien", "terra média"],
      isbn: "978-0547928210"
    },
    {
      title: "Orgulho e Preconceito",
      author: "Jane Austen",
      description: "Romance sobre Elizabeth Bennet e o orgulhoso Mr. Darcy.",
      coverImage: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=600&fit=crop",
      publishYear: 1813,
      genre: "Romance Clássico",
      tags: ["romance", "clássico", "inglês", "jane austen"],
      isbn: "978-0141439518"
    },
    {
      title: "Crime e Castigo",
      author: "Fiódor Dostoiévski",
      description: "Um jovem estudante comete um assassinato e lida com as consequências psicológicas.",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
      publishYear: 1866,
      genre: "Romance Psicológico",
      tags: ["russo", "psicológico", "crime", "dostoievski"],
      isbn: "978-0486415871"
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      description: "Épico de ficção científica sobre poder, religião e ecologia no planeta deserto Arrakis.",
      coverImage: "https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?w=400&h=600&fit=crop",
      publishYear: 1965,
      genre: "Ficção Científica",
      tags: ["ficção científica", "épico", "space opera", "herbert"],
      isbn: "978-0441172719"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "Uma história sobre injustiça racial vista através dos olhos de uma criança.",
      coverImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&h=600&fit=crop",
      publishYear: 1960,
      genre: "Drama Social",
      tags: ["drama", "racismo", "justiça", "americana"],
      isbn: "978-0060935467"
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      description: "Romance cyberpunk que definiu o gênero, explorando inteligência artificial e realidade virtual.",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
      publishYear: 1984,
      genre: "Cyberpunk",
      tags: ["cyberpunk", "inteligência artificial", "ficção científica", "gibson"],
      isbn: "978-0441569595"
    },
    {
      title: "A Metamorfose",
      author: "Franz Kafka",
      description: "Gregor Samsa acorda transformado em um inseto gigante, uma reflexão sobre alienação.",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      publishYear: 1915,
      genre: "Literatura Existencial",
      tags: ["existencial", "absurdo", "kafka", "transformação"],
      isbn: "978-0486290300"
    },
    {
      title: "O Nome do Vento",
      author: "Patrick Rothfuss",
      description: "Primeira parte das Crônicas do Matador do Rei, sobre Kvothe e sua busca por conhecimento.",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      publishYear: 2007,
      genre: "Fantasia",
      tags: ["fantasia", "magia", "aventura", "rothfuss"],
      isbn: "978-0756404079"
    },
    {
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      description: "Uma sociedade onde os livros são proibidos e bombeiros queimam literatura.",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
      publishYear: 1953,
      genre: "Distopia",
      tags: ["distopia", "censura", "livros", "bradbury"],
      isbn: "978-1451673319"
    },
    {
      title: "O Código Da Vinci",
      author: "Dan Brown",
      description: "Thriller envolvendo símbolos, arte e mistérios religiosos.",
      coverImage: "https://images.unsplash.com/photo-1544716278-e8f9394caaca?w=400&h=600&fit=crop",
      publishYear: 2003,
      genre: "Thriller",
      tags: ["thriller", "mistério", "religião", "símbolos"],
      isbn: "978-0307474278"
    },
    {
      title: "Sapiens: Uma Breve História da Humanidade",
      author: "Yuval Noah Harari",
      description: "Uma exploração da história da espécie humana desde a Idade da Pedra.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      publishYear: 2011,
      genre: "História",
      tags: ["não-ficção", "história", "antropologia", "harari"],
      isbn: "978-0062316097"
    },
    {
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      description: "As aventuras de Bilbo Bolseiro em sua jornada inesperada.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      publishYear: 1937,
      genre: "Fantasia",
      tags: ["fantasia", "aventura", "tolkien", "hobbit"],
      isbn: "978-0547928227"
    },
    {
      title: "Cem Sonetos de Amor",
      author: "Pablo Neruda",
      description: "Coletânea de sonetos apaixonados do poeta chileno.",
      coverImage: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop",
      publishYear: 1959,
      genre: "Poesia",
      tags: ["poesia", "amor", "neruda", "sonetos"],
      isbn: "978-8525406951"
    },
    {
      title: "Memórias Póstumas de Brás Cubas",
      author: "Machado de Assis",
      description: "Romance narrado por um defunto autor, crítica mordaz à sociedade do século XIX.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      publishYear: 1881,
      genre: "Romance",
      tags: ["brasileiro", "clássico", "machado de assis", "crítica social"],
      isbn: "978-8525406952"
    },
    {
      title: "A Guerra dos Tronos",
      author: "George R.R. Martin",
      description: "Primeiro livro da saga As Crônicas de Gelo e Fogo, repleto de intriga política.",
      coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
      publishYear: 1996,
      genre: "Fantasia Medieval",
      tags: ["fantasia", "política", "guerra", "martin", "westeros"],
      isbn: "978-0553103540"
    },
    {
      title: "Moby Dick",
      author: "Herman Melville",
      description: "A obsessão do capitão Ahab pela baleia branca que lhe custou a perna.",
      coverImage: "https://images.unsplash.com/photo-1544716278-e8f9394caaca?w=400&h=600&fit=crop",
      publishYear: 1851,
      genre: "Aventura",
      tags: ["aventura", "mar", "obsessão", "clássico americano"],
      isbn: "978-1503280786"
    },
    {
      title: "Fundação",
      author: "Isaac Asimov",
      description: "Primeiro livro da série Fundação, sobre o declínio de um império galáctico.",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
      publishYear: 1951,
      genre: "Ficção Científica",
      tags: ["ficção científica", "space opera", "asimov", "império"],
      isbn: "978-0553293357"
    },
    {
      title: "O Alquimista",
      author: "Paulo Coelho",
      description: "A jornada de Santiago em busca de seu tesouro pessoal.",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      publishYear: 1988,
      genre: "Ficção Filosófica",
      tags: ["filosofia", "jornada", "coelho", "autoconhecimento"],
      isbn: "978-0061122415"
    },
    {
      title: "Lolita",
      author: "Vladimir Nabokov",
      description: "Romance controverso sobre a obsessão de Humbert Humbert.",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      publishYear: 1955,
      genre: "Romance Psicológico",
      tags: ["psicológico", "controverso", "nabokov", "obsessão"],
      isbn: "978-0679723165"
    },
    {
      title: "O Cortiço",
      author: "Aluísio Azevedo",
      description: "Romance naturalista que retrata a vida em uma habitação coletiva no Rio de Janeiro.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      publishYear: 1890,
      genre: "Naturalismo",
      tags: ["brasileiro", "naturalismo", "social", "cortiço"],
      isbn: "978-8525406953"
    },
    {
      title: "Admirável Mundo Novo",
      author: "Aldous Huxley",
      description: "Distopia sobre uma sociedade futurista baseada em castas e condicionamento.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      publishYear: 1932,
      genre: "Distopia",
      tags: ["distopia", "futuro", "sociedade", "huxley"],
      isbn: "978-0060850524"
    },
    {
      title: "Caçador de Pipas",
      author: "Khaled Hosseini",
      description: "História de amizade e redenção no Afeganistão.",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
      publishYear: 2003,
      genre: "Drama",
      tags: ["drama", "amizade", "afeganistão", "hosseini"],
      isbn: "978-1594631931"
    },
    {
      title: "O Apanhador no Campo de Centeio",
      author: "J.D. Salinger",
      description: "Holden Caulfield narra sua experiência após ser expulso da escola.",
      coverImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&h=600&fit=crop",
      publishYear: 1951,
      genre: "Coming-of-age",
      tags: ["adolescência", "escola", "salinger", "juventude"],
      isbn: "978-0316769174"
    },
    {
      title: "Persépolis",
      author: "Marjane Satrapi",
      description: "Graphic novel autobiográfica sobre crescer durante a Revolução Iraniana.",
      coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      publishYear: 2000,
      genre: "Graphic Novel",
      tags: ["graphic novel", "autobiografia", "irã", "revolução"],
      isbn: "978-0375714573"
    },
    {
      title: "A Menina que Roubava Livros",
      author: "Markus Zusak",
      description: "Narrada pela Morte, conta a história de Liesel durante a Segunda Guerra Mundial.",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
      publishYear: 2005,
      genre: "Drama Histórico",
      tags: ["guerra mundial", "alemanha", "livros", "zusak"],
      isbn: "978-0375842207"
    }
  ];

  // Criar os livros
  const createdBooks = [];
  for (const bookData of books) {
    const book = await prisma.book.create({
      data: {
        ...bookData,
        tags: JSON.stringify(bookData.tags)
      }
    });
    createdBooks.push(book);
  }

  console.log("Criando algumas reviews de exemplo...");

  // Criar algumas reviews de exemplo
  const reviewsData = [
    { bookIndex: 0, rating: 5, comment: "Obra-prima da literatura distópica. Orwell foi profético!" },
    { bookIndex: 1, rating: 4, comment: "Clássico brasileiro indispensável. Machado de Assis é genial." },
    { bookIndex: 2, rating: 5, comment: "Leitura tocante e filosófica. Recomendo para todas as idades." },
    { bookIndex: 4, rating: 5, comment: "Início perfeito de uma saga fantástica!" },
    { bookIndex: 5, rating: 5, comment: "Épico de fantasia incomparável. Tolkien criou um mundo único." },
    { bookIndex: 8, rating: 4, comment: "Ficção científica complexa e fascinante." },
    { bookIndex: 12, rating: 4, comment: "Fantasia envolvente com uma prosa linda." },
    { bookIndex: 19, rating: 5, comment: "Martin redefiniu a fantasia moderna." }
  ];

  for (const reviewData of reviewsData) {
    await prisma.review.create({
      data: {
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: defaultUser.id,
        bookId: createdBooks[reviewData.bookIndex].id
      }
    });
  }

  console.log(`Seed concluído! Criados ${createdBooks.length} livros e ${reviewsData.length} reviews.`);
  console.log("Livros disponíveis para o frontend funcionar sem autenticação!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
