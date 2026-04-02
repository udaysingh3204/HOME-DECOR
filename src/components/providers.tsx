"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { OrdersProvider } from "@/contexts/orders-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>{children}</CartProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}