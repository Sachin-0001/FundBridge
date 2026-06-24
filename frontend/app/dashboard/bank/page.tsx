/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  FileText,
  Building, 
  Briefcase, 
  MapPin, 
  BadgeDollarSign, 
  Activity, 
  HeartPulse, 
  ChevronDown, 
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Landmark,
  Percent,
  X,
  ChevronRight,
  RefreshCw,
  Bell,
  LayoutDashboard,
  Settings,
  Loader2,
  Target,
  Filter,
  User,
  Layers
} from 'lucide-react';
import { BankService } from "@/services/bank.service";
import { useAuth } from "@/contexts/AuthContext";

const institutionTypes = [
  "Commercial Bank",
  "NBFC",
  "Credit Union",
  "Venture Debt",
  "FinTech Lender",
  "Government Institution",
  "Private Lending Firm"
];

const loanProductOptions = [
  "Working Capital",
  "Equipment Financing",
  "Invoice Financing",
  "Business Expansion",
  "MSME Loan",
  "Line of Credit",
  "Term Loan"
];

export default function BankDashboard() {
  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"matches" | "applications" | "edit_profile">("applications");
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minRevenue, setMinRevenue] = useState<number | "">("");
  const [minScore, setMinScore] = useState<number | "">("");
  const [minAiScore, setMinAiScore] = useState<number | "">("");
  const [maxFunding, setMaxFunding] = useState<number | "">("");

  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const loadData = () => {
    Promise.all([
      BankService.getDashboard(),
      BankService.getMatches(),
      import('@/services/application.service').then(m => m.applicationService.getBankApplications())
    ]).then(([dashboardRes, matchesRes, apps]) => {
      setData(dashboardRes.data);
      setMatches(matchesRes.data || []);
      setApplications(apps || []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      if (err.response?.status === 404) {
        window.location.href = "/invest";
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data && !editFormData) {
      setEditFormData(data);
    }
  }, [data]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await BankService.register({
        ...editFormData,
        requirements: {
          ...editFormData.requirements
        }
      });
      await loadData();
      setActiveTab('applications');
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateStatus = async (appId: number, status: string) => {
    // Optimistic UI update
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, status } : app));
    setSelectedApp(null);
    
    try {
      const { applicationService } = await import('@/services/application.service');
      await applicationService.updateApplicationStatus(appId, status);
      await loadData();
    } catch(e) {
      console.error(e);
      await loadData();
    }
  };

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return "$0";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const companyMatch = match.business?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const indMatch = industryFilter ? match.business?.industry === industryFilter : true;
      const locMatch = locationFilter ? match.business?.country === locationFilter || match.business?.city === locationFilter : true;
      const revMatch = minRevenue !== "" ? (match.business?.annual_revenue || 0) >= Number(minRevenue) : true;
      const scoreMatch = minScore !== "" ? match.compatibility_score >= Number(minScore) : true;
      const aiScoreMatch = minAiScore !== "" ? (match.business?.readiness_score || 0) >= Number(minAiScore) : true;
      const fundMatch = maxFunding !== "" ? (match.business?.funding_goal || 0) <= Number(maxFunding) : true;
      
      return companyMatch && indMatch && locMatch && revMatch && scoreMatch && aiScoreMatch && fundMatch;
    });
  }, [matches, searchQuery, industryFilter, locationFilter, minRevenue, minScore, minAiScore, maxFunding]);

  const kpis = useMemo(() => {
    const eligible = matches.filter(m => m.compatibility_score >= 50).length;
    const avgScore = matches.length ? Math.round(matches.reduce((acc, m) => acc + m.compatibility_score, 0) / matches.length) : 0;
    const avgAiScore = matches.length ? Math.round(matches.reduce((acc, m) => acc + (m.business?.readiness_score || 0), 0) / matches.length) : 0;
    
    return {
      eligible,
      active: matches.length,
      avgScore,
      avgAiScore
    };
  }, [matches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const industries = Array.from(new Set(matches.map(m => m.business?.industry).filter(Boolean)));

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-zinc-100 selection:bg-emerald-500/30 font-sans">
      {/* Sidebar - Stripe/Ramp inspired minimalism */}
      <aside className="w-[240px] border-r border-zinc-800/50 bg-[#0F0F0F] flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto">
        {/* <div className="h-16 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-sm text-zinc-100">FundBridge Partners</span>
          </div>
        </div> */}
        
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 px-3 mt-2">Overview</div>
          <button onClick={() => setActiveTab('applications')} className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab !== 'edit_profile' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-zinc-800/50 text-zinc-400'}`}>
            <LayoutDashboard className="h-4 w-4" /> Deal Flow
          </button>
          
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-8 px-3">Configuration</div>
          <button onClick={() => setActiveTab('edit_profile')} className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'edit_profile' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-zinc-800/50 text-zinc-400'}`}>
            <User className="h-4 w-4" /> Edit Profile
          </button>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* <header className="h-16 border-b border-zinc-800/50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-20">
          <h1 className="text-sm font-medium text-zinc-200">{data?.institution_name} • Deal Flow</h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium border border-zinc-700">
              {data?.institution_name?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header> */}
        
        <div className="p-8 max-w-[1200px] w-full mx-auto space-y-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-[#121212] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors">
              <p className="text-xs font-medium text-zinc-400 mb-2">Eligible Borrowers</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold">{kpis.eligible}</h3>
                <span className="text-[10px] text-emerald-500 font-medium px-1.5 py-0.5 rounded bg-emerald-500/10">High Fit</span>
              </div>
            </div>
            <div className="p-5 bg-[#121212] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors">
              <p className="text-xs font-medium text-zinc-400 mb-2">Total Deal Flow</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold">{kpis.active}</h3>
                <span className="text-[10px] text-zinc-500 font-medium">applications</span>
              </div>
            </div>
            <div className="p-5 bg-[#121212] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors">
              <p className="text-xs font-medium text-zinc-400 mb-2">Avg. Compatibility</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-emerald-400">{kpis.avgScore}%</h3>
              </div>
            </div>
            <div className="p-5 bg-[#121212] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors">
              <p className="text-xs font-medium text-zinc-400 mb-2">Avg. AI Readiness</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-blue-400">{kpis.avgAiScore}</h3>
                <span className="text-[10px] text-zinc-500 font-medium">/ 100</span>
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div className="space-y-4">
            <div className="flex border-b border-zinc-800 mb-6">
              <button 
                onClick={() => setActiveTab("applications")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'applications' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
              >
                Incoming Applications
              </button>
              <button 
                onClick={() => setActiveTab("matches")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'matches' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
              >
                Matching Deal Flow
              </button>
            </div>

            {activeTab === 'matches' && (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Search companies..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="h-9 w-48 bg-[#121212] border border-zinc-800 rounded-lg pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200 placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={industryFilter}
                        onChange={e => setIndustryFilter(e.target.value)}
                        className="h-9 appearance-none bg-[#121212] border border-zinc-800 rounded-lg pl-4 pr-10 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200"
                      >
                        <option value="">All Industries</option>
                        {industries.map(ind => <option key={ind as string} value={ind as string}>{ind as string}</option>)}
                      </select>
                      <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="Min Revenue" 
                      value={minRevenue}
                      onChange={e => setMinRevenue(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-32 bg-[#121212] border border-zinc-800 rounded-lg px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200 placeholder:text-zinc-600"
                    />
                    <input 
                      type="number" 
                      placeholder="Max Funding" 
                      value={maxFunding}
                      onChange={e => setMaxFunding(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-32 bg-[#121212] border border-zinc-800 rounded-lg px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200 placeholder:text-zinc-600"
                    />
                    <input 
                      type="number" 
                      placeholder="Min Match %" 
                      value={minScore}
                      onChange={e => setMinScore(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-28 bg-[#121212] border border-zinc-800 rounded-lg px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200 placeholder:text-zinc-600"
                    />
                    <input 
                      type="number" 
                      placeholder="Min AI Score" 
                      value={minAiScore}
                      onChange={e => setMinAiScore(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-32 bg-[#121212] border border-zinc-800 rounded-lg px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-200 placeholder:text-zinc-600"
                    />
                    
                    {/* Compare Button */}
                    <div className="flex gap-2 ml-auto">
                      <button 
                        onClick={() => {
                          if (isCompareMode) {
                            setIsCompareMode(false);
                            setSelectedForCompare([]);
                          } else {
                            setIsCompareMode(true);
                          }
                        }}
                        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isCompareMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#121212] border border-zinc-800 text-zinc-300 hover:border-emerald-500'}`}
                      >
                        <Layers className="w-4 h-4" /> {isCompareMode ? "Cancel Compare" : "Compare"}
                      </button>
                      {isCompareMode && (
                        <button
                          disabled={selectedForCompare.length !== 2}
                          onClick={() => setShowCompareModal(true)}
                          className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Compare Selected ({selectedForCompare.length}/2)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="p-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-zinc-600" />
                    </div>
                    <h3 className="text-sm font-medium text-zinc-300">No matches found</h3>
                    <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or wait for new applications.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredMatches.map((match) => (
                      <div 
                        key={match.id} 
                        className={`p-5 bg-[#121212] border ${selectedForCompare.some(m => m.id === match.id) ? 'border-emerald-500/50 ring-1 ring-emerald-500/50' : 'border-zinc-800/80 hover:border-zinc-700'} rounded-xl transition-all flex flex-col group relative overflow-hidden`}
                      >
                        {isCompareMode && (
                          <div className="absolute top-4 right-4 z-10">
                            <input
                              type="checkbox"
                              checked={selectedForCompare.some(m => m.id === match.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedForCompare.length < 2) {
                                    setSelectedForCompare([...selectedForCompare, match]);
                                  }
                                } else {
                                  setSelectedForCompare(selectedForCompare.filter(m => m.id !== match.id));
                                }
                              }}
                              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                            />
                          </div>
                        )}
                        {!isCompareMode && (
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedMatch(match)} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                              View Details
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
                              {match.business?.company_name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">{match.business?.company_name}</h3>
                              <p className="text-[11px] text-zinc-500">{match.business?.industry} • {match.business?.city}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-2 flex-1">
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase">Revenue</p>
                            <p className="text-sm font-medium text-zinc-300">{formatCurrency(match.business?.annual_revenue)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase">Funding Req.</p>
                            <p className="text-sm font-medium text-zinc-300">{formatCurrency(match.business?.funding_goal)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase">AI Score</p>
                            <p className="text-sm font-medium text-blue-400">{match.business?.readiness_score}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase">Approval Prob. (ML)</p>
                            <p className="text-sm font-medium text-purple-400">
                              {match.compatibility_score > 80 ? "High" : match.compatibility_score > 50 ? "Medium" : "Low"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-zinc-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <Percent className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-500 uppercase">Match Score</p>
                              <p className="text-sm font-bold text-emerald-400">{match.compatibility_score}%</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-500">{match.recommendation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'applications' && (
              <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                  <div className="p-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-zinc-600" />
                    </div>
                    <h3 className="text-sm font-medium text-zinc-300">No applications yet</h3>
                    <p className="text-xs text-zinc-500 mt-1">Wait for businesses to apply to your bank.</p>
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="p-5 bg-[#121212] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setSelectedApp(app)}>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
                          {app.business?.company_name?.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-100">{app.business?.company_name}</h3>
                          <p className="text-xs text-zinc-400 mt-1">{app.business?.industry} • {app.business?.city}, {app.business?.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 font-medium uppercase mb-1">Requested</p>
                          <p className="text-sm font-semibold text-zinc-200">{formatCurrency(app.amount_requested)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 font-medium uppercase mb-1">Status</p>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wide
                            ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                              app.status === 'under_review' ? 'bg-blue-500/10 text-blue-500' :
                              app.status === 'waitlisted' ? 'bg-purple-500/10 text-purple-500' :
                              app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                              app.status === 'withdrawn' ? 'bg-zinc-500/10 text-zinc-400' :
                              'bg-red-500/10 text-red-500'
                            }
                          `}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'edit_profile' && editFormData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-zinc-100">Edit Profile</h3>
                  <p className="text-zinc-400 text-sm mt-1">Update your institution details and lending preferences.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Institution Details */}
                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Institution Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Institution Name</label>
                        <input type="text" value={editFormData.institution_name || ""} onChange={e => setEditFormData({...editFormData, institution_name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Institution Type</label>
                        <select value={editFormData.institution_type || ""} onChange={e => setEditFormData({...editFormData, institution_type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none">
                          <option value="" disabled>Select Type...</option>
                          {institutionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-zinc-400 mb-1">City</label>
                        <input type="text" value={editFormData.city || ""} onChange={e => setEditFormData({...editFormData, city: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Lending Products */}
                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Lending Products</h2>
                    <div className="mb-6">
                      <label className="block text-xs font-medium text-zinc-400 mb-3">Loan Products Offered</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {loanProductOptions.map((opt) => (
                          <label key={opt} className="flex items-center space-x-3 p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={(editFormData.loan_products || []).includes(opt)}
                              onChange={(e) => {
                                const current = editFormData.loan_products || [];
                                const next = e.target.checked 
                                  ? [...current, opt]
                                  : current.filter((p: string) => p !== opt);
                                setEditFormData({...editFormData, loan_products: next});
                              }}
                              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500" 
                            />
                            <span className="text-sm text-zinc-300 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Min Interest Rate (%)</label>
                        <input type="number" step="0.1" value={editFormData.min_interest_rate || ""} onChange={e => setEditFormData({...editFormData, min_interest_rate: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Max Interest Rate (%)</label>
                        <input type="number" step="0.1" value={editFormData.max_interest_rate || ""} onChange={e => setEditFormData({...editFormData, max_interest_rate: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Min Loan Amount ($)</label>
                        <input type="number" value={editFormData.min_loan_amount || ""} onChange={e => setEditFormData({...editFormData, min_loan_amount: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Max Loan Amount ($)</label>
                        <input type="number" value={editFormData.max_loan_amount || ""} onChange={e => setEditFormData({...editFormData, max_loan_amount: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Min Loan Tenor (Months)</label>
                        <input type="number" value={editFormData.min_loan_tenor || ""} onChange={e => setEditFormData({...editFormData, min_loan_tenor: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Max Loan Tenor (Months)</label>
                        <input type="number" value={editFormData.max_loan_tenor || ""} onChange={e => setEditFormData({...editFormData, max_loan_tenor: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-[#121212] border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 pb-2 mb-4">Eligibility Rules & Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Min Annual Revenue ($)</label>
                        <input type="number" value={editFormData.requirements?.min_revenue || ""} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, min_revenue: parseFloat(e.target.value)}})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Max Debt-to-Revenue Ratio (%)</label>
                        <input type="number" step="0.1" value={editFormData.requirements?.max_debt_to_revenue_ratio || ""} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, max_debt_to_revenue_ratio: parseFloat(e.target.value)}})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Min Years in Business</label>
                        <input type="number" value={editFormData.requirements?.min_years_in_business || ""} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, min_years_in_business: parseInt(e.target.value)}})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Preferred Industries (Comma separated)</label>
                        <input type="text" value={editFormData.requirements?.preferred_industries?.join(", ") || ""} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, preferred_industries: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)}})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Preferred Locations (Comma separated)</label>
                        <input type="text" value={editFormData.requirements?.preferred_locations?.join(", ") || ""} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, preferred_locations: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)}})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={editFormData.requirements?.gst_registered_only || false} onChange={e => setEditFormData({...editFormData, requirements: {...editFormData.requirements, gst_registered_only: e.target.checked}})} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500" />
                        <label className="block text-xs font-medium text-zinc-400">Accept GST/Tax Registered Businesses Only</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isSavingProfile} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedMatch && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMatch(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-[#0F0F0F] border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
                    {selectedMatch.business?.company_name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">{selectedMatch.business?.company_name}</h2>
                    <p className="text-xs text-zinc-500">{selectedMatch.business?.industry} • {selectedMatch.business?.years_in_operation} years in operation</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMatch(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1">
                
                {/* Score Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-500/70 uppercase">Compatibility</p>
                      <h3 className="text-2xl font-bold text-emerald-400">{selectedMatch.compatibility_score}%</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-500/70 uppercase">AI Readiness</p>
                      <h3 className="text-2xl font-bold text-blue-400">{selectedMatch.business?.readiness_score}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Lending Fit Summary</h3>
                  <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
                    {selectedMatch.business?.ai_summary || "No AI summary available."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-emerald-400 border-b border-emerald-900 pb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Passed Rules ({selectedMatch.passed_rules?.length || 0})
                    </h3>
                    <ul className="space-y-2">
                      {selectedMatch.passed_rules?.map((rule: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-rose-400 border-b border-rose-900 pb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Failed Rules ({selectedMatch.failed_rules?.length || 0})
                    </h3>
                    <ul className="space-y-2">
                      {selectedMatch.failed_rules?.length === 0 && <li className="text-sm text-zinc-500 italic">None</li>}
                      {selectedMatch.failed_rules?.map((rule: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Financial Snapshot</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Annual Revenue</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedMatch.business?.annual_revenue)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Existing Debt</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedMatch.business?.existing_debt)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Monthly Cash Flow</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedMatch.business?.monthly_cash_flow)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Credit Score</p>
                      <p className="font-medium text-zinc-200">{selectedMatch.business?.business_credit_score}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Funding Request</h3>
                  <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">Requested Amount</p>
                      <h4 className="text-xl font-bold text-zinc-100">{formatCurrency(selectedMatch.business?.funding_goal)}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Purpose</p>
                      <p className="font-medium text-zinc-200">{selectedMatch.business?.funding_purpose}</p>
                      <p className="text-[10px] text-zinc-500">{selectedMatch.business?.loan_type}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-zinc-800 bg-[#0A0A0A] flex items-center gap-4 sticky bottom-0">
                <button onClick={() => setSelectedMatch(null)} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Close Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Application Detail Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-[#0F0F0F] border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700">
                    {selectedApp.business?.company_name?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">{selectedApp.business?.company_name}</h2>
                    <p className="text-xs text-zinc-500">{selectedApp.business?.industry} • {selectedApp.business?.years_in_operation} years in operation</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1">
                
                {/* Score Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-500/70 uppercase">AI Readiness</p>
                      <h3 className="text-2xl font-bold text-blue-400">{selectedApp.business?.readiness_score}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl flex flex-col justify-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">Application Status</p>
                    <span className={`mt-1 inline-flex w-max px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                      ${selectedApp.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        selectedApp.status === 'under_review' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        selectedApp.status === 'waitlisted' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                        selectedApp.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        selectedApp.status === 'withdrawn' ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }
                    `}>
                      {selectedApp.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Lending Fit Summary</h3>
                  <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
                    {selectedApp.business?.ai_summary || "No AI summary available."}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Financial Snapshot</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Annual Revenue</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedApp.business?.annual_revenue)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Existing Debt</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedApp.business?.existing_debt)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Monthly Cash Flow</p>
                      <p className="font-medium text-zinc-200">{formatCurrency(selectedApp.business?.monthly_cash_flow)}</p>
                    </div>
                    <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800/80">
                      <p className="text-xs text-zinc-500">Credit Score</p>
                      <p className="font-medium text-zinc-200">{selectedApp.business?.business_credit_score}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Funding Request</h3>
                  <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">Requested Amount</p>
                      <h4 className="text-xl font-bold text-zinc-100">{formatCurrency(selectedApp.amount_requested)}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Purpose</p>
                      <p className="font-medium text-zinc-200">{selectedApp.purpose}</p>
                      <p className="text-[10px] text-zinc-500">{selectedApp.business?.loan_type}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-zinc-800 bg-[#0A0A0A] flex items-center gap-4 sticky bottom-0">
                {selectedApp.status === 'withdrawn' ? (
                  <button onClick={() => setSelectedApp(null)} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Close Details
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')} className="flex-1 h-10 bg-zinc-800 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-500/30">
                      Reject
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedApp.id, 'waitlisted')} className="flex-1 h-10 bg-zinc-800 hover:bg-purple-500/20 text-white hover:text-purple-400 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-purple-500/30">
                      Waitlist
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedApp.id, 'approved')} className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      Approve Application
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      {showCompareModal && selectedForCompare.length === 2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#0A0A0A]">
              <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-500"/> Business Comparison</h2>
              <button onClick={() => setShowCompareModal(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A]">
              <div className="grid grid-cols-3 gap-6">
                {/* Headers */}
                <div className="space-y-4 p-4 text-sm font-medium text-zinc-500">
                  <div className="mb-4 h-20"></div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Industry</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Location</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Match Fit</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">AI Readiness Score</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Annual Revenue</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Net Profit</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Existing Debt</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Monthly Cash Flow</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Years in Operation</div>
                  <div className="h-10 border-b border-zinc-800/50 flex items-center">Employees</div>
                </div>

                {/* Businesses */}
                {selectedForCompare.map((match, idx) => (
                  <div key={match.id} className={`space-y-4 p-4 rounded-xl ${idx === 0 ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-emerald-500/5 border border-emerald-500/10'}`}>
                    <div className="mb-4 flex flex-col items-center text-center h-20 justify-center relative">
                      <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700 mb-2 shadow-sm">
                        {match.business?.company_name.substring(0,2).toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-zinc-100 text-sm truncate w-full px-2" title={match.business?.company_name}>{match.business?.company_name}</h3>
                    </div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{match.business?.industry || 'N/A'}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{match.business?.city || 'N/A'}{match.business?.state ? `, ${match.business.state}` : ''}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm font-semibold text-emerald-400">{match.compatibility_score}%</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm font-medium text-blue-400">{match.business?.readiness_score || 'N/A'} <span className="text-zinc-600 ml-1 text-xs font-normal">/ 100</span></div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{formatCurrency(match.business?.annual_revenue)}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{formatCurrency(match.business?.annual_net_profit)}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-amber-500/80">{formatCurrency(match.business?.existing_debt)}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{formatCurrency(match.business?.monthly_cash_flow)}</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{match.business?.years_in_operation || 0} years</div>
                    <div className="h-10 border-b border-zinc-800/50 flex items-center text-sm text-zinc-300">{match.business?.employee_count || 0}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-[#0F0F0F] flex justify-end gap-3">
              <button onClick={() => {
                setShowCompareModal(false);
                setIsCompareMode(false);
                setSelectedForCompare([]);
              }} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
