"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, qty?: number) => void;
  updateQty: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("shopora_cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        localStorage.removeItem("shopora_cart");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("shopora_cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === product.id);
      if (existing) {
        return c.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...c, { product, qty }];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((c) =>
      c.map((i) =>
        i.product.id === productId
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((c) => c.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
