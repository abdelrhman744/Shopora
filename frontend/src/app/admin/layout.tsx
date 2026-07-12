"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Package, Tags, LogOut, ShieldCheck } from "lucide-react";
import GradientText from "@/components/GradientText";
import { GRADIENT_BTN } from "@/lib/theme";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Products", href: "/admin", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user || !user.is_admin) {
    return <div style={{ background: "#090A12", minHeight: "100vh" }} />;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#090A12", fontFamily: "'Manrope', 'Poppins', sans-serif" }}>
      <aside
        className="w-64 flex-shrink-0 flex flex-col p-5"
        style={{ background: "#11131B", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/admin" className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GRADIENT_BTN }}>
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="text-base font-black text-white">
            NEXUS<GradientText>.io</GradientText>
          </span>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: active ? "#fff" : "#8D93A5",
                  background: active ? "linear-gradient(135deg, rgba(255,138,0,0.15), rgba(138,43,226,0.15))" : "transparent",
                }}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="px-4 py-1 text-xs text-[#8D93A5] truncate">{user.email}</p>
          <button
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8D93A5] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <LogOut size={16} /> Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8D93A5] hover:text-white hover:bg-white/5 transition-colors"
          >
            <LayoutGrid size={16} /> View Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
