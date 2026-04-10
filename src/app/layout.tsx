import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { AuraCursor } from "@/components/aura-cursor";
import { Noise } from "@/components/noise";
import { GooeyFilter } from "@/components/gooey-filter";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif-bold",
  subsets: ["latin"],
  weight: ["900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-elegant",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "AURA — The Vibe Haven",
  description: "Premium home decor for the main characters. Cyber-luxe, brutalist, and unapologetically elite.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${plusJakarta.variable} ${playfair.variable} ${cormorant.variable} selection:bg-(--accent) selection:text-white`}>
        <Providers>
          <div className="page-shell">
            <AuraCursor />
            <Noise />
            <GooeyFilter />
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}