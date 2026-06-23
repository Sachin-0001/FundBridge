/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card } from "@/components/ui/card";
import { Building, LayoutDashboard, Settings, Users, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BankService } from "@/services/bank.service";

export default function BankDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-muted/20 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold">FundBridge AI Partner</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-emerald-500/10 text-emerald-500">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <Users className="h-4 w-4" /> Matches
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <Building className="h-4 w-4" /> Bank Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <Settings className="h-4 w-4" /> Rules Engine
          </a>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold">Deal Flow Overview</h1>
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
            {data?.institution_name?.substring(0, 2).toUpperCase() || "GF"}
          </div>
        </header>
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Institution Name</p>
              <h3 className="text-2xl font-bold text-emerald-500">{data?.institution_name || "Unknown"}</h3>
            </Card>
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Target Min Revenue</p>
              <h3 className="text-2xl font-bold">${data?.requirements?.min_revenue?.toLocaleString() || "0"}</h3>
            </Card>
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Funded Deals (YTD)</p>
              <h3 className="text-2xl font-bold">$12.5M</h3>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Top AI Matches</h2>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">SaaS Startup {i}</h3>
                    <p className="text-sm text-muted-foreground">Requested: $500k • ARR: $2M</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-emerald-500 font-medium">Match: {99 - i}%</p>
                    <p className="text-xs text-muted-foreground">High Confidence</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
