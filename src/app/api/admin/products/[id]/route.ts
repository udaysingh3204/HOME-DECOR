import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const updateProductSchema = z.object({
  price: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid product update payload." }, { status: 400 });
  }

  const { id } = await params;
  const product = await db.product.update({
    where: { id: Number(id) },
    data: parsed.data,
  });

  return NextResponse.json({ product });
}