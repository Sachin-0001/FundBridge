"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BusinessService, BusinessType, FundingPurpose, LoanType } from "@/services/business.service";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "company", title: "Company Info" },
  { id: "funding", title: "Funding Requirements" },
  { id: "financials", title: "Financial Health" },
  { id: "profile", title: "Business Profile" },
];

const formSchema = z.object({
  // Step 1
  company_name: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  business_type: z.nativeEnum(BusinessType, { message: "Required" }),
  years_in_operation: z.coerce.number().min(0, "Required"),
  
  // Step 2
  funding_goal: z.coerce.number().min(1000, "Minimum $1,000"),
  funding_purpose: z.nativeEnum(FundingPurpose, { message: "Required" }),
  loan_type: z.nativeEnum(LoanType, { message: "Required" }),
  preferred_tenure_min: z.coerce.number().optional(),
  preferred_tenure_max: z.coerce.number().optional(),
  
  // Step 3
  annual_revenue: z.coerce.number().min(0, "Required"),
  annual_net_profit: z.coerce.number(),
  existing_debt: z.coerce.number().min(0, "Required"),
  monthly_cash_flow: z.coerce.number(),
  business_credit_score: z.coerce.number().min(300, "Min 300").max(850, "Max 850"),
  
  // Step 4
  employee_count: z.coerce.number().min(1, "Required"),
  country: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  gst_registered: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BorrowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      company_name: "",
      industry: "",
      business_type: BusinessType.PRIVATE_LIMITED,
      years_in_operation: "" as any,
      funding_goal: "" as any,
      funding_purpose: FundingPurpose.WORKING_CAPITAL,
      loan_type: LoanType.TERM_LOAN,
      preferred_tenure_min: "" as any,
      preferred_tenure_max: "" as any,
      annual_revenue: "" as any,
      annual_net_profit: "" as any,
      existing_debt: "" as any,
      monthly_cash_flow: "" as any,
      business_credit_score: "" as any,
      employee_count: "" as any,
      country: "",
      state: "",
      city: "",
      gst_registered: true,
    },
    mode: "onChange"
  });

  // Load from autosave
  useEffect(() => {
    const saved = localStorage.getItem("borrow_form_autosave");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {}
    }
  }, [form]);

  // Autosave
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("borrow_form_autosave", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await form.trigger(["company_name", "industry", "business_type", "years_in_operation"]);
    else if (currentStep === 1) isValid = await form.trigger(["funding_goal", "funding_purpose", "loan_type", "preferred_tenure_min", "preferred_tenure_max"]);
    else if (currentStep === 2) isValid = await form.trigger(["annual_revenue", "annual_net_profit", "existing_debt", "monthly_cash_flow", "business_credit_score"]);
    else isValid = true;

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: FormValues) => {
    try {
      setIsCompleted(true);
      await BusinessService.register(data);
      localStorage.removeItem("borrow_form_autosave");
      localStorage.setItem('user_type', 'business');
      router.push("/dashboard/business");
    } catch (error) {
      console.error("Failed to register business:", error);
      setIsCompleted(false);
    }
  };

  if (isCompleted) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">Authenticating...</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Securely creating your account and preparing your personalized AI dashboard.
          </p>
        </div>
      </PageContainer>
    );
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen bg-background overflow-clip">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 right-0 -z-10 w-full h-[500px] bg-gradient-to-l from-blue-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-full h-[500px] bg-gradient-to-t from-primary/10 to-transparent blur-3xl" />
      <PageContainer>
      <div className="max-w-3xl mx-auto w-full pt-8 pb-20">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="mb-12 space-y-6">
          <h1 className="text-3xl font-bold text-center">Let&apos;s get you funded</h1>
          
          <div className="relative">
             <div className="flex justify-between mb-2">
               <span className="text-sm font-medium text-muted-foreground">Progress</span>
               <span className="text-sm font-medium text-blue-500">{progressPercentage}%</span>
             </div>
             <Progress value={progressPercentage} className="h-2 [&_[data-slot=progress-indicator]]:bg-blue-500" />
             <div className="absolute top-8 left-0 w-full flex justify-between text-xs font-medium text-muted-foreground">
               {steps.map((s, i) => (
                 <span key={s.id} className={i <= currentStep ? "text-blue-500 font-semibold" : ""}>{s.title}</span>
               ))}
             </div>
          </div>
        </div>

        <Card className="p-8 shadow-lg shadow-primary/5 border-border/50 bg-card/60 backdrop-blur-xl mt-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Business Name</Label>
                        <Input {...form.register("company_name")} placeholder="Acme Corp" className="h-12" />
                        {form.formState.errors.company_name && <p className="text-sm text-destructive">{form.formState.errors.company_name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Input {...form.register("industry")} placeholder="Technology, Retail..." className="h-12" />
                        {form.formState.errors.industry && <p className="text-sm text-destructive">{form.formState.errors.industry.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <select {...form.register("business_type")} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          {Object.values(BusinessType).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {form.formState.errors.business_type && <p className="text-sm text-destructive">{form.formState.errors.business_type.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Years in Operation</Label>
                        <Input type="number" {...form.register("years_in_operation")} placeholder="e.g. 5" className="h-12" />
                        {form.formState.errors.years_in_operation && <p className="text-sm text-destructive">{form.formState.errors.years_in_operation.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Funding Requirements</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Funding Amount Required ($)</Label>
                        <Input type="number" {...form.register("funding_goal")} placeholder="100000" className="h-12" />
                        {form.formState.errors.funding_goal && <p className="text-sm text-destructive">{form.formState.errors.funding_goal.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Purpose of Funding</Label>
                        <select {...form.register("funding_purpose")} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                          {Object.values(FundingPurpose).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Loan Type</Label>
                        <select {...form.register("loan_type")} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                          {Object.values(LoanType).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Min Preferred Tenure (Months)</Label>
                          <Input type="number" {...form.register("preferred_tenure_min")} placeholder="e.g. 12" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Preferred Tenure (Months)</Label>
                          <Input type="number" {...form.register("preferred_tenure_max")} placeholder="e.g. 60" className="h-12" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Financial Health</h2>
                    <p className="text-sm text-muted-foreground">Please provide approximate figures for the last financial year.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Annual Revenue ($)</Label>
                        <Input type="number" {...form.register("annual_revenue")} placeholder="500000" className="h-12" />
                        {form.formState.errors.annual_revenue && <p className="text-sm text-destructive">{form.formState.errors.annual_revenue.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Annual Net Profit ($)</Label>
                        <Input type="number" {...form.register("annual_net_profit")} placeholder="75000" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Existing Debt ($)</Label>
                        <Input type="number" {...form.register("existing_debt")} placeholder="10000" className="h-12" />
                        <p className="text-xs text-muted-foreground">Total outstanding loans or obligations.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Average Monthly Cash Flow ($)</Label>
                        <Input type="number" {...form.register("monthly_cash_flow")} placeholder="20000" className="h-12" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Business Credit Score</Label>
                        <Input type="number" {...form.register("business_credit_score")} placeholder="720" className="h-12" />
                        <p className="text-xs text-muted-foreground">If unknown, provide a conservative estimate.</p>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Business Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Number of Employees</Label>
                        <Input type="number" {...form.register("employee_count")} placeholder="15" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input {...form.register("country")} placeholder="USA" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>State / Province</Label>
                        <Input {...form.register("state")} placeholder="California" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input {...form.register("city")} placeholder="San Francisco" className="h-12" />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pb-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" {...form.register("gst_registered")} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                          <span className="text-sm font-medium">GST / Tax Registered</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-6 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
      </PageContainer>
    </div>
  );
}
