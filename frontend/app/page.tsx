"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, BarChart3, CheckCircle2, ShieldCheck, Zap, Network, LineChart, Users, LayoutDashboard, FileText, Landmark, Settings } from "lucide-react";
import Link from "next/link";
import { TimelineScroller } from "@/components/ui/TimelineScroller";

export default function Home() {
  const [mode, setMode] = useState<"Business" | "Bank">("Business");

  return (
    <div className="relative min-h-screen overflow-clip bg-background">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence>
          {mode === "Business" ? (
            <motion.div
              key="bg-business"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
              <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-l from-blue-500/10 to-transparent blur-3xl" />
              <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-primary/10 to-transparent blur-3xl" />
            </motion.div>
          ) : (
            <motion.div
              key="bg-bank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
              <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-l from-teal-500/10 to-transparent blur-3xl" />
              <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-emerald-500/10 to-transparent blur-3xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PageContainer>
        <div className="flex flex-col items-center justify-center pt-16 pb-8">
          <SegmentedToggle
            options={["Business", "Bank"]}
            selected={mode}
            onChange={(val) => setMode(val as "Business" | "Bank")}
          />
        </div>

        <AnimatePresence mode="wait">
          {mode === "Business" ? (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <BusinessLanding />
            </motion.div>
          ) : (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <BankLanding />
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    </div>
  );
}

function BusinessLanding() {
  const [mockTab, setMockTab] = useState<'overview' | 'applications' | 'matches' | 'edit_profile'>('overview');

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-12 pt-16">
        <div className="w-full max-w-4xl space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Get Funding <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Smarter & Faster.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our AI-powered platform analyzes your financial health, scores your readiness, and matches you with top-tier banks tailored to your exact profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" passHref>
              <Button size="lg" className="cursor-pointer rounded-full px-8 h-14 text-base shadow-lg shadow-blue-500/25 bg-blue-500 hover:bg-blue-600 text-white transition-transform hover:scale-105">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href = "/contact" passHref> 
            <Button size="lg" variant="outline" className="cursor-pointer rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
              Learn More
            </Button>
            </Link>
          </div>  
        </div>
        <div className="w-full max-w-5xl relative mt-8 lg:mt-12">
          {/* Interactive Notice */}
          <div className="absolute -top-3 sm:-top-5 -right-2 sm:-right-5 z-20 bg-background/80 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Interactive Demo • Click the sidebar
          </div>
          <div className="relative rounded-2xl border border-zinc-800 bg-[#0A0A0A] shadow-2xl overflow-hidden aspect-square lg:aspect-[4/3] flex flex-row">
            {/* Mock Dashboard Sidebar */}
            <div className="w-[180px] border-r border-zinc-800/80 bg-[#0F0F0F] flex flex-col p-4 shrink-0 hidden sm:flex">
              <div className="text-[10px] font-medium text-zinc-500 mb-2 uppercase tracking-wider">Workspace</div>
              <nav className="space-y-1">
                <button onClick={() => setMockTab('overview')} className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${mockTab === 'overview' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </button>
                <button onClick={() => setMockTab('applications')} className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${mockTab === 'applications' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                  <FileText className="w-3.5 h-3.5" /> Applications
                </button>
                <button onClick={() => setMockTab('matches')} className={`flex justify-between items-center w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${mockTab === 'matches' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                  <div className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5" /> Matches
                  </div>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded">12</span>
                </button>
              </nav>
              <div className="mt-6">
                <div className="text-[10px] font-medium text-zinc-500 mb-2 uppercase tracking-wider">Quick Actions</div>
                <nav className="space-y-1">
                  <button onClick={() => setMockTab('edit_profile')} className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-left ${mockTab === 'edit_profile' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
                    <Settings className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </nav>
              </div>
            </div>

            {/* Mock Dashboard Main Content */}
            <div className="flex-1 p-6 flex flex-col gap-6 relative text-left overflow-y-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {mockTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="relative">
                      <h3 className="text-lg font-bold text-zinc-100 mb-3">Financial Snapshot</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-[#121212] border border-zinc-800/80 rounded-lg">
                          <p className="text-[9px] text-zinc-500 uppercase mb-1">Annual Revenue</p>
                          <p className="font-semibold text-zinc-200 text-sm">$1,000,000</p>
                        </div>
                        <div className="p-3 bg-[#121212] border border-zinc-800/80 rounded-lg">
                          <p className="text-[9px] text-zinc-500 uppercase mb-1">Net Profit</p>
                          <p className="font-semibold text-blue-400 text-sm">$75,000</p>
                        </div>
                        <div className="p-3 bg-[#121212] border border-zinc-800/80 rounded-lg">
                          <p className="text-[9px] text-zinc-500 uppercase mb-1">Existing Debt</p>
                          <p className="font-semibold text-amber-500 text-sm">$10,000</p>
                        </div>
                        <div className="p-3 bg-[#121212] border border-zinc-800/80 rounded-lg">
                          <p className="text-[9px] text-zinc-500 uppercase mb-1">Credit Score</p>
                          <p className="font-semibold text-blue-400 text-sm">700</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-200 mb-1">AI Match Score: 94%</h4>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">Your strong cash flow and low debt make you an excellent candidate for term loans. Pre-approved for 12 lenders.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-zinc-100">Top Matched Lenders</h4>
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-[#121212] border border-zinc-800/80 rounded-lg p-3 flex items-center justify-between hover:border-zinc-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shadow-inner text-xs">
                              L{i}
                            </div>
                            <div>
                              <h4 className="font-semibold text-zinc-100 text-xs">Premium Lender {i}</h4>
                              <p className="text-[9px] text-zinc-500">Commercial Bank</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-blue-400">{96 - i}%</span>
                            <p className="text-[8px] text-blue-500/70 uppercase font-medium">Match Fit</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {mockTab === 'applications' && (
                  <motion.div key="apps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-100">Applications</h3>
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-[#121212] border border-zinc-800/80 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">B{i}</div>
                          <div>
                            <div className="text-xs font-medium text-zinc-200">Global Tech Bank {i}</div>
                            <div className="text-[10px] text-zinc-500">Term Loan • $500,000</div>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-medium rounded">Pending</div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {mockTab === 'matches' && (
                  <motion.div key="matches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-100">Matched Lenders</h3>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#121212] border border-zinc-800/80 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">L{i}</div>
                          <div>
                            <div className="text-xs font-medium text-zinc-200">Premium Lender {i}</div>
                            <div className="text-[10px] text-zinc-500">Match Score: {95 - i}%</div>
                          </div>
                        </div>
                        <button className="cursor-pointer px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-medium rounded transition-colors">Apply</button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {mockTab === 'edit_profile' && (
                  <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-100">Edit Profile</h3>
                    <div className="bg-[#121212] border border-zinc-800/80 rounded-lg p-4 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase">Company Name</label>
                        <div className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300">Acme Corp</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase">Annual Revenue</label>
                        <div className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300">$1,000,000</div>
                      </div>
                      <div className="pt-2">
                        <button className="cursor-pointer w-full py-1.5 bg-blue-500 text-white text-xs font-medium rounded transition-colors">Save Changes</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Scroll Timeline) */}
      <TimelineScroller />

      {/* Benefits */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center space-y-4 p-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Zap className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Lightning Fast</h3>
          <p className="text-muted-foreground text-sm">Skip the traditional weeks-long bank application process.</p>
        </div>
        <div className="flex flex-col items-center space-y-4 p-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Network className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Network Access</h3>
          <p className="text-muted-foreground text-sm">One application gets you in front of dozens of premium lenders.</p>
        </div>
        <div className="flex flex-col items-center space-y-4 p-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Secure by Design</h3>
          <p className="text-muted-foreground text-sm">Bank-grade encryption ensures your data remains completely private.</p>
        </div>
      </section>
      {/* Bottom CTA */}
      <section className="relative py-32 mt-20 border-t border-border/50 flex flex-col items-center text-center space-y-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to fund your growth?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Join thousands of businesses getting matched with the right capital providers in days, not months.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/borrow" passHref>
            <Button size="lg" className="cursor-pointer rounded-full px-8 h-14 text-base shadow-lg shadow-blue-500/25 bg-blue-500 hover:bg-blue-600 text-white transition-transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href = "/contact" passHref>
            <Button size="lg" variant="outline" className="cursor-pointer rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
              Contact Sales
            </Button> 
          </Link>
        </div>
      </section>
    </div>
  );
}

function BankLanding() {
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-12 pt-16">
        <div className="w-full max-w-4xl space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Find Qualified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              Borrowers Faster.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Expand your loan portfolio with pre-vetted, high-quality businesses that match your exact lending criteria using our AI matching engine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" passHref>
              <Button size="lg" className="cursor-pointer rounded-full px-8 h-14 text-base shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105">
                Register Bank <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href = "/contact" passHref>
              <Button size="lg" variant="outline" className="cursor-pointer rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
                Contact Sales
              </Button> 
            </Link>
          </div>
        </div>
        <div className="w-full max-w-5xl relative mt-8 lg:mt-12">
          {/* Interactive Notice */}
          <div className="absolute -top-3 sm:-top-5 -right-2 sm:-right-5 z-20 bg-background/80 border border-emerald-500/30 text-emerald-500 text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Interactive Demo • Click the profiles
          </div>
          <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden aspect-square lg:aspect-[4/3] flex flex-col">
             <div className="border-b border-border/50 bg-muted/30 p-4 flex gap-2">
               <div className="h-3 w-3 rounded-full bg-red-500/80" />
               <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
               <div className="h-3 w-3 rounded-full bg-green-500/80" />
             </div>
             <div className="p-6 flex-1 flex flex-col gap-4 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!selectedCompany ? (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">New Opportunities</div>
                          <div className="text-2xl font-bold">14</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Users className="h-5 w-5" /></div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <motion.div key={i} className="bg-background rounded-lg p-4 border border-border/50 flex items-center justify-between shadow-sm hover:border-emerald-500/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <LineChart className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-sm">Tech Startup LLC {i}</div>
                              <div className="text-xs text-emerald-500 font-medium">Match: {99 - i}%</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => setSelectedCompany(i)}>Review</Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col gap-5 h-full text-left"
                    >
                       <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                         <Button variant="ghost" size="icon" onClick={() => setSelectedCompany(null)} className="h-8 w-8 rounded-full shrink-0">
                           <ArrowLeft className="h-4 w-4" />
                         </Button>
                         <div>
                           <div className="font-semibold">Tech Startup LLC {selectedCompany}</div>
                           <div className="text-xs text-muted-foreground">B2B SaaS • Founded 2021</div>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                         <div className="bg-background rounded-lg p-3 border border-border/50">
                           <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Annual Revenue</div>
                           <div className="font-bold text-base">$1.2M</div>
                         </div>
                         <div className="bg-background rounded-lg p-3 border border-border/50">
                           <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Requested Loan</div>
                           <div className="font-bold text-base">$250k</div>
                         </div>
                         <div className="bg-background rounded-lg p-3 border border-border/50">
                           <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Burn Rate</div>
                           <div className="font-bold text-base">$45k/mo</div>
                         </div>
                         <div className="bg-background rounded-lg p-3 border border-border/50">
                           <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">AI Match Score</div>
                           <div className="font-bold text-base text-emerald-500">{99 - selectedCompany}%</div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Summary</div>
                         <p className="text-sm text-muted-foreground leading-relaxed">
                           Strong recurring revenue with low churn (2%). Seeking capital for Go-To-Market expansion. Healthy runway and excellent match for your current risk appetite.
                         </p>
                       </div>
                       
                       <div className="mt-auto flex gap-3 pt-4 border-t border-border/50">
                         <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">Approve</Button>
                         <Button variant="outline" className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">Pass</Button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* Matching Process */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Precision Matching Engine</h2>
          <p className="text-muted-foreground text-lg">
            Stop wasting time on unqualified leads. We only send you applications that align perfectly with your risk appetite, industry preferences, and capital requirements.
          </p>
          <ul className="space-y-4 pt-4">
            {["Automated financial spreading", "Real-time risk assessment", "Custom rule engine", "Direct API integration"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-3xl blur-2xl" />
          <Card className="relative p-8 bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Risk Profile Alignment</div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Industry Match</div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Revenue Threshold</div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.9 }} className="h-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-32 mt-20 border-t border-border/50 flex flex-col items-center text-center space-y-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to find better borrowers?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Join the network of premium lenders leveraging our AI matching engine to deploy capital efficiently.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register" passHref>
            <Button size="lg" className="cursor-pointer rounded-full px-8 h-14 text-base shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href = "/contact" passHref>
            <Button size="lg" variant="outline" className="cursor-pointer rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
              Contact Sales
            </Button>
          </Link> 
        </div>
      </section>
    </div>
  );
}
