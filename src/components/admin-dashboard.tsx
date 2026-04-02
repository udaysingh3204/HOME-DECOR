"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type AdminStats = {
  productCount: number;
  lowStockCount: number;
  orderCount: number;
  revenue: number;
};

type AdminProduct = {
  id: number;
  name: string;
  category: string;
  room: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  active: boolean;
  featured: boolean;
  updatedAt: string;
};

type AdminOrder = {
  id: string;
  publicId: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type AdminOverview = {
  stats: AdminStats;
  products: AdminProduct[];
  recentOrders: AdminOrder[];
};

type Drafts = Record<number, { price: string; compareAtPrice: string; stock: string; active: boolean; featured: boolean }>;

function buildDrafts(products: AdminProduct[]): Drafts {
  return Object.fromEntries(
    products.map((product) => [
      product.id,
      {
        price: String(product.price),
        compareAtPrice: product.compareAtPrice === null ? "" : String(product.compareAtPrice),
        stock: String(product.stock),
        active: product.active,
        featured: product.featured,
      },
    ]),
  );
}

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [drafts, setDrafts] = useState<Drafts>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadOverview = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      const payload = (await response.json()) as AdminOverview & { message?: string };

      if (!response.ok) {
        setError(payload.message ?? "Unable to load the admin dashboard.");
        setOverview(null);
        return;
      }

      setOverview(payload);
      setDrafts(buildDrafts(payload.products));
    } catch {
      setError("Unable to load the admin dashboard.");
      setOverview(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  const updateDraft = (productId: number, field: keyof Drafts[number], value: string | boolean) => {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  };

  const saveProduct = async (productId: number) => {
    const draft = drafts[productId];
    if (!draft) {
      return;
    }

    setSavingId(productId);
    setError("");

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: Number(draft.price),
        compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : null,
        stock: Number(draft.stock),
        active: draft.active,
        featured: draft.featured,
      }),
    });

    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(payload.message ?? "Unable to update product.");
      setSavingId(null);
      return;
    }

    await loadOverview();
    setSavingId(null);
  };

  if (isLoading) {
    return (
      <section className="container py-10">
        <div className="glass-card rounded-[32px] p-8">
          <p className="pill">Admin</p>
          <h1 className="section-title mt-5 max-w-[12ch]">Loading the live inventory workspace.</h1>
        </div>
      </section>
    );
  }

  if (!overview) {
    return (
      <section className="container py-10">
        <div className="glass-card rounded-[32px] p-8 text-center">
          <p className="pill">Admin access</p>
          <h1 className="section-title mx-auto mt-5 max-w-[12ch]">The dashboard is available to admin accounts only.</h1>
          <p className="section-copy mx-auto mt-4">Sign in with admin@atelierhome.com and Admin123! after the database is seeded.</p>
          {error ? <p className="mt-6 rounded-[20px] bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        </div>
      </section>
    );
  }

  const lowStockProducts = overview.products.filter((product) => product.stock <= 5);

  return (
    <section className="container space-y-6 py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="pill">Admin control room</p>
          <h1 className="section-title mt-5 max-w-[12ch]">Inventory, orders, and revenue in one synced view.</h1>
          <p className="section-copy mt-4 max-w-3xl">This dashboard reads live product, order, and payment data from the app backend and lets you adjust inventory and merchandising flags without leaving the storefront.</p>
        </div>
        <button type="button" onClick={() => void loadOverview()} className="button-secondary px-5 py-3">
          Refresh data
        </button>
      </div>

      {error ? <p className="rounded-[20px] bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Active products</p>
          <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{overview.stats.productCount}</p>
        </article>
        <article className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Low stock</p>
          <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{overview.stats.lowStockCount}</p>
        </article>
        <article className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Orders</p>
          <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{overview.stats.orderCount}</p>
        </article>
        <article className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Revenue</p>
          <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{formatPrice(overview.stats.revenue)}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="glass-card rounded-[32px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Low stock watch</p>
          <div className="mt-5 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Everything is comfortably stocked.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="rounded-[22px] bg-white/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--text)]">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{product.category} · {product.room}</p>
                    </div>
                    <p className="rounded-full bg-[rgba(46,88,72,0.1)] px-3 py-1 text-sm font-semibold text-[var(--forest)]">{product.stock} left</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Recent orders</p>
          <div className="mt-5 space-y-3">
            {overview.recentOrders.map((order) => (
              <div key={order.id} className="rounded-[22px] bg-white/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{order.publicId}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{order.customerName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--text)]">{formatPrice(order.total)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{order.status} · {order.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="glass-card overflow-hidden rounded-[32px] p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Inventory controls</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Update pricing, stock, and storefront visibility for each product.</p>
          </div>

          <div className="mt-6 space-y-4">
            {overview.products.map((product) => {
              const draft = drafts[product.id];
              if (!draft) {
                return null;
              }

              return (
                <article key={product.id} className="rounded-[24px] bg-white/45 p-5">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_repeat(3,140px)_auto] lg:items-end">
                    <div>
                      <p className="font-semibold text-[var(--text)]">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{product.category} · {product.room} · updated {new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label htmlFor={`price-${product.id}`} className="mb-2 block text-sm font-semibold text-[var(--muted)]">Price</label>
                      <input id={`price-${product.id}`} className="input" value={draft.price} onChange={(event) => updateDraft(product.id, "price", event.target.value)} />
                    </div>
                    <div>
                      <label htmlFor={`compare-${product.id}`} className="mb-2 block text-sm font-semibold text-[var(--muted)]">Compare</label>
                      <input id={`compare-${product.id}`} className="input" value={draft.compareAtPrice} onChange={(event) => updateDraft(product.id, "compareAtPrice", event.target.value)} />
                    </div>
                    <div>
                      <label htmlFor={`stock-${product.id}`} className="mb-2 block text-sm font-semibold text-[var(--muted)]">Stock</label>
                      <input id={`stock-${product.id}`} className="input" value={draft.stock} onChange={(event) => updateDraft(product.id, "stock", event.target.value)} />
                    </div>
                    <button type="button" onClick={() => void saveProduct(product.id)} className="button-primary px-5 py-3" disabled={savingId === product.id}>
                      {savingId === product.id ? "Saving..." : "Save"}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={draft.active} onChange={(event) => updateDraft(product.id, "active", event.target.checked)} />
                      Active
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={draft.featured} onChange={(event) => updateDraft(product.id, "featured", event.target.checked)} />
                      Featured
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}