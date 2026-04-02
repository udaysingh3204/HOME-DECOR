import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = await getCatalog({
    category: searchParams.get("category") ?? undefined,
    room: searchParams.get("room") ?? undefined,
    collection: searchParams.get("collection") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return NextResponse.json(data);
}