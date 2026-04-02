"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/login", label: "Account" },
  { href: "/cart", label: "Cart" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navLinks = user?.role === "ADMIN" ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="container glass-card flex flex-col gap-4 rounded-[32px] border border-white/60 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-dark)] text-sm font-bold uppercase tracking-[0.28em] text-white shadow-lg shadow-[rgba(34,62,52,0.24)]">
            AH
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl">Atelier Home</p>
            <p className="text-sm text-[var(--muted)]">Layered home decor, delivered with calm</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 transition",
                pathname === link.href
                  ? "bg-[var(--surface-dark)] text-white"
                  : "bg-white/40 text-[var(--text)] hover:bg-white/60",
              )}
            >
              {link.label}
              {link.href === "/cart" ? ` (${itemCount})` : ""}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden rounded-full bg-[rgba(46,88,72,0.08)] px-4 py-2 text-[var(--forest)] lg:block">
            Free shipping over $250
          </div>
          {user ? (
            <>
              <div className="rounded-full bg-white/40 px-4 py-2">
                <p className="font-semibold capitalize text-[var(--text)]">{user.name}</p>
                <p className="text-[var(--muted)]">{user.email}</p>
              </div>
              <button type="button" onClick={() => void logout()} className="button-secondary px-4 py-2">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="button-primary px-5 py-2">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}