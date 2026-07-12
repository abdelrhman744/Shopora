"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Heart, Minus, Plus, Check, ShoppingCart, Package,
} from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import StarRating from "@/components/StarRating";
import Badge from "@/components/Badge";
import ProductCard from "@/components/ProductCard";
import { formatImageUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product } from "@/lib/types";

const FEATURES = [
  "Premium build quality with meticulous attention to detail",
  "Cutting-edge technology for peak performance",
  "Long-lasting battery / durability",
  "Seamless wireless connectivity",
  "Compact, portable design",
  "Compatible with all major platforms",
];

const IN_THE_BOX = [
  "1x Device",
  "USB-C Charging Cable",
  "Protective Carry Case",
  "Quick Start Guide",
  "2-Year Warranty Card",
];

const SPECS: [string, string][] = [
  ["Weight", "250g"],
  ["Connectivity", "Bluetooth 5.3"],
  ["Battery", "Up to 35 hours"],
  ["Charging", "USB-C, 2hrs full"],
  ["Warranty", "2 years"],
  ["Compatibility", "iOS, Android, Windows, macOS"],
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Tech Reviewer, TechRadar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "Completely transformed my setup. The quality is absolutely stunning — worth every penny.", rating: 5 },
  { name: "Marcus Rivera", role: "Professional Streamer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", text: "I've tried dozens of products in this category and nothing comes close to this quality.", rating: 5 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Overview");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setQty(1);
    setTab("Overview");
    api
      .getProduct(productId)
      .then((p) => {
        setProduct(p);
        api.listProducts({ category: p.category_name, page_size: 8 }).then((res) => {
          setRelated(res.items.filter((r) => r.id !== p.id).slice(0, 4));
        });
      })
      .catch(() => setNotFound(true));
  }, [productId]);

  if (notFound) {
    return (
      <div className="pt-32 min-h-screen text-center px-6">
        <p className="text-white font-semibold text-lg mb-4">Product not found.</p>
        <Link href="/products" className="text-sm" style={{ color: "#FF8A00" }}>
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="pt-20 min-h-screen" />;
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;
  const isWished = wishlist.includes(product.id);

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-7xl mx-auto">
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-2 text-sm text-[#8D93A5] hover:text-white transition-colors mb-8"
      >
        <ChevronLeft size={16} /> Back to Products
      </button>
      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#11131B] aspect-square">
            {product.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formatImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-4 left-4"><Badge label={product.badge} /></div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center"
                style={{ background: "rgba(26,28,39,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Heart size={18} className={isWished ? "fill-pink-500 text-pink-500" : "text-[#8D93A5]"} />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF8A00] mb-2">{product.category_name}</p>
            <h1 className="text-3xl font-black text-white mb-3">{product.name}</h1>
            <StarRating rating={product.rating} count={product.reviews_count} />
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-black text-white">${product.price}</span>
            {product.original_price && (
              <span className="text-xl text-[#8D93A5] line-through">${product.original_price}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                Save {discount}%
              </span>
            )}
          </div>
          <p className="text-[#8D93A5] text-sm leading-relaxed">
            {product.description ||
              `Experience excellence with the ${product.name}. Crafted for discerning enthusiasts, this premium device delivers unmatched performance with a futuristic design aesthetic.`}
          </p>
          <div>
            <p className="text-xs font-semibold text-[#8D93A5] uppercase tracking-wider mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-xl overflow-hidden" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-white font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock_quantity || 99, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white">
                  <Plus size={14} />
                </button>
              </div>
              {product.in_stock ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1"><Check size={12} /> In Stock ({product.stock_quantity} left)</span>
              ) : (
                <span className="text-xs text-red-400">Out of Stock</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <GradientBtn
              size="lg"
              className="flex-1"
              disabled={!product.in_stock}
              onClick={() => {
                addToCart(product, qty);
                router.push("/cart");
              }}
            >
              <span className="flex items-center justify-center gap-2"><ShoppingCart size={18} /> Add to Cart</span>
            </GradientBtn>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:bg-pink-500/20"
              style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Heart size={20} className={isWished ? "fill-pink-500 text-pink-500" : "text-[#8D93A5]"} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["🚚", "Free Shipping", "Orders over $99"], ["🔒", "Secure Payment", "256-bit encryption"], ["↩️", "Easy Returns", "30-day policy"]].map(([icon, t, s]) => (
              <div key={t} className="p-3 rounded-xl text-center" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-lg mb-1">{icon}</div>
                <p className="text-xs font-semibold text-white">{t}</p>
                <p className="text-xs text-[#8D93A5]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-1 mb-8 p-1 rounded-2xl w-fit" style={{ background: "#1A1C27" }}>
          {["Overview", "Specifications", "Reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: tab === t ? "linear-gradient(135deg, #FF8A00 0%, #FF2D95 60%, #8A2BE2 100%)" : "transparent", color: tab === t ? "#fff" : "#8D93A5" }}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-white font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#C9CBD6]">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-white font-bold mb-4">In the Box</h3>
              <ul className="space-y-3">
                {IN_THE_BOX.map((i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#C9CBD6]">
                    <Package size={14} className="text-orange-400 flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {tab === "Specifications" && (
          <div className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="grid md:grid-cols-2 gap-0">
              {SPECS.map(([key, val], i) => (
                <div key={key} className="flex justify-between py-3 text-sm" style={{ borderBottom: i < SPECS.length - 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-[#8D93A5]">{key}</span>
                  <span className="text-white font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "Reviews" && (
          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <StarRating rating={t.rating} />
                    </div>
                    <p className="text-xs text-[#8D93A5] mb-2">{t.role}</p>
                    <p className="text-sm text-[#C9CBD6]">&quot;{t.text}&quot;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Related <GradientText>Products</GradientText></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
