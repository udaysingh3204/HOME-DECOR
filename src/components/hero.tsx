"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scan, Sparkles, Binary } from "lucide-react";
import { Magnetic } from "@/components/magnetic";

export function Hero({
  metrics,
  collections,
}: {
  metrics: { collections: number; rooms: number; products: number; readyToShip: number };
  collections: string[];
}) {
  return (
    <section className="container px-4 py-20 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 text-meta"
            >
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Manifesto Vol. 01 / Serial 00A</span>
            </motion.div>
            
            <h1 className="section-title text-white">
              YOUR SPACE IS <br />
              <span className="aura-text-gradient italic">UNFINISHED</span>.
            </h1>
            
            <p className="section-subtitle">
              AURA is the definitive technical layer for your home. We synthesize high-end architecture with raw digital energy to define your aesthetic supremacy.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <Magnetic>
              <Link href="/products" className="button-primary group">
                Enter the Void
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Magnetic>
            <Link href="/products?featured=true" className="group flex items-center gap-2 text-meta hover:text-white transition-colors">
              <span>View Collections</span>
              <div className="h-[1px] w-8 bg-white/20 transition-all group-hover:w-12 group-hover:bg-accent" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.5 }}
          className="relative"
        >
          <div className="glass-card rounded-none border-l-4 border-accent p-10 md:p-16">
            <Scan className="h-10 w-10 text-white/10 mb-8 ai-scan-glow" />
            <h3 className="heading-bold text-4xl leading-none text-white lg:text-5xl">
              SYNTHESIZED OBJET <br /> D&apos;ART.
            </h3>
            <p className="mt-8 text-sm font-medium leading-relaxed text-white/40 italic font-(family-name:--font-serif-elegant) max-w-sm">
              &ldquo;Every drop represents a calculated vibration in the modern landscape. We don&apos;t just design decor; we manifest frequency.&rdquo;
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
              <div className="space-y-1">
                <p className="text-meta">Aura Flux</p>
                <p className="heading-bold text-3xl">+1000</p>
              </div>
              <div className="space-y-1">
                <p className="text-meta">Manifested</p>
                <p className="heading-bold text-3xl">{metrics.products}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -z-10 -right-12 -bottom-12 h-64 w-64 rounded-full bg-accent/20 blur-[120px]" />
        </motion.div>
      </div>

      {/* Editorial Stats Bar */}
      <div className="mt-32 grid gap-8 md:grid-cols-4 border-t border-white/10 pt-12">
        {[
          { label: "Technical Series", val: "A.01-A.04", icon: Binary },
          { label: "Zone Mastery", val: metrics.rooms, icon: Scan },
          { label: "Global Sync", val: "NOW", icon: Sparkles },
          { label: "Availability", val: "SCARCE", icon: ArrowRight },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <stat.icon className="h-3 w-3 text-accent" />
              <p className="text-meta">{stat.label}</p>
            </div>
            <p className="heading-bold text-2xl text-white">{stat.val}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}