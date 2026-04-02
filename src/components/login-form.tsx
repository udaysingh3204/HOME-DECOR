"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/orders-context";
import { formatPrice } from "@/lib/utils";

export function LoginForm() {
  const { user, login, register } = useAuth();
  const { orders } = useOrders();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [name, setName] = useState("Atelier Guest");
  const [email, setEmail] = useState("hello@atelierhome.com");
  const [password, setPassword] = useState("sample123");
  const [error, setError] = useState("");

  const paymentTone = (paymentStatus?: "SUCCEEDED" | "FAILED" | "PENDING") => {
    if (paymentStatus === "FAILED") {
      return "bg-red-100 text-red-700";
    }
    if (paymentStatus === "PENDING") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-emerald-100 text-emerald-700";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = mode === "signin" ? await login(email, password) : await register(name, email, password);
    if (!result.ok) {
      setError(result.message ?? "Unable to sign in.");
      return;
    }

    setError("");
    startTransition(() => {
      router.push("/products");
    });
  };

  return (
    <section className="container grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="fade-up">
        <p className="pill">Account and order hub</p>
        <h1 className="section-title mt-5 max-w-[11ch]">Sign in, check out, and revisit every order in one place.</h1>
        <p className="section-copy mt-5">
          The account area now doubles as a working profile and order hub. Create an account, continue shopping, then come back to review order totals and delivery windows.
        </p>
        {user ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-(--surface-dark) p-6 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Current session</p>
              <p className="mt-3 text-2xl font-semibold capitalize">{user.name}</p>
              <p className="mt-1 text-white/80">{user.email}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/products" className="button-secondary bg-white/10 text-white">
                  Continue shopping
                </Link>
                <Link href="/checkout" className="button-secondary bg-white/10 text-white">
                  Go to checkout
                </Link>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--forest)">Recent orders</p>
              {orders.length === 0 ? (
                <p className="mt-3 text-sm text-(--muted)">No orders yet. Complete checkout and your purchases will appear here.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="rounded-[1.375rem] bg-white/45 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-(--text)">{order.id}</p>
                          <p className="text-sm text-(--muted)">{new Date(order.createdAt).toLocaleDateString()} · {order.status}</p>
                          <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentTone(order.paymentStatus)}`}>
                            Payment {order.paymentStatus?.toLowerCase() ?? "unknown"}
                          </p>
                        </div>
                        <p className="font-semibold text-(--text)">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="glass-card fade-up rounded-4xl p-6 sm:p-8" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-white/40 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={mode === "signin" ? "rounded-full bg-(--surface-dark) px-4 py-2 text-white" : "rounded-full px-4 py-2"}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("create")}
              className={mode === "create" ? "rounded-full bg-(--surface-dark) px-4 py-2 text-white" : "rounded-full px-4 py-2"}
            >
              Create account
            </button>
          </div>
          {mode === "create" ? (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-(--muted)">
                Full name
              </label>
              <input id="name" type="text" className="input" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          ) : null}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-(--muted)">
              Email
            </label>
            <input id="email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-(--muted)">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <button type="submit" className="button-primary w-full">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <p className="text-sm leading-6 text-(--muted)">Authentication now uses a real app session backed by the database. Demo customer login: hello@atelierhome.com / sample123.</p>
        </div>
      </form>
    </section>
  );
}