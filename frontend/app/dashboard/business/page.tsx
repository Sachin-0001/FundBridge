import { Card } from "@/components/ui/card";
import { BarChart3, CheckCircle2, LayoutDashboard, Settings, User } from "lucide-react";

export default function BusinessDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-muted/20 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold">FundBridge AI</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <BarChart3 className="h-4 w-4" /> Financials
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <User className="h-4 w-4" /> Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground">
            <Settings className="h-4 w-4" /> Settings
          </a>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold">Overview</h1>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            AC
          </div>
        </header>
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Application Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="text-2xl font-bold text-green-500">Under Review</h3>
              </div>
            </Card>
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Funding Goal</p>
              <h3 className="text-2xl font-bold">$500,000</h3>
            </Card>
            <Card className="p-6 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">AI Match Score</p>
              <h3 className="text-2xl font-bold text-primary">92%</h3>
            </Card>
          </div>

          <Card className="p-8 flex flex-col items-center justify-center min-h-[300px] border-dashed text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyzing your financial data</h3>
            <p className="text-muted-foreground max-w-md">Our matching engine is currently crunching your numbers to find the best banking partners for your specific profile.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
