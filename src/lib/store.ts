import { db } from "@/lib/db";
import { categories, collections, rooms, type Product } from "@/data/products";

export type CatalogQuery = {
  category?: string;
  room?: string;
  collection?: string;
  search?: string;
  maxPrice?: number;
  sort?: string;
};

export type CatalogResponse = {
  products: Product[];
  stats: {
    totalProducts: number;
    availableNow: number;
    averagePrice: number;
    featuredCount: number;
  };
  facets: {
    categories: string[];
    rooms: string[];
    collections: string[];
    maxPrice: number;
  };
};

type ProductRecord = Awaited<ReturnType<typeof db.product.findFirst>>;

function mapProduct(record: NonNullable<ProductRecord>): Product {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.category as Product["category"],
    room: record.room as Product["room"],
    collection: record.collectionName as Product["collection"],
    price: record.price,
    compareAtPrice: record.compareAtPrice ?? undefined,
    rating: record.rating,
    reviewCount: record.reviewCount,
    badge: record.badge ?? undefined,
    colors: record.colors as string[],
    materials: record.materials as string[],
    dimensions: record.dimensions,
    description: record.description,
    story: record.story,
    features: record.features as string[],
    image: record.image,
    gallery: record.gallery as string[],
    featured: record.featured,
    stock: record.stock,
    leadTimeDays: record.leadTimeDays,
    auraScore: (record as any).auraScore ?? 0,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({ where: { slug } });

  if (!product || !product.active) {
    return null;
  }

  const related = await db.product.findMany({
    where: {
      active: true,
      slug: { not: slug },
      OR: [{ category: product.category }, { room: product.room }],
    },
    take: 3,
  });

  const mappedProduct = mapProduct(product);

  return {
    product: mappedProduct,
    relatedProducts: related.map(mapProduct),
    inventoryLabel:
      mappedProduct.stock > 10 ? "Ready to ship" : mappedProduct.stock > 4 ? `Only ${mappedProduct.stock} left` : "Low stock",
    estimatedDelivery: `${mappedProduct.leadTimeDays}-${mappedProduct.leadTimeDays + 2} business days`,
  };
}

function sortProducts(items: Product[], sort = "featured") {
  switch (sort) {
    case "price-asc":
      return [...items].sort((left, right) => left.price - right.price);
    case "price-desc":
      return [...items].sort((left, right) => right.price - left.price);
    case "rating":
      return [...items].sort((left, right) => right.rating - left.rating);
    case "newest":
      return [...items].sort(
        (left, right) => Number(Boolean(right.badge === "New")) - Number(Boolean(left.badge === "New")),
      );
    default:
      return [...items].sort((left, right) => Number(right.featured) - Number(left.featured) || right.rating - left.rating);
  }
}

export async function getCatalog(query: CatalogQuery = {}): Promise<CatalogResponse> {
  const maxRow = await db.product.aggregate({ _max: { price: true }, where: { active: true } });
  const maxAllowedPrice = maxRow._max.price ?? 0;
  const maxPrice = query.maxPrice ?? maxAllowedPrice;
  const search = query.search?.trim().toLowerCase() ?? "";

  const rawProducts = await db.product.findMany({
    where: {
      active: true,
      ...(query.category && query.category !== "All" ? { category: query.category } : {}),
      ...(query.room && query.room !== "All" ? { room: query.room } : {}),
      ...(query.collection && query.collection !== "All" ? { collectionName: query.collection } : {}),
      price: { lte: maxPrice },
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { category: { contains: search } },
              { room: { contains: search } },
              { collectionName: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
  });

  const filteredProducts = sortProducts(rawProducts.map(mapProduct), query.sort);

  const availableNow = filteredProducts.filter((product) => product.stock > 0).length;
  const averagePrice = filteredProducts.length
    ? Math.round(filteredProducts.reduce((sum, product) => sum + product.price, 0) / filteredProducts.length)
    : 0;

  return {
    products: filteredProducts,
    stats: {
      totalProducts: filteredProducts.length,
      availableNow,
      averagePrice,
      featuredCount: filteredProducts.filter((product) => product.featured).length,
    },
    facets: {
      categories,
      rooms,
      collections,
      maxPrice: maxAllowedPrice,
    },
  };
}

export async function getHomeData() {
  const featured = (await db.product.findMany({ where: { active: true, featured: true }, take: 4 })).map(mapProduct);
  const newest = (await db.product.findMany({ where: { active: true, badge: "New" }, take: 3 })).map(mapProduct);
  const productCount = await db.product.count({ where: { active: true } });
  const readyToShip = await db.product.count({ where: { active: true, leadTimeDays: { lte: 3 } } });

  return {
    featured,
    newest,
    metrics: {
      collections: collections.length,
      rooms: rooms.length,
      products: productCount,
      readyToShip,
    },
    collections,
  };
}