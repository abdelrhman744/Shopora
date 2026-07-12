"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { formatImageUrl } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .listProducts({ search: search || undefined, page_size: 100, sort: "newest" })
      .then((res) => setProducts(res.items))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteProduct(deleteTarget.id);
      setProducts((p) => p.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            <GradientText>Products</GradientText>
          </h1>
          <p className="text-sm text-[#8D93A5]">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new">
          <GradientBtn>
            <span className="flex items-center gap-2"><Plus size={16} /> Add Product</span>
          </GradientBtn>
        </Link>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D93A5]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500"
          style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm text-red-400 mb-4" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
          {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Product", "Category", "Price", "Stock", "Rating", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-[#8D93A5] uppercase tracking-wider px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-[#8D93A5]">
                  No products found.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formatImageUrl(p.image_url)} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-[#11131B]" />
                    <span className="text-white font-medium line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#C9CBD6]">{p.category_name}</td>
                <td className="px-5 py-3 text-white font-semibold">${p.price}</td>
                <td className="px-5 py-3">
                  <span className={p.stock_quantity === 0 ? "text-red-400" : p.stock_quantity < 10 ? "text-amber-400" : "text-[#C9CBD6]"}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#C9CBD6]">{p.rating} ★</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/products/${p.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8D93A5] hover:text-white hover:bg-white/5 transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8D93A5] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(9,10,18,0.8)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(248,113,113,0.1)" }}>
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold mb-2">Delete product?</h3>
            <p className="text-sm text-[#8D93A5] mb-6">
              This will permanently delete &quot;{deleteTarget.name}&quot;. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
