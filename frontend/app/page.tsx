"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, BarChart3, CheckCircle2, ShieldCheck, Zap, Network, LineChart, Users } from "lucide-react";
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
            <Link href="/borrow" passHref>
              <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
              Learn More
            </Button>
          </div>
        </div>
        <div className="w-full max-w-5xl relative mt-8 lg:mt-12">
          <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden aspect-square lg:aspect-[4/3] flex items-center justify-center">
            {/* Abstract Illustration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative grid grid-cols-2 gap-4 p-8 w-full h-full">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background rounded-xl p-4 shadow-sm border border-border/50 flex flex-col justify-between">
                 <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><BarChart3 className="h-4 w-4" /></div>
                 <div>
                   <div className="text-sm text-muted-foreground">AI Match Score</div>
                   <div className="text-2xl font-bold">94%</div>
                 </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-background rounded-xl p-4 shadow-sm border border-border/50 flex flex-col justify-between">
                 <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle2 className="h-4 w-4" /></div>
                 <div>
                   <div className="text-sm text-muted-foreground">Status</div>
                   <div className="text-lg font-bold text-green-500">Pre-Approved</div>
                 </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-2 bg-background rounded-xl p-4 shadow-sm border border-border/50">
                 <div className="h-4 w-1/3 bg-muted rounded mb-4" />
                 <div className="space-y-2">
                   <div className="h-2 w-full bg-muted rounded" />
                   <div className="h-2 w-4/5 bg-muted rounded" />
                   <div className="h-2 w-full bg-muted rounded" />
                 </div>
              </motion.div>
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
            <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg shadow-primary/25 transition-transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
            Contact Sales
          </Button>
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
            <Link href="/invest" passHref>
              <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105">
                Register Bank <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
              Request Demo
            </Button>
          </div>
        </div>
        <div className="w-full max-w-5xl relative mt-8 lg:mt-12">
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
          <Link href="/invest" passHref>
            <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base backdrop-blur-sm bg-background/50 border-border/50 hover:bg-muted/50">
            Contact Sales
          </Button>
        </div>
      </section>
    </div>
  );
}
