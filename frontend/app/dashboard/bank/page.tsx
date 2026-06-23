/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Building, LayoutDashboard, Settings, Users, Loader2, 
  Target, Briefcase, MapPin, BadgeDollarSign, 
  Activity, Percent, Search, HeartPulse, ChevronRight
} from "lucide-react";
import { BankService } from "@/services/bank.service";
import { useAuth } from "@/contexts/AuthContext";

export default function BankDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    BankService.getDashboard().then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      if (err.response?.status === 404) {
        window.location.href = "/invest";
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Greeting logic
  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good Morning"
      : hour >= 12 && hour < 17
    ? "Good Afternoon"
    : hour >= 17 && hour < 21
    ? "Good Evening"
    : "Welcome";

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return "$0";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto">
        {/* <div className="h-20 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Partner Hub</span>
          </div>
        </div> */}
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Overview</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors group">
            <Users className="h-4 w-4 group-hover:text-foreground transition-colors" /> Deal Flow <span className="ml-auto bg-emerald-500/20 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full">New</span>
          </a>
          
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-8 px-3">Settings</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors group">
            <Target className="h-4 w-4 group-hover:text-foreground transition-colors" /> Rules Engine
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors group">
            <Settings className="h-4 w-4 group-hover:text-foreground transition-colors" /> Preferences
          </a>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-8 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-700 flex items-center justify-center text-emerald-100 font-bold border border-emerald-500/30">
              {data?.institution_name?.substring(0, 2).toUpperCase() || "GF"}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{data?.institution_type}</p>
              <h1 className="text-sm font-semibold">{data?.institution_name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors border border-border/50">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors border border-border/50">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </header> */}
        
        <div className="p-8 space-y-8 flex-1 overflow-y-auto z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl font-bold tracking-tight">{greeting}, <span className="text-emerald-500">{data?.institution_name?.split(" ")[0]}</span></h1>
            <p className="text-muted-foreground mt-1">Here's the latest overview of your lending pipeline and matching criteria.</p>
          </motion.div>

          {/* Top KPI Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Loan Range</p>
              <h3 className="text-xl font-bold mt-1">
                {formatCurrency(data?.min_loan_amount)} - {formatCurrency(data?.max_loan_amount)}
              </h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Percent className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Interest Rate Range</p>
              <h3 className="text-xl font-bold mt-1">
                {data?.min_interest_rate || 0}% - {data?.max_interest_rate || 0}%
              </h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Min. AI Score</p>
              <h3 className="text-2xl font-bold mt-1">{data?.requirements?.min_readiness_score || "N/A"}</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Eligible Businesses</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-500">1,204</h3>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Configuration Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-emerald-500" /> Eligibility Rules Engine
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum Revenue</p>
                    <p className="text-lg font-medium">{formatCurrency(data?.requirements?.min_revenue)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Max Debt-to-Revenue</p>
                    <p className="text-lg font-medium">{data?.requirements?.max_debt_to_revenue_ratio || 0}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Min Years in Business</p>
                    <p className="text-lg font-medium">{data?.requirements?.min_years_in_business || 0} Years</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">GST Registration Required</p>
                    <p className="text-lg font-medium">{data?.requirements?.gst_registered_only ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-emerald-500" /> Lending Products & Preferences
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Products Offered</p>
                    <div className="flex flex-wrap gap-2">
                      {data?.loan_products?.map((prod: string) => (
                        <span key={prod} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Locations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data?.requirements?.preferred_locations?.map((loc: string) => (
                          <span key={loc} className="px-3 py-1 bg-muted/50 border border-border/50 rounded-lg text-sm">
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4" /> Industries
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data?.requirements?.preferred_industries?.map((ind: string) => (
                          <span key={ind} className="px-3 py-1 bg-muted/50 border border-border/50 rounded-lg text-sm">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column: Active Applications */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live Deal Flow</h2>
                <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">View All</button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "TechNova Solutions", type: "Working Capital", amount: "$250k", match: 98 },
                  { name: "Atlas Manufacturing", type: "Equipment Financing", amount: "$1.2M", match: 94 },
                  { name: "Zenith Retail", type: "Line of Credit", amount: "$500k", match: 91 },
                  { name: "Lumina Health", type: "Business Expansion", amount: "$2M", match: 88 },
                ].map((deal, i) => (
                  <div key={i} className="p-4 bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">{deal.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{deal.type} • {deal.amount}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-500">{deal.match}%</span>
                        <p className="text-[10px] text-muted-foreground uppercase">Match</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-semibold mb-1">Expand Your Reach</h3>
                <p className="text-sm text-emerald-100/70 mb-4">Adjust your rules engine to match with 450+ more businesses currently seeking capital.</p>
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Tune Rules Engine
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
