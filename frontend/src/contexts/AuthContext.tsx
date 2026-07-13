"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("shopora_user");
    const token = localStorage.getItem("shopora_token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("shopora_user");
        localStorage.removeItem("shopora_token");
      }
    }
    setLoading(false);
  }, []);

  const persist = (u: User, token: string) => {
    localStorage.setItem("shopora_token", token);
    localStorage.setItem("shopora_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    persist(res.user, res.access_token);
    return res.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register({ name, email, password });
    persist(res.user, res.access_token);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("shopora_token");
    localStorage.removeItem("shopora_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
