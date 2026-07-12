"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Check, Grid3x3, List, Plus } from "lucide-react";
import GradientText from "@/components/GradientText";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import { GRADIENT_BTN } from "@/lib/theme";
import { formatImageUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product, Category } from "@/lib/types";

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
  { label: "Rating", value: "rating" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceMax, setPriceMax] = useState(1500);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .listProducts({
        search: search || undefined,
        category: selectedCat !== "All" ? selectedCat : undefined,
        max_price: priceMax,
        sort: sortBy,
        page_size: 100,
      })
      .then((res) => setProducts(res.items))
      .finally(() => setLoading(false));
  }, [search, selectedCat, sortBy, priceMax]);

  const cats = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">
          All <GradientText>Products</GradientText>
        </h1>
        <p className="text-[#8D93A5]">Showing {products.length} products</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          <div className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filters
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#8D93A5] uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-2">
                  {cats.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCat(c)}
                      className="w-full text-left text-sm flex items-center justify-between py-1.5 transition-colors"
                      style={{ color: selectedCat === c ? "#FF8A00" : "#C9CBD6" }}
                    >
                      <span>{c}</span>
                      {selectedCat === c && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
                <p className="text-xs font-semibold text-[#8D93A5] uppercase tracking-wider mb-3">Price Range</p>
                <div className="flex items-center justify-between text-xs text-[#8D93A5] mb-2">
                  <span>$0</span><span>${priceMax}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500}
                  value={priceMax}
                  onChange={(e) => setPriceMax(+e.target.value)}
                  className="w-full accent-orange-500"
                />
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
                <p className="text-xs font-semibold text-[#8D93A5] uppercase tracking-wider mb-3">Rating</p>
                {[5, 4, 3].map((r) => (
                  <button key={r} className="flex items-center gap-2 w-full py-1.5 text-sm text-[#C9CBD6] hover:text-white transition-colors">
                    <StarRating rating={r} /> &amp; up
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D93A5]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500"
                style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm text-[#C9CBD6] outline-none"
              style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${viewMode === "grid" ? "text-white" : "text-[#8D93A5]"}`}
                style={{ background: viewMode === "grid" ? "#2A2D3E" : "transparent" }}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${viewMode === "list" ? "text-white" : "text-[#8D93A5]"}`}
                style={{ background: viewMode === "list" ? "#2A2D3E" : "transparent" }}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {!loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#1A1C27" }}>
                <Search size={28} className="text-[#8D93A5]" />
              </div>
              <p className="text-white font-semibold mb-2">No products found</p>
              <p className="text-sm text-[#8D93A5]">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-4"}>
              {products.map((p) =>
                viewMode === "grid" ? (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                ) : (
                  <div
                    key={p.id}
                    className="flex gap-4 p-4 rounded-2xl cursor-pointer hover:-translate-y-0.5 transition-transform"
                    style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}
                    onClick={() => router.push(`/products/${p.id}`)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formatImageUrl(p.image_url)} alt={p.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-[#11131B]" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-[#8D93A5] mb-1">{p.category_name}</p>
                          <p className="text-sm font-semibold text-white">{p.name}</p>
                          <StarRating rating={p.rating} count={p.reviews_count} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">${p.price}</span>
                          <button
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: GRADIENT_BTN }}
                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                          >
                            <Plus size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen" />}>
      <ProductsContent />
    </Suspense>
  );
}
