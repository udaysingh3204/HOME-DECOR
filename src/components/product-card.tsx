"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Scan, Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/cart-context";
import { useAuraSounds } from "@/hooks/use-aura-sounds";
import { Magnetic } from "@/components/magnetic";
import { formatPrice, cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { playClick, playLock } = useAuraSounds();
  
  // Custom Edition Number based on product ID
  const editionNumber = (product.id * 7 + 104).toString().padStart(3, "0");
  const totalEditions = 500;

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { damping: 20, stiffness: 300 });
  const mouseYSpring = useSpring(y, { damping: 20, stiffness: 300 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => playLock()}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="glass-card group relative h-full rounded-2xl"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/40 ai-scan-glow">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
          sizes="(max-width: 768px) 100vw, 33vw" 
        />
        
        {/* Edition Status Layer */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <span className="edition-badge">ED. {editionNumber} / {totalEditions}</span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Aura Score</span>
              <span className="aura-text-gradient font-black text-xs">+{product.auraScore}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex gap-1">
              <div className="h-10 w-1 bg-accent/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(product.auraScore / 100) * 100}%` }}
                  className="w-full bg-accent"
                />
              </div>
              <div className="h-10 w-1 bg-cyan/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: "45%" }}
                  className="w-full bg-cyan"
                />
              </div>
            </div>
            <Scan className="h-5 w-5 text-white/20" />
          </div>
        </div>
      </div>

      <div style={{ transform: "translateZ(30px)" }} className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-meta">{product.category} — {product.room}</p>
          <Link 
            href={`/products/${product.slug}`} 
            className="group/link flex items-start justify-between"
          >
            <h2 className="heading-bold text-3xl transition-colors hover:text-accent">
              {product.name}
            </h2>
            <ArrowUpRight className="h-5 w-5 text-white/20 group-hover/link:text-accent transition-colors shrink-0 mt-1" />
          </Link>
        </div>

        <p className="text-xs font-medium leading-relaxed text-white/40 line-clamp-2 italic font-(family-name:--font-serif-elegant)">
          &ldquo;{product.description}&rdquo;
        </p>
        
        <div className="pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Acquisition</span>
            <span className="heading-elegant text-2xl text-white">{formatPrice(product.price)}</span>
          </div>

          <Magnetic>
            <button 
              type="button" 
              onClick={() => { playClick(); addToCart(product); }} 
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-accent hover:text-white"
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full border border-white opacity-0 group-hover:animate-ping group-hover:opacity-20" />
            </button>
          </Magnetic>
        </div>

        {/* AI Manifest Details */}
        <div className="flex items-center gap-3 pt-2">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Synthesized in {product.leadTimeDays} Cycles</span>
        </div>
      </div>
    </motion.article>
  );
}