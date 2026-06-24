"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export type Role = "BUSINESS" | "BANK" | "ADMIN";

export interface User {
  id: number;
  email: string;
  role: Role;
  is_verified: boolean;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, redirectUrl?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Protect routes based on role
  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/", "/login", "/register", "/invest"];
    if (!user && !publicPaths.includes(pathname)) {
      // router.push("/login"); // Commenting out strict protection while building pages
    } else if (user) {
      if ((pathname === "/login" || pathname === "/register")) {
        if (user.role === "BUSINESS") router.push("/dashboard/business");
        else if (user.role === "BANK") router.push("/dashboard/bank");
        else if (user.role === "ADMIN") router.push("/dashboard/admin");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (token: string, redirectUrl?: string) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await fetchUser();
    
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      // Automatically redirect based on newly fetched user
      const currentUser = await api.get("/auth/me");
      if (currentUser.data.role === "BUSINESS") router.push("/dashboard/business");
      else if (currentUser.data.role === "BANK") router.push("/dashboard/bank");
      else if (currentUser.data.role === "ADMIN") router.push("/dashboard/admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    queryClient.clear();
    router.push("/login");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
