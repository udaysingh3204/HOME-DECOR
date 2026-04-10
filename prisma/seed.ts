import { hash } from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("Admin123!", 10);
  const customerPassword = await hash("sample123", 10);

  await prisma.user.upsert({
    where: { email: "admin@atelierhome.com" },
    update: {},
    create: {
      email: "admin@atelierhome.com",
      name: "Atelier Admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "hello@atelierhome.com" },
    update: {},
    create: {
      email: "hello@atelierhome.com",
      name: "Atelier Guest",
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER,
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        room: product.room,
        collectionName: product.collection,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        colors: product.colors,
        materials: product.materials,
        dimensions: product.dimensions,
        description: product.description,
        story: product.story,
        features: product.features,
        image: product.image,
        gallery: product.gallery,
        featured: product.featured,
        stock: product.stock,
        leadTimeDays: product.leadTimeDays,
        auraScore: product.auraScore,
        active: true,
      },
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        room: product.room,
        collectionName: product.collection,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        colors: product.colors,
        materials: product.materials,
        dimensions: product.dimensions,
        description: product.description,
        story: product.story,
        features: product.features,
        image: product.image,
        gallery: product.gallery,
        featured: product.featured,
        stock: product.stock,
        leadTimeDays: product.leadTimeDays,
        auraScore: product.auraScore,
        active: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });