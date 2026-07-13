"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, Menu, X, Zap, User, LogOut, LayoutDashboard } from "lucide-react";
import GradientText from "./GradientText";
import GradientBtn from "./GradientBtn";
import { GRADIENT_BTN } from "@/lib/theme";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 backdrop-blur-xl"
      style={{ background: "rgba(9,10,18,0.85)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GRADIENT_BTN }}>
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-lg font-black text-white tracking-tight">
          SHOPORA
          <GradientText>.io</GradientText>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm font-medium transition-colors ${
              isActive(l.href) ? "text-white" : "text-[#8D93A5] hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/products"
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white"
        >
          <Search size={18} />
        </Link>
        <Link
          href="/wishlist"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white"
        >
          <Heart size={18} />
          {wishlist.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: GRADIENT_BTN }}
            >
              {wishlist.length}
            </span>
          )}
        </Link>
        <Link
          href="/cart"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: GRADIENT_BTN }}
            >
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-[#8D93A5] hover:text-white"
            >
              <User size={18} />
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl p-2 backdrop-blur-xl"
                style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="px-3 py-2 text-xs text-[#8D93A5] truncate">{user.email}</p>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#C9CBD6] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#C9CBD6] hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <GradientBtn size="sm" onClick={() => router.push("/login")}>
            Sign In
          </GradientBtn>
        )}
      </div>
      <button className="md:hidden text-[#8D93A5]" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 flex flex-col gap-2 p-4"
          style={{ background: "#11131B", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-left text-sm py-2 text-[#C9CBD6] font-medium"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative flex items-center gap-2 text-sm text-[#8D93A5]"
            >
              <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-sm text-[#8D93A5]"
              >
                Sign Out
              </button>
            ) : (
              <GradientBtn
                size="sm"
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </GradientBtn>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}