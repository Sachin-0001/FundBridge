"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, Building2, Landmark, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["BUSINESS", "BANK"]),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: typeParam === "bank" ? "BANK" : "BUSINESS",
    },
  });

  const selectedRole = watch("role");
  const agreeTerms = watch("agreeTerms");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      // Register
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // Automatically login
      const loginRes = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      await login(loginRes.data.access_token, data.role === "BUSINESS" ? "/borrow" : "/invest");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during registration");
      setIsLoading(false);
    }
  };

  const isBusiness = selectedRole === "BUSINESS";

  return (
    <>
      {/* Background gradients that adapt to role */}
      <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${isBusiness ? "bg-blue-500/15" : "bg-emerald-500/15"}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${isBusiness ? "bg-indigo-500/15" : "bg-teal-500/15"}`} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-700 ${isBusiness ? "from-blue-500 to-cyan-500" : "from-emerald-500 to-green-500"}`} />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Create an account</h1>
            <p className="text-muted-foreground text-sm">Join FundBridge to {isBusiness ? "find funding" : "deploy capital"}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setValue("role", "BUSINESS")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  isBusiness 
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-500" 
                    : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Business
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "BANK")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  !isBusiness 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                    : "bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Landmark className="w-4 h-4" />
                Bank
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${isBusiness ? "focus:ring-blue-500/50" : "focus:ring-emerald-500/50"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${isBusiness ? "focus:ring-blue-500/50" : "focus:ring-emerald-500/50"}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${isBusiness ? "focus:ring-blue-500/50" : "focus:ring-emerald-500/50"}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                {...register("agreeTerms")}
                className={`mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 focus:ring-2 focus:ring-offset-0 ${isBusiness ? "text-blue-500 focus:ring-blue-500/50" : "text-emerald-500 focus:ring-emerald-500/50"}`}
              />
              <div className="flex flex-col">
                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground select-none leading-relaxed">
                  I agree to the <Link href="/terms" className="cursor-pointer text-foreground hover:underline">Terms of Service</Link> and have read the <Link href="/privacy" className="cursor-pointer text-foreground hover:underline">Privacy Policy</Link>.
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="cursor-pointer w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="cursor-pointer text-foreground font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
