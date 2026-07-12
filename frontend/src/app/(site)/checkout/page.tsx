"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, MapPin, User as UserIcon, Package } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { formatImageUrl } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/checkout");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && cart.length === 0 && !placedOrder) {
      router.replace("/cart");
    }
  }, [authLoading, user, cart.length, placedOrder, router]);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !address || !city) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        full_name: fullName,
        email,
        address,
        city,
        items: cart.map((i) => ({ product_id: i.product.id, quantity: i.qty })),
      });
      setPlacedOrder(order);
      clearCart();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="pt-32 min-h-screen px-6 flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #FF8A00 0%, #FF2D95 60%, #8A2BE2 100%)" }}>
          <Check size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Order Confirmed!</h1>
        <p className="text-[#8D93A5] mb-6">
          Thank you, {placedOrder.full_name.split(" ")[0]}. Your order{" "}
          <GradientText className="font-semibold">{placedOrder.order_number}</GradientText> has been placed.
        </p>
        <div className="w-full p-6 rounded-2xl mb-8 text-left" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          {placedOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1.5">
              <span className="text-[#C9CBD6]">{item.product_name} × {item.quantity}</span>
              <span className="text-white">${(item.unit_price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-bold pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-white">Total</span>
            <span className="text-white">${placedOrder.total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={() => router.push("/dashboard")} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-colors hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            View Orders
          </button>
          <GradientBtn className="flex-1" onClick={() => router.push("/products")}>
            Continue Shopping
          </GradientBtn>
        </div>
      </div>
    );
  }

  if (authLoading || !user || cart.length === 0) {
    return <div className="pt-20 min-h-screen" />;
  }

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-6xl mx-auto">
      <button onClick={() => router.push("/cart")} className="flex items-center gap-2 text-sm text-[#8D93A5] hover:text-white transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Cart
      </button>
      <h1 className="text-4xl font-black text-white mb-8">
        <GradientText>Checkout</GradientText>
      </h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-white font-bold flex items-center gap-2"><UserIcon size={16} /> Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8D93A5] mb-1.5 block">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="text-xs text-[#8D93A5] mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-white font-bold flex items-center gap-2"><MapPin size={16} /> Shipping Address</h3>
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Street Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-orange-500" style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-white font-bold flex items-center gap-2 mb-2"><Package size={16} /> Payment</h3>
            <p className="text-sm text-[#8D93A5]">
              Cash on delivery / pay on pickup. Online payment is not available for this store.
            </p>
          </div>
          {error && (
            <div className="p-4 rounded-xl text-sm text-red-400" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
              {error}
            </div>
          )}
          <GradientBtn type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Placing Order…" : `Place Order — $${total.toLocaleString()}`}
          </GradientBtn>
        </form>
        <div className="p-6 rounded-2xl h-fit space-y-4" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-white font-bold mb-2">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map(({ product: p, qty }) => (
              <div key={p.id} className="flex gap-3 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formatImageUrl(p.image_url)} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-[#11131B]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{p.name}</p>
                  <p className="text-xs text-[#8D93A5]">Qty {qty}</p>
                </div>
                <span className="text-xs text-white font-semibold">${(p.price * qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["Subtotal", `$${subtotal.toLocaleString()}`], ["Shipping", shipping === 0 ? "Free" : `$${shipping}`], ["Tax (8%)", `$${tax}`]].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-[#8D93A5]">{l}</span>
                <span className="text-white">{v}</span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold pt-2">
              <span className="text-white">Total</span>
              <span className="text-white">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
