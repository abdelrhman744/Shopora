"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoaded(true);
      return;
    }
    Promise.all(wishlist.map((id) => api.getProduct(id).catch(() => null))).then((results) => {
      setProducts(results.filter((p): p is Product => p !== null));
      setLoaded(true);
    });
  }, [wishlist]);

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-8">
        Your <GradientText>Wishlist</GradientText>
      </h1>
      {loaded && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: "#1A1C27" }}>
            <Heart size={36} className="text-[#8D93A5]" />
          </div>
          <p className="text-xl font-bold text-white mb-2">Your wishlist is empty</p>
          <p className="text-sm text-[#8D93A5] mb-8">Save items you love for later.</p>
          <GradientBtn onClick={() => router.push("/products")}>Browse Products</GradientBtn>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
          ))}
        </div>
      )}
    </div>
  );
}
