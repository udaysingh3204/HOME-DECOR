"use client";

import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/orders-context";
import { formatPrice } from "@/lib/utils";

export function CheckoutView() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const shipping = subtotal > 250 ? 0 : 18;
  const total = subtotal + shipping;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [paymentMethod, setPaymentMethod] = useState("Card ending in 4242");
  const [error, setError] = useState("");

  const itemSummary = useMemo(() => items.map((item) => `${item.quantity}× ${item.product.name}`).join(", "), [items]);

  if (items.length === 0) {
    return (
      <section className="container py-12">
        <div className="glass-card rounded-[32px] p-8 text-center">
          <p className="pill">No items to check out</p>
          <h1 className="section-title mx-auto mt-5 max-w-[10ch]">Your next room story starts in the catalog.</h1>
          <Link href="/products" className="button-primary mt-8">
            Explore products
          </Link>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="container py-12">
        <div className="glass-card rounded-[32px] p-8 text-center">
          <p className="pill">Sign in required</p>
          <h1 className="section-title mx-auto mt-5 max-w-[10ch]">Checkout is ready when your account is.</h1>
          <p className="section-copy mx-auto mt-4">Sign in or create an account so your order confirmation and history can be stored in the account area.</p>
          <Link href="/login" className="button-primary mt-8">
            Go to account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container grid gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        className="glass-card rounded-[32px] p-6 sm:p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!name || !email || !address || !city || !country || !paymentMethod) {
            setError("Complete the shipping and payment fields before placing the order.");
            return;
          }

          const order = await placeOrder({
            customerName: name,
            customerEmail: email,
            shippingAddress: address,
            city,
            country,
            paymentMethod,
            items,
            subtotal,
            shipping,
            total,
          });

          if (!order.ok || !order.orderId) {
            setError(order.message ?? "Unable to place the order.");
            return;
          }

          await clearCart();
          startTransition(() => {
            router.push(`/checkout/success?order=${order.orderId}`);
          });
        }}
      >
        <p className="pill">Checkout</p>
        <h1 className="section-title mt-5 max-w-[11ch]">A smooth final step from cart to confirmation.</h1>
        <p className="section-copy mt-4">Review shipping details, select your payment method, and place the order. Orders, payments, and stock now persist through the backend.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-name" className="mb-2 block text-sm font-semibold text-[var(--muted)]">Full name</label>
            <input id="checkout-name" className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <label htmlFor="checkout-email" className="mb-2 block text-sm font-semibold text-[var(--muted)]">Email</label>
            <input id="checkout-email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="checkout-address" className="mb-2 block text-sm font-semibold text-[var(--muted)]">Street address</label>
            <input id="checkout-address" className="input" value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div>
            <label htmlFor="checkout-city" className="mb-2 block text-sm font-semibold text-[var(--muted)]">City</label>
            <input id="checkout-city" className="input" value={city} onChange={(event) => setCity(event.target.value)} />
          </div>
          <div>
            <label htmlFor="checkout-country" className="mb-2 block text-sm font-semibold text-[var(--muted)]">Country</label>
            <input id="checkout-country" className="input" value={country} onChange={(event) => setCountry(event.target.value)} />
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-white/40 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Payment</p>
          <div className="mt-4 grid gap-3">
            {["Card ending in 4242", "PayPal", "Apple Pay"].map((method) => (
              <label key={method} className="flex items-center gap-3 rounded-[20px] bg-white/50 px-4 py-3">
                <input type="radio" name="paymentMethod" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="mt-5 rounded-[20px] bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <button type="submit" className="button-primary mt-8 w-full">
          Place order
        </button>
      </form>

      <aside className="glass-card h-fit rounded-[32px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Order review</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{itemSummary}</p>
        <div className="mt-6 space-y-4 text-[var(--muted)]">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex items-center justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-lg font-semibold text-[var(--text)]"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
        <div className="mt-8 rounded-[24px] bg-[rgba(34,62,52,0.06)] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Happy flow details</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>• Orders are stored in your account immediately after checkout.</li>
            <li>• Free shipping unlocks automatically over $250.</li>
            <li>• Confirmation screen includes your order reference for follow-up.</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}