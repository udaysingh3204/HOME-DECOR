import { ProductCard } from "@/components/product-card";
import type { Product } from "@/data/products";

export function FeaturedProducts({ featured, newest }: { featured: Product[]; newest: Product[] }) {
  return (
    <section className="container py-8 pb-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="pill">Featured selection</p>
          <h2 className="section-title mt-4 max-w-[12ch]">Pieces that set the room.</h2>
        </div>
        <p className="section-copy">
          The storefront now uses a richer internal catalog model with live filtering, room-based merchandising, and a fuller purchase journey from browse to confirmation.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-12 rounded-4xl bg-[rgba(255,255,255,0.5)] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="pill">Fresh arrivals</p>
            <h3 className="mt-4 font-(family-name:--font-display) text-3xl">New pieces with immediate visual payoff.</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {newest.map((product) => (
            <div key={product.id} className="rounded-3xl border border-white/60 bg-white/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-(--forest)">{product.badge ?? "New"}</p>
              <h4 className="mt-2 font-(family-name:--font-display) text-2xl">{product.name}</h4>
              <p className="mt-3 text-sm leading-6 text-(--muted)">{product.story}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}