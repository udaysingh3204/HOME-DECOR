const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log(JSON.stringify(products.map(p => ({ id: p.id, name: p.name, auraScore: p.auraScore })), null, 2));
  await prisma.$disconnect();
}

check();
