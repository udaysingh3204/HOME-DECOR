import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getProductBySlug(slug);

  if (!data) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}