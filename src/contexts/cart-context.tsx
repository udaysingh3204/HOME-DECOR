"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { Product } from "@/data/products";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isSyncing: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CART_KEY = "home-decor-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedCart = window.localStorage.getItem(CART_KEY);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [isAuthenticated, items]);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      return;
    }

    const response = await fetch("/api/cart", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { items: CartItem[] };
    setItems(payload.items);
  };

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(async () => {
      if (cancelled || authLoading) {
        return;
      }

      if (!isAuthenticated || !user) {
        const storedCart = window.localStorage.getItem(CART_KEY);
        if (!cancelled) {
          setItems(storedCart ? (JSON.parse(storedCart) as CartItem[]) : []);
        }
        return;
      }

      const guestCart = window.localStorage.getItem(CART_KEY);
      if (guestCart) {
        const parsed = JSON.parse(guestCart) as CartItem[];
        if (parsed.length > 0) {
          await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: parsed.map((item) => ({ productId: item.product.id, quantity: item.quantity })) }),
          });
        }
        window.localStorage.removeItem(CART_KEY);
      }

      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!cancelled && response.ok) {
        const payload = (await response.json()) as { items: CartItem[] };
        setItems(payload.items);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.product.id === product.id);
        if (existingItem) {
          return currentItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [...currentItems, { product, quantity }];
      });
      return;
    }

    setIsSyncing(true);
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    });

    if (response.ok) {
      const payload = (await response.json()) as { items: CartItem[] };
      setItems(payload.items);
    }
    setIsSyncing(false);
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated) {
      setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
      return;
    }

    setIsSyncing(true);
    const response = await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
    if (response.ok) {
      const payload = (await response.json()) as { items: CartItem[] };
      setItems(payload.items);
    }
    setIsSyncing(false);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      setItems((currentItems) =>
        currentItems
          .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );
      return;
    }

    setIsSyncing(true);
    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (response.ok) {
      const payload = (await response.json()) as { items: CartItem[] };
      setItems(payload.items);
    }
    setIsSyncing(false);
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setIsSyncing(true);
    const response = await fetch("/api/cart", { method: "DELETE" });
    if (response.ok) {
      const payload = (await response.json()) as { items: CartItem[] };
      setItems(payload.items);
    }
    setIsSyncing(false);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, isSyncing, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}