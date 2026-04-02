import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { processPayment } from "@/lib/payments";

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.email(),
  shippingAddress: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  paymentMethod: z.string().min(2),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.publicId,
      createdAt: order.createdAt,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      city: order.city,
      country: order.country,
      deliveryWindow: order.deliveryWindow,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      items: order.items.map((item) => ({
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
      })),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Complete the checkout form before placing the order." }, { status: 400 });
  }

  const cartItems = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 250 ? 0 : 18;
  const total = subtotal + shipping;

  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return NextResponse.json({ message: `${item.product.name} does not have enough stock.` }, { status: 409 });
    }
  }

  const payment = await processPayment(total, parsed.data.paymentMethod);
  const publicId = `AH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const order = await db.$transaction(async (transaction) => {
    const createdOrder = await transaction.order.create({
      data: {
        publicId,
        userId: user.id,
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail,
        shippingAddress: parsed.data.shippingAddress,
        city: parsed.data.city,
        country: parsed.data.country,
        deliveryWindow: shipping === 0 ? "3 to 5 business days" : "5 to 7 business days",
        paymentMethod: payment.method,
        paymentStatus: payment.status,
        subtotal,
        shipping,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await transaction.payment.create({
      data: {
        orderId: createdOrder.id,
        provider: payment.provider,
        providerReference: payment.providerReference,
        status: payment.status,
        amount: total,
      },
    });

    if (payment.status === "SUCCEEDED") {
      for (const item of cartItems) {
        await transaction.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await transaction.cartItem.deleteMany({ where: { userId: user.id } });
    }

    return createdOrder;
  });

  return NextResponse.json({
    orderId: order.publicId,
    total,
    paymentStatus: payment.status,
    message: payment.message,
  });
}