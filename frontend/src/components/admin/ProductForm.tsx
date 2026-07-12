"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ChevronLeft } from "lucide-react";
import GradientBtn from "@/components/GradientBtn";
import { formatImageUrl } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

const BADGE_OPTIONS = ["", "New", "Best Seller", "Sale", "Hot", "Popular", "Top Pick", "Deal", "Trending"];

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(product?.original_price?.toString() || "");
  const [categoryId, setCategoryId] = useState<string>(product?.category_id?.toString() || "");
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity?.toString() || "0");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [badge, setBadge] = useState(product?.badge || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.listCategories().then((cats) => {
      setCategories(cats);
      if (!isEdit && cats.length > 0 && !categoryId) setCategoryId(cats[0].id.toString());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await api.uploadImage(file);
      setImageUrl(res.image_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const payload = {
      name,
      description,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      category_id: parseInt(categoryId, 10),
      stock_quantity: parseInt(stockQuantity, 10) || 0,
      image_url: imageUrl,
      badge,
    };

    setSubmitting(true);
    try {
      if (isEdit && product) {
        await api.updateProduct(product.id, payload);
      } else {
        await api.createProduct(payload);
      }
      router.push("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fields) {
          const fe: Record<string, string> = {};
          err.fields.forEach((f) => (fe[f.field] = f.message));
          setFieldErrors(fe);
        }
      } else {
        setError("Could not save product. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.push("/admin")} className="flex items-center gap-2 text-sm text-[#8D93A5] hover:text-white transition-colors mb-6">
        <ChevronLeft size={16} /> Back to Products
      </button>
      <h1 className="text-3xl font-black text-white mb-8">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-white font-bold text-sm">Product Image</h3>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formatImageUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-[#8D93A5]" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {uploading ? "Uploading…" : "Upload Image"}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8D93A5] hover:text-red-400 transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste an image URL"
                className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-[#8D93A5] outline-none"
                style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-white font-bold text-sm">Details</h3>
          <div>
            <label className="text-xs text-[#8D93A5] mb-1.5 block">Product Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
              style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-[#8D93A5] mb-1.5 block">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none focus:ring-1 focus:ring-orange-500"
              style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="text-xs text-[#8D93A5] mb-1.5 block">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8D93A5] mb-1.5 block">Badge (optional)</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {BADGE_OPTIONS.map((b) => (
                <option key={b} value={b}>{b || "None"}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 rounded-2xl space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-white font-bold text-sm">Pricing &amp; Stock</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {fieldErrors.price && <p className="text-xs text-red-400 mt-1">{fieldErrors.price}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500"
                style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Stock Quantity</label>
              <input
                required
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {fieldErrors.stock_quantity && <p className="text-xs text-red-400 mt-1">{fieldErrors.stock_quantity}</p>}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm text-red-400" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Cancel
          </button>
          <GradientBtn type="submit" disabled={submitting || uploading}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </GradientBtn>
        </div>
      </form>
    </div>
  );
}
