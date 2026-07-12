"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Play, ChevronDown, ChevronRight, Flame, Truck, Shield,
  Package, Award, TrendingUp, Mail, Check,
} from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { GRADIENT_BTN, GRADIENT_CARD } from "@/lib/theme";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product, Category } from "@/lib/types";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Tech Reviewer, TechRadar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    text: "The Aurora X Pro completely transformed my work-from-home setup. The sound quality is absolutely stunning — worth every penny.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Professional Streamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    text: "I've tried dozens of gaming peripherals and nothing comes close to this quality. The Vortex mouse has become my daily driver.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "UX Designer, Google",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
    text: "My Nebula Watch tracks everything I need with stunning accuracy. The display is gorgeous and battery life is exceptional.",
    rating: 5,
  },
];

const BRANDS = ["Sony", "Apple", "Samsung", "Logitech", "Razer", "Bose", "HyperX", "Corsair"];
const CATEGORY_COLORS = [
  "from-orange-500 to-pink-600",
  "from-pink-500 to-purple-600",
  "from-purple-600 to-violet-700",
  "from-violet-600 to-indigo-700",
  "from-orange-400 to-red-500",
  "from-rose-500 to-pink-600",
];

export default function HomePage() {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const saleTime = { h: 5, m: 42, s: 17 };

  useEffect(() => {
    api.listProducts({ sort: "popular", page_size: 8 }).then((res) => setProducts(res.items));
    api.listCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden px-6 lg:px-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #FF8A00, transparent)" }} />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #8A2BE2, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(circle, #FF2D95, transparent)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "rgba(255,138,0,0.15)", border: "1px solid rgba(255,138,0,0.3)", color: "#FF8A00" }}>
              <Flame size={12} /> New Collection 2026 — Limited Edition
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-white">Next-Gen</span><br />
              <GradientText>Tech That</GradientText><br />
              <span className="text-white">Elevates You</span>
            </h1>
            <p className="text-[#8D93A5] text-lg leading-relaxed max-w-xl">
              Discover premium electronics curated for creators, gamers, and innovators. Experience the future of technology with our exclusive collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <GradientBtn size="lg">
                  <span className="flex items-center gap-2">Shop Now <ArrowRight size={16} /></span>
                </GradientBtn>
              </Link>
              <button className="px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center gap-2 transition-all hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                <Play size={16} /> Watch Demo
              </button>
            </div>
            <div className="flex gap-8 pt-4">
              {[["50K+", "Happy Customers"], ["200+", "Premium Brands"], ["4.9★", "Average Rating"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-xs text-[#8D93A5]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30" style={{ background: GRADIENT_BTN }} />
              <div className="relative rounded-3xl overflow-hidden" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format" alt="Premium Headphones" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(9,10,18,0.95), transparent)" }}>
                  <p className="text-white font-bold">Aurora X Pro</p>
                  <p className="text-xs text-[#8D93A5]">Premium Headphones</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl backdrop-blur-xl" style={{ background: "rgba(26,28,39,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xs text-[#8D93A5]">Today&apos;s Sales</div>
                <div className="text-lg font-black text-white">$24,831</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> +18.2%</div>
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl backdrop-blur-xl" style={{ background: "rgba(26,28,39,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format" alt="" />
                  </div>
                  <div>
                    <div className="text-xs text-white font-semibold">Sarah just bought</div>
                    <div className="text-xs text-[#8D93A5]">Aurora X Pro</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown size={20} className="text-[#8D93A5]" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="px-6 lg:px-12 py-8" style={{ background: "#11131B", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={20} />, title: "Free Shipping", sub: "On orders over $99" },
            { icon: <Shield size={20} />, title: "2 Year Warranty", sub: "Full coverage" },
            { icon: <Package size={20} />, title: "Easy Returns", sub: "30-day hassle-free" },
            { icon: <Award size={20} />, title: "Certified Premium", sub: "Quality guaranteed" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,138,0,0.1)", color: "#FF8A00" }}>{icon}</div>
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-[#8D93A5]">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#FF8A00" }}>Browse</p>
            <h2 className="text-4xl font-black text-white">Shop by <GradientText>Category</GradientText></h2>
          </div>
          <Link href="/products" className="text-sm text-[#8D93A5] hover:text-white flex items-center gap-1 transition-colors">View all <ChevronRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-5 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110`}>{cat.icon}</div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-[#8D93A5]">{cat.product_count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="px-6 lg:px-12 py-16 mx-6 lg:mx-12 rounded-3xl mb-8" style={{ background: "linear-gradient(135deg, rgba(255,138,0,0.12), rgba(255,45,149,0.12), rgba(138,43,226,0.12))", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-400" />
                <p className="text-sm font-bold uppercase tracking-widest text-orange-400">Flash Sale</p>
              </div>
              <h2 className="text-3xl font-black text-white">Limited Time <GradientText>Deals</GradientText></h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-[#8D93A5]">Ends in:</p>
              {[saleTime.h, saleTime.m, saleTime.s].map((val, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white" style={{ background: "#1A1C27" }}>{String(val).padStart(2, "0")}</div>
                  {i < 2 && <span className="text-white font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#FF2D95" }}>Trending</p>
            <h2 className="text-4xl font-black text-white">Top <GradientText>Picks</GradientText></h2>
          </div>
          <Link href="/products" className="text-sm text-[#8D93A5] hover:text-white flex items-center gap-1 transition-colors">See all <ChevronRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(4).map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 lg:px-12 py-20" style={{ background: "#11131B" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8A2BE2" }}>Reviews</p>
            <h2 className="text-4xl font-black text-white">Loved by <GradientText>Thousands</GradientText></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
                <StarRating rating={t.rating} />
                <p className="text-[#C9CBD6] text-sm leading-relaxed my-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#8D93A5]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-10 text-[#8D93A5]">Trusted by 200+ Premium Brands</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {BRANDS.map((b) => (
            <div key={b} className="px-6 py-3 rounded-2xl text-sm font-bold text-[#8D93A5] hover:text-white transition-colors" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>{b}</div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 lg:px-12 py-20 mx-6 lg:mx-12 rounded-3xl mb-16" style={{ background: GRADIENT_CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: GRADIENT_BTN }}>
            <Mail size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Stay in the <GradientText>Loop</GradientText></h2>
          <p className="text-[#8D93A5] mb-8">Get exclusive deals, early access to new products, and tech news delivered to your inbox.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold"><Check size={20} /> You&apos;re subscribed!</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-3 max-w-md mx-auto">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500" style={{ background: "rgba(26,28,39,0.8)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <GradientBtn type="submit">Subscribe</GradientBtn>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
