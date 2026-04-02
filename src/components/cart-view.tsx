"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <section className="container py-12">
        <div className="glass-card rounded-4xl p-8 text-center">
          <p className="pill">Your cart is empty</p>
          <h1 className="section-title mx-auto mt-5 max-w-[11ch]">Start with a few pieces that shape the room.</h1>
          <p className="section-copy mx-auto mt-4">Browse the collection and add anything that fits your style. Signed-in carts persist and sync through the backend.</p>
          <Link href="/products" className="button-primary mt-8">
            Go to shop
          </Link>
        </div>
      </section>
    );
  }

  const shipping = subtotal > 200 ? 0 : 18;
  const total = subtotal + shipping;

  return (
    <section className="container grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div>
          <p className="pill">Cart review</p>
          <h1 className="section-title mt-4 max-w-[10ch]">Everything you picked for home.</h1>
        </div>
        {items.map((item) => (
          <article key={item.product.id} className="glass-card rounded-3xl p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-[1.375rem]">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-(--forest)">{item.product.category}</p>
                  <h2 className="mt-1 font-(family-name:--font-display) text-2xl">{item.product.name}</h2>
                  <p className="mt-2 text-sm text-(--muted)">{formatPrice(item.product.price)} each · {item.product.room}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-semibold text-(--muted)" htmlFor={`quantity-${item.product.id}`}>
                  Qty
                </label>
                <select
                  id={`quantity-${item.product.id}`}
                  className="select max-w-[90px]"
                  value={item.quantity}
                  onChange={(event) => void updateQuantity(item.product.id, Number(event.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => void removeFromCart(item.product.id)} className="button-secondary px-4 py-2">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="glass-card h-fit rounded-4xl p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--forest)">Order summary</p>
        <div className="mt-6 space-y-4 text-(--muted)">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-(--line) pt-4 text-lg font-semibold text-(--text)">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        {isAuthenticated ? (
          <Link href="/checkout" className="button-primary mt-8 w-full">
            Continue to checkout
          </Link>
        ) : (
          <Link href="/login" className="button-primary mt-8 w-full">
            Sign in to checkout
          </Link>
        )}
        <button type="button" onClick={() => void clearCart()} className="button-secondary mt-3 w-full">
          Clear cart
        </button>
      </aside>
    </section>
  );
}