import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const cartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
});

async function getCartPayload(userId: string) {
  const cartItems = await db.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const items = cartItems.map((item) => ({
    quantity: item.quantity,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      category: item.product.category,
      room: item.product.room,
      collection: item.product.collectionName,
      price: item.product.price,
      compareAtPrice: item.product.compareAtPrice ?? undefined,
      rating: item.product.rating,
      reviewCount: item.product.reviewCount,
      badge: item.product.badge ?? undefined,
      colors: item.product.colors,
      materials: item.product.materials,
      dimensions: item.product.dimensions,
      description: item.product.description,
      story: item.product.story,
      features: item.product.features,
      image: item.product.image,
      gallery: item.product.gallery,
      featured: item.product.featured,
      stock: item.product.stock,
      leadTimeDays: item.product.leadTimeDays,
    },
  }));

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, itemCount };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getCartPayload(user.id));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid cart payload." }, { status: 400 });
  }

  await db.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
    update: { quantity: { increment: parsed.data.quantity } },
    create: { userId: user.id, productId: parsed.data.productId, quantity: parsed.data.quantity },
  });

  return NextResponse.json(await getCartPayload(user.id));
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid cart payload." }, { status: 400 });
  }

  if (parsed.data.quantity <= 0) {
    await db.cartItem.deleteMany({ where: { userId: user.id, productId: parsed.data.productId } });
  } else {
    await db.cartItem.update({
      where: { userId_productId: { userId: user.id, productId: parsed.data.productId } },
      data: { quantity: parsed.data.quantity },
    });
  }

  return NextResponse.json(await getCartPayload(user.id));
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    await db.cartItem.deleteMany({ where: { userId: user.id, productId: Number(productId) } });
  } else {
    await db.cartItem.deleteMany({ where: { userId: user.id } });
  }

  return NextResponse.json(await getCartPayload(user.id));
}