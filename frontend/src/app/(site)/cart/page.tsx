"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Minus, Plus, CreditCard, Gift } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { formatImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-8">
        Your <GradientText>Cart</GradientText>
      </h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: "#1A1C27" }}>
            <ShoppingCart size={36} className="text-[#8D93A5]" />
          </div>
          <p className="text-xl font-bold text-white mb-2">Your cart is empty</p>
          <p className="text-sm text-[#8D93A5] mb-8">Add some amazing products to get started.</p>
          <GradientBtn onClick={() => router.push("/products")}>Browse Products</GradientBtn>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product: p, qty }) => (
              <div key={p.id} className="flex gap-4 p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formatImageUrl(p.image_url)} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-[#11131B]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#8D93A5] mb-0.5">{p.category_name}</p>
                      <p className="text-sm font-semibold text-white leading-snug">{p.name}</p>
                    </div>
                    <button onClick={() => removeFromCart(p.id)} className="text-[#8D93A5] hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 text-[#8D93A5]">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-white text-sm font-semibold">{qty}</span>
                      <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 text-[#8D93A5]">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-white">${(p.price * qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-white font-bold mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {[
                  ["Subtotal", `$${subtotal.toLocaleString()}`],
                  ["Shipping", shipping === 0 ? "Free" : `$${shipping}`],
                  ["Tax (8%)", `$${tax}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#8D93A5]">{label}</span>
                    <span className={`text-white ${val === "Free" ? "text-emerald-400 font-semibold" : ""}`}>{val}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-white">Total</span>
                  <span className="text-white">${total.toLocaleString()}</span>
                </div>
              </div>
              <GradientBtn className="w-full" size="lg" onClick={handleCheckout}>
                <span className="flex items-center justify-center gap-2"><CreditCard size={16} /> Checkout</span>
              </GradientBtn>
              {subtotal < 99 && (
                <p className="text-xs text-center mt-3 text-[#8D93A5]">Add ${99 - subtotal} more for free shipping</p>
              )}
            </div>
            <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: "rgba(255,138,0,0.08)", border: "1px solid rgba(255,138,0,0.2)" }}>
              <Gift size={16} className="text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Have a promo code?</p>
                <input placeholder="Enter code" className="text-xs text-[#8D93A5] bg-transparent outline-none w-full mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
