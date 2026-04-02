import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getProductBySlug } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getProductBySlug(slug);

  if (!detail) {
    notFound();
  }

  const { product, relatedProducts, estimatedDelivery, inventoryLabel } = detail;

  return (
    <main className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <div className="relative min-h-[420px] overflow-hidden rounded-[36px] shadow-[var(--shadow)]">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" priority />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.gallery.slice(0, 2).map((image) => (
              <div key={image} className="relative h-40 overflow-hidden rounded-[28px]">
                <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 25vw" />
              </div>
            ))}
          </div>
        </div>

        <section className="glass-card rounded-[36px] p-6 sm:p-8">
          <p className="pill">{product.category} · {product.collection}</p>
          <h1 className="section-title mt-5 max-w-[12ch]">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[var(--muted)]">
            <span className="text-2xl font-semibold text-[var(--text)]">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? <span className="line-through">{formatPrice(product.compareAtPrice)}</span> : null}
            <span>{product.rating.toFixed(1)} rating · {product.reviewCount} reviews</span>
            {product.badge ? <span>{product.badge}</span> : null}
          </div>
          <p className="section-copy mt-5">{product.description}</p>

          <div className="mt-8 grid gap-5 rounded-[28px] bg-white/40 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Colors</p>
              <p className="mt-2 text-[var(--muted)]">{product.colors.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Materials</p>
              <p className="mt-2 text-[var(--muted)]">{product.materials.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Dimensions</p>
              <p className="mt-2 text-[var(--muted)]">{product.dimensions}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Delivery</p>
              <p className="mt-2 text-[var(--muted)]">{estimatedDelivery} · {inventoryLabel}</p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-[rgba(34,62,52,0.06)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Why it works</p>
            <p className="mt-3 leading-7 text-[var(--muted)]">{product.story}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>

          <ProductPurchasePanel product={product} />
        </section>
      </div>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="pill">Related pieces</p>
            <h2 className="section-title mt-4 max-w-[10ch] text-[2.4rem]">Pair it with these.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </main>
  );
}