const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.member.deleteMany();

  const alice = await prisma.member.create({
    data: { name: "Alice Johnson", email: "alice@example.com", role: "MEMBER" },
  });

  const orwell = await prisma.author.create({
    data: { name: "George Orwell", bio: "English novelist" },
  });

  const austen = await prisma.author.create({
    data: { name: "Jane Austen", bio: "English novelist" },
  });

  await prisma.book.createMany({
    data: [
      { title: "1984", isbn: "9780451524935", authorId: orwell.id, totalCopies: 3, copiesAvailable: 3 },
      { title: "Pride and Prejudice", isbn: "9780141439518", authorId: austen.id, totalCopies: 2, copiesAvailable: 2 },
    ],
  });

  console.log("Seeded:", { members: 1, authors: 2, books: 2 });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
