"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { CatalogResponse } from "@/lib/store";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

export function Catalog({ initialCatalog }: { initialCatalog: CatalogResponse }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRoom, setSelectedRoom] = useState<string>("All");
  const [selectedCollection, setSelectedCollection] = useState<string>("All");
  const [priceCap, setPriceCap] = useState(initialCatalog.facets.maxPrice);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const controller = new AbortController();
    const searchParams = new URLSearchParams({ sort: sortBy, maxPrice: String(priceCap) });

    if (selectedCategory !== "All") {
      searchParams.set("category", selectedCategory);
    }
    if (selectedRoom !== "All") {
      searchParams.set("room", selectedRoom);
    }
    if (selectedCollection !== "All") {
      searchParams.set("collection", selectedCollection);
    }
    if (deferredSearch.trim()) {
      searchParams.set("search", deferredSearch.trim());
    }

    fetch(`/api/products?${searchParams.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = (await response.json()) as CatalogResponse;
        setCatalog(data);
        setError("");
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [deferredSearch, priceCap, selectedCategory, selectedCollection, selectedRoom, sortBy]);

  return (
    <section className="container pb-16 pt-6">
      <div className="mb-8 grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        <aside className="glass-card rounded-[32px] p-6">
          <p className="pill">Filter products</p>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="search" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Search
              </label>
              <input
                id="search"
                className="input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Lamp, linen, oak..."
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--muted)]">Category</p>
              <div className="flex flex-wrap gap-2">
                {["All", ...catalog.facets.categories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-[var(--surface-dark)] text-white"
                        : "bg-white/45 text-[var(--text)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="room" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Room
              </label>
              <select id="room" className="select" value={selectedRoom} onChange={(event) => setSelectedRoom(event.target.value)}>
                {["All", ...catalog.facets.rooms].map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="collection" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Collection
              </label>
              <select
                id="collection"
                className="select"
                value={selectedCollection}
                onChange={(event) => setSelectedCollection(event.target.value)}
              >
                {["All", ...catalog.facets.collections].map((collection) => (
                  <option key={collection} value={collection}>
                    {collection}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Max price: ${priceCap}
              </label>
              <input
                id="price"
                type="range"
                min="30"
                max={catalog.facets.maxPrice}
                step="10"
                value={priceCap}
                onChange={(event) => setPriceCap(Number(event.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-4 rounded-[32px] bg-white/35 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="section-title max-w-[10ch] text-[2.2rem] sm:text-[2.7rem]">Shop the collection</h1>
              <p className="section-copy mt-2">Browse decor categories, room pairings, collection stories, and budget ranges with live product updates.</p>
            </div>
            <div className="w-full sm:max-w-[220px]">
              <label htmlFor="sort" className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Sort by
              </label>
              <select id="sort" className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between text-sm text-[var(--muted)]">
            <div className="flex flex-wrap gap-3">
              <p>{catalog.stats.totalProducts} items found</p>
              <p>{catalog.stats.availableNow} available now</p>
              <p>Average ${catalog.stats.averagePrice}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedRoom("All");
                setSelectedCollection("All");
                setPriceCap(catalog.facets.maxPrice);
                setSearch("");
                setSortBy("featured");
              }}
              className="font-semibold text-[var(--accent-strong)]"
            >
              Reset filters
            </button>
          </div>

          {error ? <p className="mb-5 rounded-[24px] bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {catalog.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}