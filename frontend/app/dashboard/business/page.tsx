"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, LayoutDashboard, Settings, User, Loader2, Building2, 
  Landmark, BadgeDollarSign, HeartPulse, Activity, Bell, FileText,
  Search, ArrowRight, Zap, Target, AlertCircle, TrendingUp,
  CheckCircle2, Clock, UploadCloud, ChevronRight, Check
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { BusinessService } from "@/services/business.service";
import { Button } from "@/components/ui/button";

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

// Reusable Components
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
    {children}
  </div>
);

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="h-full flex flex-col"
  >
    {children}
  </motion.div>
);

const CardTransition = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className={className}
  >
    {children}
  </motion.div>
);

// Gauge Component
const CircularProgress = ({ value, label }: { value: number, label: string }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 80 ? "text-emerald-500" : value > 50 ? "text-blue-500" : "text-amber-500";
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle className="text-muted stroke-current" strokeWidth="8" cx="64" cy="64" r="45" fill="transparent" />
        <motion.circle 
          className={`${color} stroke-current drop-shadow-md`} 
          strokeWidth="8" 
          strokeLinecap="round" 
          cx="64" cy="64" r="45" fill="transparent" 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
    </div>
  );
};

export default function BusinessDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BusinessService.getDashboard().then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      if (err.response?.status === 404) {
        window.location.href = "/borrow";
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const revenue = data?.annual_revenue || 0;
  const profit = data?.annual_net_profit || 0;

  // Mock historical data for charts
  const financialHistory = [
    { month: 'Jan', revenue: revenue * 0.06, profit: profit * 0.05 },
    { month: 'Feb', revenue: revenue * 0.07, profit: profit * 0.06 },
    { month: 'Mar', revenue: revenue * 0.08, profit: profit * 0.08 },
    { month: 'Apr', revenue: revenue * 0.085, profit: profit * 0.09 },
    { month: 'May', revenue: revenue * 0.09, profit: profit * 0.095 },
    { month: 'Jun', revenue: revenue * 0.10, profit: profit * 0.11 },
  ];

  const matchedBanks = [
    { name: "Global Finance", match: 94, rate: "5.5%", prob: "High" },
    { name: "First National", match: 88, rate: "6.2%", prob: "High" },
    { name: "Apex Credit", match: 76, rate: "7.0%", prob: "Medium" }
  ];

  const timelineSteps = [
    { label: "Profile Created", status: "completed", date: "Today" },
    { label: "AI Analysis", status: "completed", date: "Today" },
    { label: "Bank Matching", status: "active", date: "In Progress" },
    { label: "Documents Review", status: "pending", date: "Pending" },
    { label: "Funding Offers", status: "pending", date: "Pending" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
if (hour < 12) return "Capitalise the day";
if (hour < 17) return "Markets are moving";
if (hour < 21) return "Securing the bag";
return "Dividends sleep, you should too";

  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Sidebar - Vercel/Linear minimal style */}
      <aside className="w-64 border-r border-border/40 bg-card/10 backdrop-blur-2xl flex-col hidden md:flex shrink-0">
        {/* <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">FundBridge</span>
          </div>
        </div> */}
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-3">
            <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Overview</div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                <FileText className="w-4 h-4" /> Applications
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                <Landmark className="w-4 h-4" /> Matches
              </a>
            </nav>
          </div>

          <div className="px-3">
            <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</div>
            <nav className="space-y-1">
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left">
                <User className="w-4 h-4" /> Edit Profile
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left">
                <UploadCloud className="w-4 h-4" /> Upload Documents
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left">
                <CheckCircle2 className="w-4 h-4" /> Check Eligibility
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left">
                <Landmark className="w-4 h-4" /> View Matches
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left">
                <FileText className="w-4 h-4" /> Generate AI Report
              </button>
            </nav>
          </div>
        </div>

      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <header className="h-16 border-b border-border/40 flex items-center px-8 justify-between shrink-0 bg-background/50 backdrop-blur-xl z-10">
          <div className="flex flex-col">
             <h1 className="text-sm font-medium text-muted-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 z-0">
          <PageTransition>
            
            {/* Top Row: Greeting */}
            <div className="mb-10">
              <h2 className="text-3xl font-semibold tracking-tight mb-2">{getGreeting()}, {data?.company_name}</h2>
              <p className="text-muted-foreground">Here&apos;s your latest funding readiness overview and AI insights.</p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <CardTransition delay={0.1}>
                <Card className="p-6 h-full flex flex-col justify-between group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" /> +2%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Profile Completion</p>
                    <h3 className="text-3xl font-semibold">{data?.profile_completion || 100}%</h3>
                  </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.2}>
                <Card className="p-6 h-full flex flex-col justify-between group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Readiness Score</p>
                    <h3 className="text-3xl font-semibold">{data?.readiness_score || 0}/100</h3>
                  </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.3}>
                <Card className="p-6 h-full flex flex-col justify-between group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      <Landmark className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Funding Required</p>
                    <h3 className="text-3xl font-semibold">{formatCurrency(data?.funding_goal)}</h3>
                  </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.4}>
                <Card className="p-6 h-full flex flex-col justify-between group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Eligible Banks</p>
                    <h3 className="text-3xl font-semibold">{matchedBanks.length}</h3>
                  </div>
                </Card>
              </CardTransition>
            </div>

            {/* Second Row: AI Insights & Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CardTransition delay={0.5} className="lg:col-span-2">
                <Card className="p-8 h-full bg-gradient-to-br from-card/40 to-primary/5 border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                       <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight">FundBridge AI Intelligence</h3>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className="text-muted-foreground leading-relaxed">
                      {data?.ai_summary || "Analyzing your financial data to find the best banking partners for your specific profile."}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mb-2">
                          <CheckCircle2 className="w-4 h-4" /> Key Strengths
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Solid credit score ({data?.business_credit_score})</li>
                          <li>• Positive cash flow</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 text-blue-500 text-sm font-medium mb-2">
                          <TrendingUp className="w-4 h-4" /> Next Steps
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Upload recent bank statements</li>
                          <li>• Review matched offers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.6}>
                <Card className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-8 w-full text-left">Overall Readiness</h3>
                  <CircularProgress value={data?.readiness_score || 0} label="Match Score" />
                  <p className="text-sm text-muted-foreground mt-8 px-4 leading-relaxed">
                    You are in the top 15% of applicants in the <strong className="text-foreground font-medium">{data?.industry}</strong> sector.
                  </p>
                </Card>
              </CardTransition>
            </div>

            {/* Third Row: Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CardTransition delay={0.7} className="lg:col-span-2">
                <Card className="p-6 h-full">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-medium text-muted-foreground">Revenue & Profit Trajectory</h3>
                     <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">Last 6 Months</span>
                   </div>
                   <div className="h-[250px] w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickFormatter={(value) => `$${value/1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'rgba(var(--background), 0.8)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid var(--border)' }}
                            itemStyle={{ color: 'var(--foreground)', fontSize: '14px' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                          <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.8}>
                <Card className="p-6 h-full">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Financial Summary</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Annual Revenue</span>
                        <span className="font-semibold">{formatCurrency(data?.annual_revenue)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Net Profit</span>
                        <span className="font-semibold text-emerald-500">{formatCurrency(data?.annual_net_profit)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Monthly Cash Flow</span>
                        <span className="font-semibold">{formatCurrency(data?.monthly_cash_flow)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Existing Debt</span>
                        <span className="font-semibold text-amber-500">{formatCurrency(data?.existing_debt)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </CardTransition>
            </div>

            {/* Application Timeline & Matched Banks Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
              {/* Timeline */}
              <CardTransition delay={0.9}>
                <Card className="p-6 h-full">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Application Tracker</h3>
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                    {timelineSteps.map((step, index) => (
                      <div key={index} className="relative flex items-center justify-between">
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background z-10 
                          ${step.status === 'completed' ? 'bg-blue-500' : step.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-muted'}" 
                          style={{ backgroundColor: step.status === 'completed' || step.status === 'active' ? '#3b82f6' : 'hsl(var(--muted))' }}
                        />
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>{step.label}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardTransition>

              {/* Matched Banks */}
              <CardTransition delay={1.0}>
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Pre-qualified Lender Matches</h3>
                    <button className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center">
                      View All <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {matchedBanks.map((bank, i) => (
                      <div key={i} className="group p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                            {bank.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{bank.name}</span>
                            <span className="text-xs text-emerald-500 font-medium">{bank.match}% Match</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-medium">{bank.rate}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Est. Rate</span>
                          </div>
                          <Button size="sm" variant="secondary" className="rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white group-hover:shadow-md transition-all">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardTransition>

            </div>

          </PageTransition>
        </div>
      </main>
    </div>
  );
}
