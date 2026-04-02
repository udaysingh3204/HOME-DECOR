# Atelier Home

Atelier Home is a Next.js home decor ecommerce app with persisted auth, catalog, cart, orders, payment records, and admin inventory controls. The storefront stays polished, but the core commerce flows now run through Prisma-backed API routes instead of browser-only state.

## Features

- Editorial storefront home page with featured products and collection storytelling.
- Product catalog with search, category, room, collection, price, and sort filters.
- Product detail pages with richer merchandising, stock visibility, and related products.
- Cookie-session authentication with registration, login, logout, and account-aware order history.
- Synced cart behavior with guest-cart merge on sign-in.
- Persisted checkout flow with payment records, stock decrement on successful payment, and success or decline confirmation states.
- Admin dashboard for revenue snapshot, recent orders, low-stock watch, inventory updates, and order status progression.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite
- Cookie-based auth using jose
- Password hashing with bcryptjs

## Run locally

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Demo accounts

- Admin: admin@atelierhome.com / Admin123!
- Customer: hello@atelierhome.com / sample123

## Environment

- `.env.example` documents the required variables.
- `.env` is used locally by Prisma CLI in this workspace.
- `.env.local` is available for Next.js local runtime config.

## Notes

- Product seed content still comes from `src/data/products.ts`, then gets written into SQLite through Prisma seed.
- Payments use a demo provider by default, including explicit success and decline test flows for checkout UX, and automatically switch to a `stripe-ready` mode when `STRIPE_SECRET_KEY` is present.