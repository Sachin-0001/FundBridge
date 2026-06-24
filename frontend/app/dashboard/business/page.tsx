"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, User, Loader2, Building2, 
  Landmark, HeartPulse, Bell, FileText,
  Search, Zap, Target, TrendingUp,
  CheckCircle2, UploadCloud, ChevronRight, Check,
  Activity, ArrowRight, Percent, Shield, DollarSign,
  X, Briefcase, CreditCard, ChevronDown, Award, Send, MessageSquare, Settings, Save
} from "lucide-react";

import { BusinessService, FundingPurpose, LoanType } from "@/services/business.service";
import { applicationService } from "@/services/application.service";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from 'react-markdown';

const formatCurrency = (val: number | undefined) => {
  if (val === undefined || val === null) return "$0";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

// Reusable Components
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#121212] border border-zinc-800/80 rounded-2xl shadow-sm hover:border-zinc-700 transition-colors overflow-hidden ${className}`}>
    {children}
  </div>
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
    className={className}
  >
    {children}
  </motion.div>
);

const CircularProgress = ({ value, label }: { value: number, label: string }) => {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 80 ? "text-blue-500" : value > 50 ? "text-blue-500" : "text-amber-500";
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle className="text-zinc-800 stroke-current" strokeWidth="6" cx="48" cy="48" r="36" fill="transparent" />
        <motion.circle 
          className={`${color} stroke-current drop-shadow-md`} 
          strokeWidth="6" 
          strokeLinecap="round" 
          cx="48" cy="48" r="36" fill="transparent" 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-zinc-100">{value}</span>
        <span className="text-[10px] text-zinc-500 font-medium">/ 100</span>
      </div>
    </div>
  );
};

export default function BusinessDashboard() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBank, setSelectedBank] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const newMessage = { role: "user", content: chatInput };
    const history = [...chatMessages];
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);
    
    try {
      const response = await BusinessService.sendChatMessage(newMessage.content, history);
      setChatMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const { data: dashboardRes, isLoading: loadingDash } = useQuery({
    queryKey: ['businessDashboard'],
    queryFn: () => BusinessService.getDashboard()
  });

  const { data: matchesRes, isLoading: loadingMatches } = useQuery({
    queryKey: ['businessMatches'],
    queryFn: () => BusinessService.getMatches()
  });

  const { data: appsRes } = useQuery({
    queryKey: ['businessApplications'],
    queryFn: () => applicationService.getBusinessApplications()
  });

  const data = dashboardRes?.data;
  const matches = (matchesRes?.data || []).filter((m: any) => m.compatibility_score > 75);
  const applications = appsRes || [];
  
  const loading = loadingDash || loadingMatches;

  useEffect(() => {
    if (data && !editFormData) {
      setEditFormData(data);
    }
  }, [data]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await BusinessService.register(editFormData);
      await queryClient.invalidateQueries({ queryKey: ['businessDashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['businessMatches'] });
      await refreshUser(); // Update AuthContext so navbar reflects new profile name
      setActiveTab('overview');
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleApply = async (bankId: number) => {
    // Optimistic UI update
    const bank = matches.find((m: any) => m.bank_id === bankId)?.bank;
    const optimisticApp = {
      id: Math.random(),
      bank_id: bankId,
      amount_requested: data?.funding_goal || 0,
      purpose: data?.funding_purpose || "Working Capital",
      status: "pending",
      created_at: new Date().toISOString(),
      bank: bank
    };
    queryClient.setQueryData(['businessApplications'], (oldData: any) => {
      return [...(oldData || []), optimisticApp];
    });

    try {
      await applicationService.createApplication({
        bank_id: bankId,
        amount_requested: data?.funding_goal || 0,
        purpose: data?.funding_purpose || "Working Capital"
      });
      await queryClient.invalidateQueries({ queryKey: ['businessApplications'] });
    } catch (e) {
      console.error("Failed to apply", e);
      await queryClient.invalidateQueries({ queryKey: ['businessApplications'] });
    }
  };

  const handleWithdraw = async (appId: number) => {
    // Optimistic UI update
    queryClient.setQueryData(['businessApplications'], (oldData: any) => {
      return (oldData || []).map((app: any) => app.id === appId ? { ...app, status: 'withdrawn' } : app);
    });

    try {
      await applicationService.withdrawApplication(appId);
      await queryClient.invalidateQueries({ queryKey: ['businessApplications'] });
    } catch (e) {
      console.error("Failed to withdraw", e);
      await queryClient.invalidateQueries({ queryKey: ['businessApplications'] });
    }
  };

  const hasApplied = (bankId: number) => {
    return applications.some((app: any) => app.bank_id === bankId && app.status !== 'rejected' && app.status !== 'withdrawn');
  };

  useEffect(() => {
    setAiReport(data?.ai_report || "");
  }, [data?.id, data?.ai_report]);

  const handleGenerateReport = async () => {
    setActiveTab('ai_report');
    if (data?.ai_report) {
      setAiReport(data.ai_report);
      return;
    }
    
    setIsGeneratingReport(true);
    try {
      const response = await BusinessService.generateAiReport();
      setAiReport(response.data.report);
      queryClient.invalidateQueries({ queryKey: ['businessDashboard'] });
    } catch (e) {
      console.error("Failed to generate report", e);
      setAiReport("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Welcome";
  };

  const currentDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  const revenue = data?.annual_revenue || 0;
  const profit = data?.annual_net_profit || 0;



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-zinc-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const sortedMatches = [...matches].sort((a, b) => b.compatibility_score - a.compatibility_score).slice(0, 5);
  const bestMatch = sortedMatches[0];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-zinc-100 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Sidebar - Vercel/Linear minimal style */}
      <aside className="w-[240px] border-r border-zinc-800/80 bg-[#0F0F0F] flex-col hidden md:flex shrink-0">
        <div className="p-6">
          {/* <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
              {data?.company_name?.substring(0, 2).toUpperCase() || "BZ"}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 truncate w-32">{data?.company_name}</h2>
              <p className="text-[11px] text-zinc-500">{data?.industry}</p>
            </div>
          </div> */}
          
          {/* <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1.5 uppercase font-medium">
              <span>Profile</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div> */}
        </div>
        
        <div className="px-3 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="text-[11px] font-medium text-zinc-500 mb-2 uppercase tracking-wider px-3">Workspace</div>
            <nav className="space-y-0.5">
              <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'overview' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                <LayoutDashboard className="w-4 h-4" /> Overview
              </button>
              <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'applications' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                <FileText className="w-4 h-4" /> Applications
              </button>
              <button onClick={() => setActiveTab('matches')} className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left flex justify-between ${activeTab === 'matches' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <Landmark className="w-4 h-4" /> Matched Lenders
                </div>
                {matches.length > 0 && <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{matches.length}</span>}
              </button>

            </nav>
          </div>

          <div>
            <div className="text-[11px] font-medium text-zinc-500 mb-2 uppercase tracking-wider px-3">Quick Actions</div>
            <nav className="space-y-0.5">
              <button onClick={() => setActiveTab('edit_profile')} className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'edit_profile' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                <User className="w-4 h-4" /> Edit Profile
              </button>
              <button onClick={() => setActiveTab('ai_report')} className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === 'ai_report' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                <Zap className="w-4 h-4" /> AI Report
              </button>
            </nav>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0A0A0A]">
        <header className="h-16 border-b border-zinc-800/80 flex items-center px-8 justify-between shrink-0 bg-[#0F0F0F]/80 backdrop-blur-md z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search lenders, applications..." 
              className="h-9 w-64 bg-[#121212] border border-zinc-800 rounded-lg pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-zinc-200 placeholder:text-zinc-600"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-zinc-400 hidden sm:block">{currentDate}</div>
            {/* <button className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors border border-blue-500/20">
              <Zap className="w-4 h-4" />
            </button> */}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 z-0">
          <div className="max-w-[1200px] mx-auto space-y-8 pb-10">
            
            {/* Top Row: Greeting */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{getGreeting()}, {data?.company_name?.split(" ")[0] || "Founder"}</h2>
              <p className="text-zinc-400 mt-1 text-sm">Here&apos;s your latest funding readiness overview and AI insights.</p>
            </motion.div>

            {/* First Row: Top KPI Cards */}
            {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CardTransition delay={0.1}>
                <Card className="p-5 h-full flex flex-row items-center gap-5 justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">AI Readiness</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-[10px] font-medium text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {/* <TrendingUp className="w-3 h-3 mr-1" /> +5 */}
                      </span>
                    </div>
                  </div>
                  <CircularProgress value={data?.readiness_score || 0} label="Score" />
                </Card>
              </CardTransition>

              <CardTransition delay={0.2}>
                <Card className="p-5 h-full flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Eligible Banks</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-semibold">{matches.length}</h3>
                    {bestMatch && <span className="text-[11px] text-zinc-500">Top Match: {bestMatch.compatibility_score}%</span>}
                  </div>
                </Card>
              </CardTransition>

              <CardTransition delay={0.3}>
                <Card className="p-5 h-full flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Landmark className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Funding Goal</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-semibold">{formatCurrency(data?.funding_goal)}</h3>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">{data?.loan_type}</span>
                </Card>
              </CardTransition>

              <CardTransition delay={0.4}>
                <Card className="p-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Shield className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Profile Status</p>
                    <h3 className="text-2xl font-semibold">{data?.profile_completion || 100}%</h3>
                  </div>
                  <button className="w-full mt-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs font-medium transition-colors">
                    Edit Profile
                  </button>
                </Card>
              </CardTransition>
            </div>
            )}

            {/* Second Row: AI Advisor & Breakdown */}
            {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* AI Advisor Centerpiece */}
              <CardTransition delay={0.5} className="lg:col-span-2">
                <div className="p-6 h-full rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a] border border-zinc-800/80">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 relative">
                      {/* <Zap className="w-5 h-5" /> */}
                      <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-200 uppercase">AI Funding Advisor</h3>
                  </div>
                  
                  <div className="space-y-4 relative z-10 text-sm">
                    <p className="text-zinc-300 leading-relaxed font-medium">
                      {data?.ai_business_advice || data?.ai_summary || "Analyzing your financial data to find the best banking partners for your specific profile."}
                    </p>
                    
                    {bestMatch && (
                      <p className="text-zinc-400 leading-relaxed">
                        Based on our engine, your strongest opportunity right now is <span className="text-zinc-200 font-medium">{bestMatch.bank?.institution_name}</span> with a <span className="text-blue-500 font-medium">{bestMatch.compatibility_score}%</span> match fit.
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      Want to know more, talk with our AI
                    </button>
                  </div>
                </div>
              </CardTransition>

              {/* Funding Readiness Breakdown */}
              <CardTransition delay={0.6}>
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-zinc-200">Readiness Breakdown</h3>
                    <span className="text-xl font-bold text-blue-500">{data?.readiness_score}</span>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {[
                      { label: "Revenue Strength", val: 85 },
                      { label: "Profitability", val: 90 },
                      { label: "Debt Health", val: data?.existing_debt < revenue * 0.3 ? 95 : 60 },
                      { label: "Business Stability", val: Math.min(100, (data?.years_in_operation || 0) * 10) },
                      { label: "Compliance", val: data?.gst_registered ? 100 : 50 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                          <span className="text-zinc-400">{item.label}</span>
                          <span className="text-zinc-300">{item.val} / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${item.val}%` }} 
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                            className={`h-full rounded-full ${item.val > 80 ? 'bg-blue-500' : item.val > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardTransition>
            </div>
            )}

            {/* Third Row: Top Matching Banks */}
            {activeTab === 'matches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-100">Top Matching Lenders</h3>
                <button className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center">
                  View All Matches <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              {sortedMatches.length === 0 ? (
                <div className="p-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center bg-[#121212]">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <Search className="w-5 h-5 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-300">No matches found yet</h3>
                  <p className="text-xs text-zinc-500 mt-1">Our engine is analyzing lenders. Check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedMatches.map((match, idx) => (
                    <CardTransition key={match.id} delay={0.7 + (idx * 0.1)}>
                      <Card className="p-5 flex flex-col group relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shadow-inner">
                              {match.bank?.institution_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">{match.bank?.institution_name}</h4>
                              <p className="text-[11px] text-zinc-500">{match.bank?.institution_type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-400">{match.compatibility_score}%</span>
                            <p className="text-[9px] text-blue-500/70 uppercase font-medium">Match Fit</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                          <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-500 uppercase mb-1">Est. Rate</p>
                            <p className="font-medium text-zinc-200">{match.bank?.min_interest_rate || 6}% - {match.bank?.max_interest_rate || 14}%</p>
                          </div>
                          <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                            <p className="text-[10px] text-zinc-500 uppercase mb-1">Max Loan</p>
                            <p className="font-medium text-zinc-200">{formatCurrency(match.bank?.max_loan_amount)}</p>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3 pt-2">
                          <button onClick={() => setSelectedBank(match)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors">
                            View Details
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleApply(match.bank.id); }}
                            disabled={hasApplied(match.bank.id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-xs font-medium transition-colors ml-auto flex items-center gap-1">
                            {hasApplied(match.bank.id) ? "Applied" : "Apply Now"}
                          </button>
                        </div>
                      </Card>
                    </CardTransition>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Financial Snapshot */}
            {activeTab === 'overview' && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium text-zinc-100">Financial Snapshot</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#121212] border border-zinc-800/80 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Annual Revenue</p>
                  <p className="font-semibold text-zinc-200">{formatCurrency(revenue)}</p>
                </div>
                <div className="p-4 bg-[#121212] border border-zinc-800/80 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Net Profit</p>
                  <p className="font-semibold text-blue-400">{formatCurrency(profit)}</p>
                </div>
                <div className="p-4 bg-[#121212] border border-zinc-800/80 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Existing Debt</p>
                  <p className="font-semibold text-amber-500">{formatCurrency(data?.existing_debt)}</p>
                </div>
                <div className="p-4 bg-[#121212] border border-zinc-800/80 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Cash Flow</p>
                  <p className="font-semibold text-blue-400">{formatCurrency(data?.monthly_cash_flow)}</p>
                </div>
              </div>

              {/* AI Insight Summary */}
              {data?.ai_summary && (
                <Card className="p-6 mt-6 bg-blue-500/5 border-blue-500/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                      {/* <Zap className="w-5 h-5" /> */}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200 mb-1">AI Profile Analysis</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">{data.ai_summary}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            )}

            {/* Applications Table */}
            <div className="space-y-4 pt-4">
              {(activeTab === 'overview' || activeTab === 'applications') && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-zinc-100">Recent Applications</h3>
                <Card className="overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900/50 border-b border-zinc-800 text-xs font-medium text-zinc-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">Bank</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium hidden sm:table-cell">Applied Date</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-zinc-500 text-xs">
                            No active applications found. Apply to a matched lender to start.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app: any) => (
                          <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700 text-xs">
                                  {app.bank?.institution_name?.substring(0, 2).toUpperCase() || "BK"}
                                </div>
                                <span className="text-sm text-zinc-200 font-medium">{app.bank?.institution_name || `Bank #${app.bank_id}`}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide
                                ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                  app.status === 'under_review' ? 'bg-blue-500/10 text-blue-500' :
                                  app.status === 'waitlisted' ? 'bg-purple-500/10 text-purple-500' :
                                  app.status === 'approved' ? 'bg-blue-500/10 text-blue-500' :
                                  app.status === 'withdrawn' ? 'bg-zinc-500/10 text-zinc-400' :
                                  'bg-red-500/10 text-red-500'
                                }
                              `}>
                                {app.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell text-xs text-zinc-400">
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-4 text-right space-x-3">
                              {['pending', 'under_review', 'waitlisted'].includes(app.status) && (
                                <button 
                                  onClick={() => handleWithdraw(app.id)}
                                  className="text-amber-500/70 hover:text-amber-400 transition-colors text-xs font-medium"
                                >
                                  Withdraw
                                </button>
                              )}
                              <button className="text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium">
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Card>
              </div>
              )}
            </div>

            {/* AI Actionable Advice */}
            {activeTab === 'overview' && data?.ai_business_advice && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium text-zinc-100">AI Actionable Advice</h3>
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 shrink-0 h-fit">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200 mb-2">Strategic Recommendations</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {data.ai_business_advice}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            )}

            {/* AI Report View */}
            {activeTab === 'ai_report' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-zinc-100">AI Funding Report</h3>
                  <button onClick={() => window.print()} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    Export PDF
                  </button>
                </div>
                <Card className="p-8">
                  {isGeneratingReport ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                      <Zap className="w-8 h-8 text-blue-500 animate-pulse mb-4" />
                      <p>Generating your comprehensive funding report...</p>
                    </div>
                  ) : aiReport ? (
                    <div className="prose prose-invert max-w-none prose-blue prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-strong:text-zinc-200 prose-li:text-zinc-300">
                      <ReactMarkdown>{aiReport}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <p className="mb-4">Your AI Funding Report hasn&apos;t been generated yet.</p>
                      <button onClick={handleGenerateReport} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Generate AI Report
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Edit Profile Tab Render */}
            {activeTab === 'edit_profile' && editFormData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-zinc-100">Edit Profile</h3>
                  <p className="text-zinc-400 text-sm mt-1">Update your financial and business details to get better matches.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Business Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Company Name</label>
                        <input type="text" value={editFormData.company_name || ""} onChange={e => setEditFormData({...editFormData, company_name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Industry</label>
                        <input type="text" value={editFormData.industry || ""} onChange={e => setEditFormData({...editFormData, industry: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Years in Operation</label>
                        <input type="number" value={editFormData.years_in_operation || 0} onChange={e => setEditFormData({...editFormData, years_in_operation: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Employee Count</label>
                        <input type="number" value={editFormData.employee_count || 0} onChange={e => setEditFormData({...editFormData, employee_count: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Financial Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Annual Revenue ($)</label>
                        <input type="number" value={editFormData.annual_revenue || 0} onChange={e => setEditFormData({...editFormData, annual_revenue: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Annual Net Profit ($)</label>
                        <input type="number" value={editFormData.annual_net_profit || 0} onChange={e => setEditFormData({...editFormData, annual_net_profit: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Existing Debt ($)</label>
                        <input type="number" value={editFormData.existing_debt || 0} onChange={e => setEditFormData({...editFormData, existing_debt: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Monthly Cash Flow ($)</label>
                        <input type="number" value={editFormData.monthly_cash_flow || 0} onChange={e => setEditFormData({...editFormData, monthly_cash_flow: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Credit Score</label>
                        <input type="number" value={editFormData.business_credit_score || 0} onChange={e => setEditFormData({...editFormData, business_credit_score: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Funding Needs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Funding Goal ($)</label>
                        <input type="number" value={editFormData.funding_goal || 0} onChange={e => setEditFormData({...editFormData, funding_goal: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Funding Purpose</label>
                        <select value={editFormData.funding_purpose || ""} onChange={e => setEditFormData({...editFormData, funding_purpose: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                          <option value="" disabled>Select a purpose...</option>
                          {Object.values(FundingPurpose).map((purpose) => (
                            <option key={purpose} value={purpose}>{purpose}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Preferred Loan Type</label>
                        <select value={editFormData.loan_type || ""} onChange={e => setEditFormData({...editFormData, loan_type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                          <option value="" disabled>Select loan type...</option>
                          {Object.values(LoanType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pt-4">
                    <button 
                      type="submit" 
                      disabled={isSavingProfile}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {isSavingProfile ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Updating Profile & AI...</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Details Side Drawer */}
      <AnimatePresence>
        {selectedBank && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBank(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[500px] bg-[#0F0F0F] border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-[#0F0F0F]/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
                    {selectedBank.bank?.institution_name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">{selectedBank.bank?.institution_name}</h2>
                    <p className="text-xs text-zinc-500">{selectedBank.bank?.institution_type}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBank(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1">
                
                {/* Score Header */}
                <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-5">
                  <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-1">Compatibility Engine</p>
                    <h3 className="text-3xl font-bold text-blue-400">{selectedBank.compatibility_score}% Match</h3>
                    <p className="text-xs text-blue-500/80 mt-1">{selectedBank.recommendation}</p>
                  </div>
                </div>

                {/* Match Criteria */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-400 border-b border-blue-900 pb-2 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" /> Passed Rules ({selectedBank.passed_rules?.length || 0})
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedBank.passed_rules?.map((rule: string, i: number) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedBank.failed_rules?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-rose-400 border-b border-rose-900 pb-2 flex items-center gap-2 mb-3">
                        <X className="w-4 h-4" /> Failed Rules ({selectedBank.failed_rules?.length})
                      </h3>
                      <ul className="space-y-2.5">
                        {selectedBank.failed_rules?.map((rule: string, i: number) => (
                          <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                            <span className="leading-relaxed">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bank Product Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800 pb-2">Lender Offerings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase mb-1">Max Loan</p>
                      <p className="font-semibold text-zinc-200">{formatCurrency(selectedBank.bank?.max_loan_amount)}</p>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase mb-1">Est. Rate</p>
                      <p className="font-semibold text-zinc-200">{selectedBank.bank?.min_interest_rate}% - {selectedBank.bank?.max_interest_rate}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase mb-2">Supported Products</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedBank.bank?.loan_products?.map((prod: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-medium text-zinc-300">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-zinc-800 bg-[#0A0A0A] flex items-center gap-3 sticky bottom-0">
                <button 
                  onClick={() => handleApply(selectedBank.bank.id)}
                  disabled={hasApplied(selectedBank.bank.id)}
                  className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:shadow-none">
                  {hasApplied(selectedBank.bank.id) ? "Application Submitted" : "Apply Now"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      {/* AI Chat Slide-over Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#0F0F0F] border-l border-zinc-800 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#121212]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">AI Funding Advisor</h2>
                    <p className="text-[10px] text-zinc-400">Powered by FundBridge</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
                {chatMessages.length === 0 && (
                  <div className="text-center text-zinc-500 text-xs mt-10">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3 border border-zinc-700">
                      <Zap className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p>I&apos;m your AI advisor. I have access to your full financial profile.</p>
                    <p className="mt-1">Ask me anything about improving your funding readiness!</p>
                  </div>
                )}
                
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'}`}>
                      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-sm">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-none bg-zinc-800 border border-zinc-700 p-4">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-zinc-800 bg-[#121212]">
                <form onSubmit={handleChatSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your funding readiness..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-4 pr-12 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow placeholder:text-zinc-500"
                    disabled={isChatLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-full transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
