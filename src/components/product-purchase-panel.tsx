"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-4 rounded-[28px] bg-white/40 p-5 sm:grid-cols-[120px_1fr] sm:items-end">
        <div>
          <label htmlFor="quantity" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
            Quantity
          </label>
          <select id="quantity" className="select" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              void addToCart(product, quantity);
              setMessage(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart.`);
            }}
            className="button-primary"
          >
            Add to cart
          </button>
          {user ? (
            <Link href="/cart" className="button-secondary">
              View cart
            </Link>
          ) : (
            <Link href="/login" className="button-secondary">
              Sign in for faster checkout
            </Link>
          )}
        </div>
      </div>
      {message ? <p className="text-sm font-semibold text-[var(--forest)]">{message}</p> : null}
    </div>
  );
}