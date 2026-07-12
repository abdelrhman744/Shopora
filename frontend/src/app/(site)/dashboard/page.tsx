"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, MapPin, Mail, Calendar } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  Processing: "text-amber-400 bg-amber-400/10",
  Shipped: "text-blue-400 bg-blue-400/10",
  Delivered: "text-emerald-400 bg-emerald-400/10",
  Cancelled: "text-red-400 bg-red-400/10",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      api.listMyOrders().then((res) => {
        setOrders(res);
        setLoading(false);
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="pt-20 min-h-screen" />;
  }

  return (
    <div className="pt-20 min-h-screen px-6 lg:px-12 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">
          My <GradientText>Dashboard</GradientText>
        </h1>
        <p className="text-[#8D93A5]">Welcome back, {user.name.split(" ")[0]}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-[#8D93A5] mb-1">Total Orders</p>
          <p className="text-2xl font-black text-white">{orders.length}</p>
        </div>
        <div className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-[#8D93A5] mb-1">Total Spent</p>
          <p className="text-2xl font-black text-white">
            ${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-[#8D93A5] mb-1">Account Email</p>
          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
      {!loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Package size={32} className="text-[#8D93A5] mb-4" />
          <p className="text-white font-semibold mb-2">No orders yet</p>
          <p className="text-sm text-[#8D93A5] mb-6">Your order history will appear here.</p>
          <GradientBtn onClick={() => router.push("/products")}>Start Shopping</GradientBtn>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 rounded-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-bold text-white">{order.order_number}</p>
                  <p className="text-xs text-[#8D93A5] flex items-center gap-1 mt-0.5">
                    <Calendar size={11} /> {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status] || "text-[#8D93A5] bg-white/5"}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-1.5 mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem" }}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#C9CBD6]">{item.product_name} × {item.quantity}</span>
                    <span className="text-white">${(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs text-[#8D93A5] flex items-center gap-1">
                  <MapPin size={11} /> {order.address}, {order.city}
                </p>
                <p className="text-base font-bold text-white">${order.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
