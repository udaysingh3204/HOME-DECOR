import Link from "next/link";

export function Hero({
  metrics,
  collections,
}: {
  metrics: { collections: number; rooms: number; products: number; readyToShip: number };
  collections: string[];
}) {
  return (
    <section className="container grid gap-8 px-1 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-12">
      <div className="fade-up glass-card rounded-[40px] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <span className="pill">Curated rooms. Faster checkout. Happier flow.</span>
        <h1 className="section-title mt-6 max-w-[12ch]">Build a home that looks styled without feeling staged.</h1>
        <p className="section-copy mt-6 text-base sm:text-lg">
          Atelier Home now behaves like a compact, complete ecommerce experience. Browse live-filtered products, sign in or create an account, move through checkout, and revisit previous orders from the same account dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="button-primary">
            Shop collection
          </Link>
          <Link href="/checkout" className="button-secondary">
            Go to checkout
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <div className="rounded-[24px] bg-white/45 p-4">
            <p className="text-sm text-[var(--muted)]">Products</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.products}</p>
          </div>
          <div className="rounded-[24px] bg-white/45 p-4">
            <p className="text-sm text-[var(--muted)]">Collections</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.collections}</p>
          </div>
          <div className="rounded-[24px] bg-white/45 p-4">
            <p className="text-sm text-[var(--muted)]">Rooms</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.rooms}</p>
          </div>
          <div className="rounded-[24px] bg-white/45 p-4">
            <p className="text-sm text-[var(--muted)]">Fast dispatch</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.readyToShip}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="fade-up rounded-[36px] bg-[linear-gradient(135deg,#264337,#1a2f28)] p-6 text-white shadow-[var(--shadow)]" style={{ animationDelay: "120ms" }}>
          <p className="text-sm uppercase tracking-[0.22em] text-white/70">Live merchandising</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl">Filter by room, collection, category, and price without leaving the page</p>
        </div>
        <div className="fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-2" style={{ animationDelay: "220ms" }}>
          <div className="glass-card rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--forest)]">Collections</p>
            <p className="mt-3 text-lg font-semibold leading-7">{collections.join(" · ")}</p>
          </div>
          <div className="glass-card rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--forest)]">Post-purchase</p>
            <p className="mt-3 text-lg font-semibold">Checkout completes with stored order history and delivery windows.</p>
          </div>
        </div>
      </div>
    </section>
  );
}