"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Building2, Landmark } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy"
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const agreeTerms = watch("agreeTerms");

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      await login(response.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />



      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your FundBridge account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-start gap-3"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-border/50 bg-background/50 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                {...register("agreeTerms")}
                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
              />
              <div className="flex flex-col">
                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground select-none leading-relaxed">
                  I agree to the <Link href="/terms" className="text-foreground hover:underline">Terms of Service</Link> and have read the <Link href="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground mb-4">Don&apos;t have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/register?type=business"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                <Building2 className="w-4 h-4 text-blue-500" />
                Business
              </Link>
              <Link
                href="/register?type=bank"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                <Landmark className="w-4 h-4 text-indigo-500" />
                Bank
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
