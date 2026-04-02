export type ProductCategory = "Lighting" | "Textiles" | "Furniture" | "Wall Decor" | "Dining";

export type ProductRoom = "Living Room" | "Bedroom" | "Dining Room" | "Entryway" | "Workspace";

export type ProductCollection = "Soft Modern" | "Earth Tones" | "Gallery Layered" | "Nordic Calm";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  room: ProductRoom;
  collection: ProductCollection;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  colors: string[];
  materials: string[];
  dimensions: string;
  description: string;
  story: string;
  features: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  stock: number;
  leadTimeDays: number;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "sculptural-ceramic-lamp",
    name: "Sculptural Ceramic Lamp",
    category: "Lighting",
    room: "Bedroom",
    collection: "Soft Modern",
    price: 148,
    compareAtPrice: 182,
    rating: 4.8,
    reviewCount: 112,
    badge: "New",
    colors: ["Ivory", "Sand"],
    materials: ["Ceramic", "Linen"],
    dimensions: "17 in H x 11 in W",
    description: "A hand-finished table lamp with a soft linen shade that warms up reading corners and bedside setups.",
    story: "Designed for quiet corners, this lamp blends sculptural form with a diffused glow that softens evening rooms.",
    features: ["Soft ambient glow", "Textured ceramic base", "Works with warm LED bulbs"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    stock: 9,
    leadTimeDays: 3,
  },
  {
    id: 2,
    slug: "woven-throw-blanket",
    name: "Woven Throw Blanket",
    category: "Textiles",
    room: "Living Room",
    collection: "Earth Tones",
    price: 64,
    compareAtPrice: 78,
    rating: 4.6,
    reviewCount: 84,
    badge: "Best Seller",
    colors: ["Terracotta", "Cream"],
    materials: ["Cotton"],
    dimensions: "70 in L x 52 in W",
    description: "Textured cotton throw with tonal striping for sofas, benches, and layered bedroom styling.",
    story: "A relaxed layer that adds texture without visual noise, ideal for softer neutral palettes.",
    features: ["Machine washable", "Breathable cotton weave", "Year-round weight"],
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    stock: 16,
    leadTimeDays: 2,
  },
  {
    id: 3,
    slug: "oak-side-table",
    name: "Oak Side Table",
    category: "Furniture",
    room: "Living Room",
    collection: "Nordic Calm",
    price: 210,
    rating: 4.9,
    reviewCount: 63,
    colors: ["Oak", "Walnut"],
    materials: ["Wood"],
    dimensions: "22 in H x 18 in W",
    description: "Compact solid oak accent table with a rounded top and lower shelf for books or candles.",
    story: "A simple utility piece made to sit quietly next to lounge chairs and low-profile sofas.",
    features: ["Solid oak frame", "Rounded edges", "Lower shelf for styling"],
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    stock: 4,
    leadTimeDays: 6,
  },
  {
    id: 4,
    slug: "arched-wall-mirror",
    name: "Arched Wall Mirror",
    category: "Wall Decor",
    room: "Entryway",
    collection: "Gallery Layered",
    price: 178,
    compareAtPrice: 220,
    rating: 4.7,
    reviewCount: 51,
    badge: "Limited",
    colors: ["Brass", "Black"],
    materials: ["Metal", "Glass"],
    dimensions: "36 in H x 22 in W",
    description: "Statement mirror with a slim metal frame that adds height and light to entryways and bedrooms.",
    story: "This mirror was chosen for homes that need light bounce, vertical shape, and a quiet graphic outline.",
    features: ["Slim metal frame", "Easy wall mounting", "Works in narrow entryways"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 3,
    leadTimeDays: 7,
  },
  {
    id: 5,
    slug: "marble-candle-set",
    name: "Marble Candle Set",
    category: "Wall Decor",
    room: "Living Room",
    collection: "Soft Modern",
    price: 42,
    rating: 4.4,
    reviewCount: 97,
    colors: ["Stone", "Charcoal"],
    materials: ["Marble", "Wax"],
    dimensions: "4 in H x 3 in W",
    description: "A pair of softly scented candles housed in reusable marble vessels for shelves and coffee tables.",
    story: "Built for shelf styling, this set brings small-scale glow and stone texture to a layered tabletop.",
    features: ["Reusable marble vessel", "Soft cedar scent", "Gift-ready pair"],
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 18,
    leadTimeDays: 2,
  },
  {
    id: 6,
    slug: "linen-dining-runner",
    name: "Linen Dining Runner",
    category: "Dining",
    room: "Dining Room",
    collection: "Earth Tones",
    price: 36,
    rating: 4.5,
    reviewCount: 39,
    colors: ["Olive", "Natural"],
    materials: ["Linen"],
    dimensions: "90 in L x 15 in W",
    description: "Relaxed stonewashed linen runner designed for tablescapes, consoles, and layered seasonal decor.",
    story: "Made to ground a dining table with soft texture instead of heavy visual contrast.",
    features: ["Stonewashed finish", "Soft drape", "Fits six to eight seat tables"],
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 12,
    leadTimeDays: 2,
  },
  {
    id: 7,
    slug: "accent-lounge-chair",
    name: "Accent Lounge Chair",
    category: "Furniture",
    room: "Living Room",
    collection: "Soft Modern",
    price: 320,
    compareAtPrice: 360,
    rating: 4.6,
    reviewCount: 44,
    colors: ["Moss", "Stone"],
    materials: ["Boucle", "Ash Wood"],
    dimensions: "31 in H x 28 in W",
    description: "Curved accent chair with a tactile boucle seat and exposed wood frame for living rooms and studios.",
    story: "A lounge piece built to introduce softness and shape without overpowering smaller rooms.",
    features: ["Curved support", "Textured boucle seat", "Solid ash frame"],
    image: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 2,
    leadTimeDays: 10,
  },
  {
    id: 8,
    slug: "ripple-pendant-light",
    name: "Ripple Pendant Light",
    category: "Lighting",
    room: "Dining Room",
    collection: "Gallery Layered",
    price: 189,
    rating: 4.9,
    reviewCount: 73,
    badge: "Designer Pick",
    colors: ["Frost", "Smoke"],
    materials: ["Glass", "Steel"],
    dimensions: "20 in H x 14 in W",
    description: "Layered glass pendant that casts a soft ambient glow over dining tables and kitchen islands.",
    story: "Selected for dining zones that need a statement piece without harsh direct light.",
    features: ["Dimmable", "Layered glass diffuser", "Works over islands and tables"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    stock: 7,
    leadTimeDays: 4,
  },
  {
    id: 9,
    slug: "travertine-tray",
    name: "Travertine Tray",
    category: "Wall Decor",
    room: "Workspace",
    collection: "Nordic Calm",
    price: 58,
    rating: 4.7,
    reviewCount: 58,
    colors: ["Travertine", "Cream"],
    materials: ["Stone"],
    dimensions: "14 in L x 8 in W",
    description: "A low travertine tray for candles, perfumes, keys, or desktop accessories.",
    story: "Useful surfaces feel calmer when small objects are contained, and this tray does that with natural texture.",
    features: ["Natural stone variation", "Works in bath or entry", "Low-profile silhouette"],
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 14,
    leadTimeDays: 3,
  },
  {
    id: 10,
    slug: "boucle-bench",
    name: "Boucle Bench",
    category: "Furniture",
    room: "Entryway",
    collection: "Soft Modern",
    price: 268,
    rating: 4.8,
    reviewCount: 33,
    colors: ["Oat", "Pebble"],
    materials: ["Boucle", "Oak"],
    dimensions: "19 in H x 44 in W",
    description: "Slim entry bench with a soft upholstered top and oak legs for front halls or bedroom footboards.",
    story: "Built for transitional spaces where comfort and visual quiet matter more than bulk storage.",
    features: ["Compact footprint", "Textured upholstery", "Solid wood base"],
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 5,
    leadTimeDays: 8,
  },
  {
    id: 11,
    slug: "stoneware-dinner-set",
    name: "Stoneware Dinner Set",
    category: "Dining",
    room: "Dining Room",
    collection: "Earth Tones",
    price: 96,
    compareAtPrice: 120,
    rating: 4.7,
    reviewCount: 67,
    badge: "Set of 4",
    colors: ["Bone", "Clay"],
    materials: ["Stoneware"],
    dimensions: "11 in plate diameter",
    description: "Matte stoneware set with subtle speckling for everyday dinners and layered weekend tables.",
    story: "Made for homes that want tactile, understated tableware rather than glossy formal settings.",
    features: ["Microwave safe", "Dishwasher safe", "Includes four place settings"],
    image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    stock: 11,
    leadTimeDays: 3,
  },
  {
    id: 12,
    slug: "pleated-desk-lamp",
    name: "Pleated Desk Lamp",
    category: "Lighting",
    room: "Workspace",
    collection: "Gallery Layered",
    price: 132,
    rating: 4.5,
    reviewCount: 41,
    colors: ["Ink", "Parchment"],
    materials: ["Steel", "Fabric"],
    dimensions: "19 in H x 8 in W",
    description: "A compact metal desk lamp with a pleated shade for home offices and reading nooks.",
    story: "Chosen for work corners that need task lighting with some softness and character.",
    features: ["Directional arm", "Pleated shade", "Compact base"],
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    stock: 8,
    leadTimeDays: 3,
  }
];

export const categories: ProductCategory[] = ["Lighting", "Textiles", "Furniture", "Wall Decor", "Dining"];

export const rooms: ProductRoom[] = ["Living Room", "Bedroom", "Dining Room", "Entryway", "Workspace"];

export const collections: ProductCollection[] = ["Soft Modern", "Earth Tones", "Gallery Layered", "Nordic Calm"];