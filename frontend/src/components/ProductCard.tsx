"use client";

import { Heart, Eye, Plus } from "lucide-react";
import Link from "next/link";
import Badge from "./Badge";
import StarRating from "./StarRating";
import { GRADIENT_BTN } from "@/lib/theme";
import { formatImageUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
}) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;
  const isWished = wishlist.includes(product.id);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        background: "#1A1C27",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden bg-[#11131B] h-52">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formatImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to top, rgba(9,10,18,0.8) 0%, transparent 60%)",
            }}
          />
          <div className="absolute top-3 left-3">
            <Badge label={product.badge} />
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(26,28,39,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
            >
              <Heart
                size={14}
                className={isWished ? "fill-pink-500 text-pink-500" : "text-[#8D93A5]"}
              />
            </button>
            <button
              className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(26,28,39,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={14} className="text-[#8D93A5]" />
            </button>
          </div>
          {!product.in_stock && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(9,10,18,0.7)" }}
            >
              <span className="text-sm font-semibold text-[#8D93A5] bg-[#1A1C27] px-4 py-2 rounded-full border border-white/10">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-[#8D93A5] mb-1 font-medium uppercase tracking-wider">
            {product.category_name}
          </p>
          <h3 className="text-sm font-semibold text-white mb-2 leading-snug line-clamp-2">
            {product.name}
          </h3>
          <StarRating rating={product.rating} count={product.reviews_count} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">${product.price}</span>
              {product.original_price && (
                <span className="text-xs text-[#8D93A5] line-through">
                  ${product.original_price}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-emerald-400">-{discount}%</span>
              )}
            </div>
            <button
              disabled={!product.in_stock}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-40"
              style={{ background: GRADIENT_BTN, boxShadow: "0 2px 12px rgba(255,45,149,0.4)" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.in_stock) onAddToCart(product);
              }}
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
