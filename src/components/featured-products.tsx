"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/data/products";
import { Scan, Cpu, Layers } from "lucide-react";

export function FeaturedProducts({ featured, newest }: { featured: Product[]; newest: Product[] }) {
  return (
    <section className="container py-24 pb-48">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24 space-y-8"
      >
        <div className="flex items-center gap-4 text-meta">
          <Layers className="h-4 w-4 text-accent" />
          <span>Technical Drops — Vol. 01</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <h2 className="heading-bold text-[6rem] leading-[0.85] text-white lg:text-[10rem]">
            THE <br /> <span className="aura-text-gradient">DROPS</span>.
          </h2>
          <div className="editorial-border space-y-6">
            <p className="heading-elegant text-3xl text-white/80">
              Objects that vibrate on your frequency.
            </p>
            <p className="text-sm font-medium leading-relaxed text-white/40 max-w-md italic">
              A curated manifest of synthesized architecture for the unapologetically elite. Each piece is a calculated disruption of the physical landscape.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Asymmetric Magazine Grid */}
      <div className="magazine-grid">
        {featured.map((product, i) => {
          // Asymmetric layout logic
          const isLarge = i === 0;
          const isWide = i === 1;
          
          return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 1 }}
              viewport={{ once: true }}
              className={cn(
                "relative",
                isLarge ? "col-span-12 md:col-span-7 lg:col-span-8" : 
                isWide ? "col-span-12 md:col-span-5 lg:col-span-4" : 
                "col-span-12 md:col-span-6 lg:col-span-4"
              )}
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </div>

      {/* Technical Manifest Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="mt-48 editorial-border"
      >
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-meta text-accent">
              <Cpu className="h-3 w-3" />
              <span>Synthesized Efficiency</span>
            </div>
            <h3 className="heading-bold text-5xl text-white">LATEST <span className="aura-text-gradient">FRAGMENTS</span>.</h3>
          </div>
          <p className="text-meta">Manifested in {new Date().getFullYear()} Cycles</p>
        </div>

        <div className="grid gap-px bg-white/5 border border-white/5">
          {newest.map((product, i) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-black p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="space-y-2">
                <span className="text-meta opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all">Fragment 00{i + 1}</span>
                <h4 className="heading-bold text-3xl text-white group-hover:aura-text-gradient transition-all">{product.name}</h4>
              </div>
              
              <p className="max-w-md text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors">
                {product.story}
              </p>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-meta">Value</p>
                  <p className="heading-bold text-2xl text-white">{formatPrice(product.price)}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Scan className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Exclusivity Overlay */}
      <div className="mt-24 text-center">
        <p className="text-meta opacity-20">EndOfManifest.AURA</p>
      </div>
    </section>
  );
}

// Utility for cleaner class merging in this specific file
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}