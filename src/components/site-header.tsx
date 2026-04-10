"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, User as UserIcon, LogOut, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Magnetic } from "@/components/magnetic";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Vibe" },
  { href: "/products", label: "Drops" },
  { href: "/cart", label: "Stash" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navLinks = user?.role === "ADMIN" ? [...links, { href: "/admin", label: "Control" }] : links;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container glass-card flex flex-col gap-4 rounded-3xl px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8"
      >
        <Magnetic>
          <Link href="/" className="group flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Zap className="h-6 w-6 fill-current" />
            </motion.div>
            <div>
              <p className="aura-text-gradient font-(family-name:--font-display) text-3xl font-black tracking-tighter">AURA</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">Aesthetic Supremacy</p>
            </div>
          </Link>
        </Magnetic>

        <nav className="flex items-center gap-1 md:gap-3">
          {navLinks.map((link) => (
            <Magnetic key={link.href}>
              <Link href={link.href} className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300",
                    pathname === link.href
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                  {link.href === "/cart" && itemCount > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--accent) text-[10px] text-white animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </motion.div>
                {pathname === link.href && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-(--accent) blur-[2px]"
                  />
                )}
              </Link>
            </Magnetic>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm font-bold">
          <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs uppercase tracking-wider text-white/50 lg:block">
            Free shipping if you don&apos;t keep us a secret
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-xs font-black uppercase tracking-tighter text-white">{user.name}</p>
                <p className="text-[10px] text-white/40">{user.role}</p>
              </div>
              <Magnetic>
                <button 
                  type="button" 
                  onClick={() => void logout()} 
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </Magnetic>
            </div>
          ) : (
            <Magnetic>
              <Link href="/login" className="button-primary px-6 py-2.5">
                Enter
              </Link>
            </Magnetic>
          )}
        </div>
      </motion.div>
    </header>
  );
}