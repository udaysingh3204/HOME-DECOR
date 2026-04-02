"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const stockLabel = product.stock > 10 ? "Ready to ship" : product.stock > 4 ? `${product.stock} left` : "Low stock";

  return (
    <article className="glass-card fade-up overflow-hidden rounded-3xl border border-white/60 transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(42,31,18,0.18)]">
      <div className="relative h-72 overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        {product.badge ? (
          <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-(--forest)">
            {product.badge}
          </div>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--forest)">{product.category} · {product.room}</p>
            <Link href={`/products/${product.slug}`} className="mt-1 block font-(family-name:--font-display) text-2xl leading-tight">
              {product.name}
            </Link>
          </div>
          <div className="text-right">
            <p className="font-semibold text-(--text)">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? <p className="text-sm text-(--muted) line-through">{formatPrice(product.compareAtPrice)}</p> : null}
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-(--muted)">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--muted)">
          <span className="rounded-full bg-white/45 px-3 py-1">{product.collection}</span>
          <span className="rounded-full bg-white/45 px-3 py-1">{stockLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-(--muted)">{product.rating.toFixed(1)} / 5 · {product.reviewCount} reviews</p>
          <button type="button" onClick={() => void addToCart(product)} className="button-primary px-4 py-2 text-sm">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}