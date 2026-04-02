import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [productCount, lowStockCount, orderCount, revenue, products, recentOrders] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.product.count({ where: { active: true, stock: { lte: 5 } } }),
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.product.findMany({ orderBy: [{ stock: "asc" }, { updatedAt: "desc" }] }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    stats: {
      productCount,
      lowStockCount,
      orderCount,
      revenue: revenue._sum.total ?? 0,
    },
    products,
    recentOrders,
  });
}