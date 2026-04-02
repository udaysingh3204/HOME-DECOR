"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { Product } from "@/data/products";

type OrderItem = {
  product: Product;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  createdAt: string;
  status: "Confirmed" | "Packed" | "Shipped";
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  country: string;
  deliveryWindow: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

type PlaceOrderInput = {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  country: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

type OrdersContextValue = {
  orders: OrderRecord[];
  placeOrder: (input: PlaceOrderInput) => Promise<{ ok: boolean; orderId?: string; message?: string }>;
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

function normalizeStatus(status: string): OrderRecord["status"] {
  switch (status) {
    case "PACKED":
      return "Packed";
    case "SHIPPED":
    case "DELIVERED":
      return "Shipped";
    default:
      return "Confirmed";
  }
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const refreshOrders = async () => {
    if (!isAuthenticated) {
      return;
    }

    const response = await fetch("/api/orders", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { orders: Array<Omit<OrderRecord, "status"> & { status: string }> };
    setOrders(payload.orders.map((order) => ({ ...order, status: normalizeStatus(order.status) })));
  };

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(async () => {
      if (!isAuthenticated || !user) {
        if (!cancelled) {
          setOrders([]);
        }
        return;
      }

      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!cancelled && response.ok) {
        const payload = (await response.json()) as { orders: Array<Omit<OrderRecord, "status"> & { status: string }> };
        setOrders(payload.orders.map((order) => ({ ...order, status: normalizeStatus(order.status) })));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  const placeOrder = async (input: PlaceOrderInput) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const payload = (await response.json()) as { orderId?: string; message?: string };
    if (!response.ok) {
      return { ok: false, message: payload.message ?? "Unable to place the order." };
    }

    await refreshOrders();
    return { ok: true, orderId: payload.orderId };
  };

  return <OrdersContext.Provider value={{ orders, placeOrder, refreshOrders }}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }

  return context;
}