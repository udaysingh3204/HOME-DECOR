import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const syncSchema = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(20) })),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = syncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid sync payload." }, { status: 400 });
  }

  for (const item of parsed.data.items) {
    await db.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId: item.productId } },
      update: { quantity: { increment: item.quantity } },
      create: { userId: user.id, productId: item.productId, quantity: item.quantity },
    });
  }

  return NextResponse.json({ ok: true });
}