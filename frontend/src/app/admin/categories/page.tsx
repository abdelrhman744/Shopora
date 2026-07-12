"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";

const EMOJI_SUGGESTIONS = ["📦", "🎧", "⌚", "🖥️", "⌨️", "🔌", "🎮", "📱", "💻", "🔋", "📷", "🖱️"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.listCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIcon("📦");
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editing) {
        await api.updateCategory(editing.id, { name, icon });
      } else {
        await api.createCategory({ name, icon });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await api.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete category.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            <GradientText>Categories</GradientText>
          </h1>
          <p className="text-sm text-[#8D93A5]">{categories.length} categories</p>
        </div>
        <GradientBtn onClick={openCreate}>
          <span className="flex items-center gap-2"><Plus size={16} /> Add Category</span>
        </GradientBtn>
      </div>

      {error && !showForm && (
        <div className="p-3 rounded-xl text-sm text-red-400 mb-4" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
          {error}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-[#8D93A5] text-sm py-10 text-center">No categories yet.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-5 rounded-2xl flex items-center gap-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "#11131B" }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{cat.name}</p>
              <p className="text-xs text-[#8D93A5]">{cat.product_count} products</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8D93A5] hover:text-white hover:bg-white/5 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => setDeleteTarget(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8D93A5] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(9,10,18,0.8)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold">{editing ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#8D93A5] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#8D93A5] mb-1.5 block">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                  style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
              <div>
                <label className="text-xs text-[#8D93A5] mb-1.5 block">Icon</label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500 mb-2"
                  style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <div className="flex flex-wrap gap-2">
                  {EMOJI_SUGGESTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-white/5 transition-colors"
                      style={{ border: icon === e ? "1px solid #FF8A00" : "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-xl text-sm text-red-400" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                  {error}
                </div>
              )}
              <GradientBtn type="submit" className="w-full" disabled={saving}>
                <span className="flex items-center justify-center gap-2">
                  <Check size={16} /> {saving ? "Saving…" : "Save Category"}
                </span>
              </GradientBtn>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(9,10,18,0.8)" }}>
          <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-white font-bold mb-2">Delete category?</h3>
            <p className="text-sm text-[#8D93A5] mb-6">
              This will permanently delete &quot;{deleteTarget.name}&quot;. Categories with products assigned cannot be deleted.
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
