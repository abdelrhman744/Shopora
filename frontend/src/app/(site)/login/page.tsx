"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import GradientText from "@/components/GradientText";
import GradientBtn from "@/components/GradientBtn";
import { GRADIENT_BTN } from "@/lib/theme";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const next = searchParams.get("next");
      router.push(user.is_admin ? "/admin" : next || "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #FF8A00, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #8A2BE2, transparent)" }} />
      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: GRADIENT_BTN }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-black text-white">NEXUS<GradientText>.io</GradientText></span>
        </Link>
        <div className="p-8 rounded-3xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-sm text-[#8D93A5] mb-8">Sign in to continue shopping</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D93A5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500"
                  style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#8D93A5] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D93A5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-[#8D93A5] outline-none focus:ring-1 focus:ring-orange-500"
                  style={{ background: "#11131B", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8D93A5]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-xl text-sm text-red-400" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                {error}
              </div>
            )}
            <GradientBtn type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Signing In…" : "Sign In"}
            </GradientBtn>
          </form>
          <p className="text-center text-sm text-[#8D93A5] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "#FF8A00" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent />
    </Suspense>
  );
}
