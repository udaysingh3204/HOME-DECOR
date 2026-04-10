"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useAuraSounds } from "@/hooks/use-aura-sounds";
import { formatPrice } from "@/lib/utils";
import { Magnetic } from "@/components/magnetic";

export function CartView() {
  const { items, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { playBloom, playClick } = useAuraSounds();

  useEffect(() => {
    if (items.length > 0) {
      playBloom();
    }
  }, [items.length, playBloom]);

  if (items.length === 0) {
    return (
      <section className="container py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[48px] p-12 text-center"
        >
          <span className="aura-pill">Void Detected</span>
          <h1 className="section-title mx-auto mt-8 max-w-[15ch]">Your stash is currently <span className="aura-text-gradient italic">lacking</span>.</h1>
          <p className="section-copy mx-auto mt-6">A home without AURA is just a collection of boxes. Go find some objects that actually matter.</p>
          <div className="mt-10">
            <Magnetic>
              <Link href="/products" className="button-primary group">
                Enter the Void
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </section>
    );
  }

  const shipping = subtotal > 250 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_0.4fr]">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-(--accent)" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">The Stash</span>
          </div>
          <h1 className="section-title mt-4">Current <span className="aura-text-gradient">Collections</span>.</h1>
        </div>

        <div className="space-y-6" style={{ filter: "url(#aura-goo)" }}>
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.article 
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: -100 }}
                className="glass-card group flex flex-col gap-6 rounded-[32px] p-6 md:flex-row md:items-center"
              >
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover transition-transform group-hover:scale-110" sizes="128px" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span>{item.product.category}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span>{item.product.room}</span>
                  </div>
                  <h2 className="mt-2 font-(family-name:--font-display) text-3xl font-black text-white">{item.product.name}</h2>
                  <div className="mt-4 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/20" htmlFor={`qty-${item.product.id}`}>Qty</label>
                      <select
                        id={`qty-${item.product.id}`}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-(--accent)"
                        value={item.quantity}
                        onChange={(e) => void updateQuantity(item.product.id, Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <p className="text-sm font-black text-white/60">{formatPrice(item.product.price)} each</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t border-white/5 pt-4 md:border-none md:pt-0">
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{formatPrice(item.product.price * item.quantity)}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--accent)">Aura +{(item.product.auraScore ?? 0) * item.quantity}</p>
                  </div>
                  <Magnetic>
                    <button 
                      type="button" 
                      onClick={() => { playClick(); removeFromCart(item.product.id); }} 
                      className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </Magnetic>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <aside className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card sticky top-32 rounded-[40px] p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-8">
            <Zap className="h-4 w-4 text-(--accent) fill-current" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Manifest</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white/40">Subtotal</span>
              <span className="text-lg font-black text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white/40">Logistics</span>
              <span className="text-lg font-black text-white">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </div>
            
            <div className="h-[1px] w-full bg-white/5" />
            
            <div className="flex items-center justify-between">
              <span className="font-black text-white">Final Essence</span>
              <div className="text-right">
                <span className="text-3xl font-black aura-text-gradient">{formatPrice(total)}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">Tax Incl.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <Magnetic>
              <Link href={isAuthenticated ? "/checkout" : "/login"} className="button-primary w-full py-5 text-base">
                {isAuthenticated ? "Execute Manifest" : "Enter the Circle"}
              </Link>
            </Magnetic>
            <button 
              type="button" 
              onClick={() => { playClick(); clearCart(); }} 
              className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors py-4"
            >
              Dissolve Stash
            </button>
          </div>
        </motion.div>

        <div className="glass-card rounded-[32px] p-6 text-center border-dashed border-white/10 opacity-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Main Character Vibes</p>
          <p className="mt-2 text-xs font-medium text-white/60 italic">&ldquo;Your choices represent your current energy levels.&rdquo;</p>
        </div>
      </aside>
    </section>
  );
}