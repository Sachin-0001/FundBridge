"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { formatStatus, getStatusColor } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, RefreshCw, X, Building2, Landmark, 
  Clock, ShieldAlert, ArrowRightCircle, AlertCircle, Info, ChevronRight, FileText, CheckCircle2, Loader2
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [apps, setApps] = useState([] as any[]);
  const [filtered, setFiltered] = useState([] as any[]);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<any>({});
  const [drawerApp, setDrawerApp] = useState<any | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'forward' | 'block' | 'requestInfo' | null;
    appId: number | null;
  }>({ isOpen: false, type: null, appId: null });
  const [modalInput, setModalInput] = useState("");

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!loading && user && user.role !== "ADMIN") {
      window.location.href = "/";
    }
  }, [user, loading]);

  const fetchApps = async () => {
    try {
      const res = await api.get("/admin/applications/pending");
      setApps(res.data || []);
    } catch (err) {
      console.error("Failed to load pending apps", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data || {});
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoadingData(true);
      await Promise.all([fetchApps(), fetchStats()]);
      setLoadingData(false);
    };
    initData();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) setFiltered(apps);
    else {
      setFiltered(
        apps.filter(a => {
          const b = a.business?.company_name || "";
          const bk = a.bank?.institution_name || "";
          return b.toLowerCase().includes(q) || bk.toLowerCase().includes(q) || String(a.amount_requested).includes(q);
        })
      );
    }
  }, [query, apps]);

  const openDrawer = (app: any) => {
    setDrawerApp(app);
  };

  const closeDrawer = () => setDrawerApp(null);

  const openModal = (type: 'forward' | 'block' | 'requestInfo', appId: number) => {
    setModalState({ isOpen: true, type, appId });
    setModalInput("");
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, appId: null });
    setModalInput("");
  };

  const executeAction = async () => {
    const { type, appId } = modalState;
    if (!appId || !type) return;
    
    if (type === 'block' && !modalInput.trim()) {
      showToast("Please provide a reason to block.", "error");
      return;
    }
    if (type === 'requestInfo' && !modalInput.trim()) {
      showToast("Please specify what information is needed.", "error");
      return;
    }

    setLoadingAction(true);
    try {
      if (type === 'forward') {
        await api.post(`/admin/applications/${appId}/forward`, { notes: "Forwarded by admin" });
        showToast("Application successfully forwarded to bank.", "success");
      } else if (type === 'block') {
        await api.post(`/admin/applications/${appId}/block`, { blocked_reason: modalInput, notes: "Blocked by admin" });
        showToast("Application has been blocked.", "success");
      } else if (type === 'requestInfo') {
        await api.post(`/admin/applications/${appId}/request-info`, { notes: modalInput });
        showToast("Information request sent.", "success");
      }
      await fetchApps();
      await fetchStats();
      closeDrawer();
      closeModal();
    } catch (err) {
      console.error(err);
      showToast(`Failed to process action.`, "error");
    } finally {
      setLoadingAction(false);
    }
  };



  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading || loadingData) {
    return (
      <PageContainer>
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-zinc-400 font-medium animate-pulse">Loading dashboard data...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-zinc-400 mt-1">Monitor KPIs and manage pending applications securely.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 bg-[#0F0F0F] rounded-xl border border-zinc-800/80 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-zinc-400 mb-1">Pending Reviews</p>
              <h3 className="text-3xl font-bold text-white">{stats.pending_reviews ?? 0}</h3>
            </div>
          </div>
          
          <div className="p-5 bg-[#0F0F0F] rounded-xl border border-zinc-800/80 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
              <ArrowRightCircle className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-zinc-400 mb-1">Total Forwarded</p>
              <h3 className="text-3xl font-bold text-blue-400">{stats.applications_forwarded ?? 0}</h3>
            </div>
          </div>

          <div className="p-5 bg-[#0F0F0F] rounded-xl border border-zinc-800/80 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-zinc-400 mb-1">Bank Accepted</p>
              <h3 className="text-3xl font-bold text-emerald-400">{stats.applications_approved ?? 0}</h3>
            </div>
          </div>

          <div className="p-5 bg-[#0F0F0F] rounded-xl border border-zinc-800/80 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
              <ShieldAlert className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-zinc-400 mb-1">Bank Rejected</p>
              <h3 className="text-3xl font-bold text-red-400">{stats.applications_rejected_by_bank ?? 0}</h3>
            </div>
          </div>
          
          <div className="p-5 bg-[#0F0F0F] rounded-xl border border-zinc-800/80 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-orange-500">
              <AlertCircle className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-medium text-zinc-400 mb-1">Admin Blocked</p>
              <h3 className="text-3xl font-bold text-orange-400">{stats.applications_blocked ?? 0}</h3>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-[#0F0F0F] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Applications Awaiting Review
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder="Search applications..." 
                  className="pl-9 pr-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 w-full sm:w-64 transition-all" 
                />
              </div>
              <button 
                onClick={() => { fetchApps(); fetchStats(); }} 
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  <th className="px-6 py-4">Business</th>
                  <th className="px-6 py-4">Bank</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {(filtered.length ? filtered : (query ? [] : apps)).map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/20">
                          {app.business?.company_name?.substring(0,2).toUpperCase() || '—'}
                        </div>
                        <span className="font-medium text-zinc-200">{app.business?.company_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-500/20">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <span className="text-zinc-300">{app.bank?.institution_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-300">{formatCurrency(app.amount_requested)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-300 font-medium">{app.business?.readiness_score ?? '—'}</span>
                        {app.business?.readiness_score && (
                          <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${app.business.readiness_score}%` }}></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal('forward', app.id)}
                          title="Quick Forward"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        >
                          <ArrowRightCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDrawer(app)}
                          title="Review Details"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p>No pending applications to review.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {apps.length > 0 && filtered.length === 0 && query && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No applications found matching &quot;{query}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer */}
        <AnimatePresence>
          {drawerApp && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-[500px] bg-[#0F0F0F] border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl flex flex-col"
              >
                <div className="sticky top-0 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
                  <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Review Application
                  </h3>
                  <button onClick={closeDrawer} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 flex-1">
                  
                  {/* Application Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Application Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80">
                        <p className="text-xs text-zinc-500 mb-1">Requested Amount</p>
                        <p className="font-semibold text-zinc-200">{formatCurrency(drawerApp.amount_requested)}</p>
                      </div>
                      <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80">
                        <p className="text-xs text-zinc-500 mb-1">Submission Date</p>
                        <p className="font-semibold text-zinc-200 text-sm">{new Date(drawerApp.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80 col-span-2">
                        <p className="text-xs text-zinc-500 mb-1">Purpose</p>
                        <p className="font-medium text-zinc-200">{drawerApp.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Business Profile
                    </h4>
                    <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80 space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                          {drawerApp.business?.company_name?.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-semibold text-zinc-100">{drawerApp.business?.company_name}</h5>
                          <p className="text-xs text-zinc-500">{drawerApp.business?.industry} • {drawerApp.business?.years_in_operation} years</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div>
                          <p className="text-xs text-zinc-500">Annual Revenue</p>
                          <p className="font-medium text-zinc-200">{formatCurrency(drawerApp.business?.annual_revenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Net Profit</p>
                          <p className="font-medium text-zinc-200">{formatCurrency(drawerApp.business?.annual_net_profit)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Existing Debt</p>
                          <p className="font-medium text-zinc-200">{formatCurrency(drawerApp.business?.existing_debt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Monthly Cash Flow</p>
                          <p className="font-medium text-zinc-200">{formatCurrency(drawerApp.business?.monthly_cash_flow)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-300 border-b border-zinc-800 pb-2 flex items-center gap-2">
                      <Landmark className="w-4 h-4" /> Target Bank
                    </h4>
                    <div className="p-4 bg-[#121212] rounded-lg border border-zinc-800/80 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-zinc-100">{drawerApp.bank?.institution_name}</h5>
                        <p className="text-xs text-zinc-500">{drawerApp.bank?.institution_type}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Actions Footer */}
                <div className="p-6 border-t border-zinc-800 bg-[#0A0A0A] flex items-center gap-3 sticky bottom-0 z-10">
                  <button 
                    onClick={() => openModal('forward', drawerApp.id)} 
                    disabled={loadingAction}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ArrowRightCircle className="w-4 h-4" /> Forward
                  </button>
                  <button 
                    onClick={() => openModal('requestInfo', drawerApp.id)} 
                    disabled={loadingAction}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" /> Request Info
                  </button>
                  <button 
                    onClick={() => openModal('block', drawerApp.id)} 
                    disabled={loadingAction}
                    className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                    title="Block Application"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Action Modal */}
        <AnimatePresence>
          {modalState.isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-[#0F0F0F] border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                  <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                      {modalState.type === 'forward' && <><ArrowRightCircle className="w-5 h-5 text-emerald-400" /> Forward Application</>}
                      {modalState.type === 'block' && <><ShieldAlert className="w-5 h-5 text-red-400" /> Block Application</>}
                      {modalState.type === 'requestInfo' && <><Info className="w-5 h-5 text-blue-400" /> Request Information</>}
                    </h3>
                    <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4 text-zinc-300 text-sm">
                    {modalState.type === 'forward' && (
                      <p>Are you sure you want to securely forward this application and all attached verified documents to the target bank?</p>
                    )}
                    {modalState.type === 'block' && (
                      <>
                        <p>Are you sure you want to block this application? This action cannot be undone.</p>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Block Reason</label>
                          <textarea 
                            value={modalInput}
                            onChange={(e) => setModalInput(e.target.value)}
                            placeholder="Provide a reason for blocking..."
                            className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px] resize-none"
                            autoFocus
                          />
                        </div>
                      </>
                    )}
                    {modalState.type === 'requestInfo' && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400">Information Needed</label>
                        <textarea 
                          value={modalInput}
                          onChange={(e) => setModalInput(e.target.value)}
                          placeholder="Detail what additional information is required from the business..."
                          className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px] resize-none"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 border-t border-zinc-800 bg-[#0A0A0A] flex justify-end gap-3">
                    <button 
                      onClick={closeModal}
                      disabled={loadingAction}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={executeAction}
                      disabled={loadingAction}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        modalState.type === 'forward' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 
                        modalState.type === 'block' ? 'bg-red-600 hover:bg-red-500 text-white' : 
                        'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {loadingAction ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl font-medium text-sm border backdrop-blur-xl ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
