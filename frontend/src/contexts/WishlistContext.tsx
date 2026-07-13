"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type WishlistContextType = {
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("shopora_wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        localStorage.removeItem("shopora_wishlist");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("shopora_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const toggleWishlist = (productId: number) => {
    setWishlist((w) =>
      w.includes(productId) ? w.filter((id) => id !== productId) : [...w, productId]
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
