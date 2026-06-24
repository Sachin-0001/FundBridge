/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BankService } from "@/services/bank.service";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "details", title: "Institution Details" },
  { id: "products", title: "Lending Products" },
  { id: "rules", title: "Eligibility Rules" },
  { id: "preferences", title: "Lending Preferences" },
];

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

const formSchema = z.object({
  // Step 1
  institution_name: z.string().min(2, "Institution name is required"),
  institution_type: z.string().min(2, "Institution type is required"),
  city: z.string().min(2, "City is required"),
  
  // Step 2
  loan_products: z.array(z.string()).min(1, "Select at least one loan product"),
  min_interest_rate: z.coerce.number().min(0).max(100),
  max_interest_rate: z.coerce.number().min(0).max(100),
  min_loan_amount: z.coerce.number().min(0),
  max_loan_amount: z.coerce.number().min(0),
  min_loan_tenor: z.coerce.number().min(0),
  max_loan_tenor: z.coerce.number().min(0),

  // Step 3
  min_revenue: z.coerce.number().min(0),
  max_debt_to_revenue_ratio: z.coerce.number().min(0).max(100),
  min_years_in_business: z.coerce.number().min(0),

  // Step 4
  preferred_industries: z.string().min(1, "Select at least one industry (can type 'All')"),
  preferred_locations: z.string().min(1, "Select at least one location (can type 'All')"),
  gst_registered_only: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InvestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution_name: "",
      institution_type: institutionTypes[0],
      city: "",
      loan_products: [],
      min_interest_rate: "" as any,
      max_interest_rate: "" as any,
      min_loan_amount: "" as any,
      max_loan_amount: "" as any,
      min_loan_tenor: "" as any,
      max_loan_tenor: "" as any,
      min_revenue: "" as any,
      max_debt_to_revenue_ratio: "" as any,
      min_years_in_business: "" as any,
      preferred_industries: "",
      preferred_locations: "",
      gst_registered_only: false,
    },
    mode: "onChange"
  });

  // Autosave logic
  useEffect(() => {
    const saved = localStorage.getItem("bank_form_autosave");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {}
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("bank_form_autosave", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await form.trigger(["institution_name", "institution_type", "city"]);
    else if (currentStep === 1) isValid = await form.trigger(["loan_products", "min_interest_rate", "max_interest_rate", "min_loan_amount", "max_loan_amount", "min_loan_tenor", "max_loan_tenor"]);
    else if (currentStep === 2) isValid = await form.trigger(["min_revenue", "max_debt_to_revenue_ratio", "min_years_in_business"]);
    else isValid = await form.trigger(["preferred_industries", "preferred_locations", "gst_registered_only"]);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsCompleted(true);
      setSubmitError(null);
      await BankService.register({
        institution_name: data.institution_name,
        institution_type: data.institution_type,
        city: data.city,
        loan_products: data.loan_products,
        min_interest_rate: data.min_interest_rate,
        max_interest_rate: data.max_interest_rate,
        min_loan_amount: data.min_loan_amount,
        max_loan_amount: data.max_loan_amount,
        min_loan_tenor: data.min_loan_tenor,
        max_loan_tenor: data.max_loan_tenor,
        requirements: {
          min_revenue: data.min_revenue,
          max_debt_to_revenue_ratio: data.max_debt_to_revenue_ratio,
          min_years_in_business: data.min_years_in_business,
          preferred_industries: data.preferred_industries.split(",").map((s: string) => s.trim()).filter(Boolean),
          preferred_locations: data.preferred_locations.split(",").map((s: string) => s.trim()).filter(Boolean),
          gst_registered_only: data.gst_registered_only,
        }
      });
      localStorage.removeItem("bank_form_autosave");
      router.push("/dashboard/bank");
    } catch (error: any) {
      console.error("Failed to register bank:", error);
      setIsCompleted(false);
      setSubmitError(error.response?.data?.detail || "An error occurred during registration. Please try again.");
    }
  };

  if (isCompleted) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
            <div className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">Authenticating Partner...</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Configuring your institution&apos;s profile and preparing the match engine dashboard.
          </p>
        </div>
      </PageContainer>
    );
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen bg-background overflow-clip">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
      <div className="absolute top-0 right-0 -z-10 w-full h-[500px] bg-gradient-to-l from-teal-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-full h-[500px] bg-gradient-to-t from-emerald-500/10 to-transparent blur-3xl" />
      <PageContainer>
      <div className="max-w-3xl mx-auto w-full pt-8 pb-20">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-3xl font-bold">Partner with FundBridge</h1>
          
          <div className="relative mt-8">
             <Progress value={progressPercentage} className="h-2 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
             <div className="absolute top-4 left-0 w-full flex justify-between text-xs font-medium text-muted-foreground">
               {steps.map((s, i) => (
                 <span key={s.id} className={i <= currentStep ? "text-emerald-500 font-semibold" : ""}>{s.title}</span>
               ))}
             </div>
          </div>
        </div>

        <Card className="p-8 shadow-2xl shadow-emerald-500/5 border-border/50 bg-card/60 backdrop-blur-xl mt-12">
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[400px] flex flex-col justify-between">
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
                    <h2 className="text-2xl font-semibold">Institution Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Institution Name</Label>
                        <Input {...form.register("institution_name")} placeholder="Global Finance Bank" className="h-12" />
                        {form.formState.errors.institution_name && <p className="text-sm text-destructive">{form.formState.errors.institution_name.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Institution Type</Label>
                        <select {...form.register("institution_type")} className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                          {institutionTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {form.formState.errors.institution_type && <p className="text-sm text-destructive">{form.formState.errors.institution_type.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Headquarters City</Label>
                        <Input {...form.register("city")} placeholder="New York" className="h-12" />
                        {form.formState.errors.city && <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Lending Products</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Loan Products Offered</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {loanProductOptions.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-muted/50">
                              <input 
                                type="checkbox" 
                                value={opt} 
                                {...form.register("loan_products")}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" 
                              />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>
                        {form.formState.errors.loan_products && <p className="text-sm text-destructive">{form.formState.errors.loan_products.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Min Interest Rate (%)</Label>
                          <Input type="number" step="0.1" {...form.register("min_interest_rate")} placeholder="5.5" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Interest Rate (%)</Label>
                          <Input type="number" step="0.1" {...form.register("max_interest_rate")} placeholder="15.0" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Min Loan Amount ($)</Label>
                          <Input type="number" {...form.register("min_loan_amount")} placeholder="10000" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Loan Amount ($)</Label>
                          <Input type="number" {...form.register("max_loan_amount")} placeholder="10000000" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Min Loan Tenor (Months)</Label>
                          <Input type="number" {...form.register("min_loan_tenor")} placeholder="12" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Loan Tenor (Months)</Label>
                          <Input type="number" {...form.register("max_loan_tenor")} placeholder="120" className="h-12" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Eligibility Rules</h2>
                    <p className="text-sm text-muted-foreground">These rules automatically filter out businesses that don't match your criteria.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Min Annual Revenue ($)</Label>
                        <Input type="number" {...form.register("min_revenue")} placeholder="500000" className="h-12" />
                        <p className="text-xs text-muted-foreground">Only businesses with revenue above this amount will match.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Max Debt-to-Revenue Ratio (%)</Label>
                        <Input type="number" {...form.register("max_debt_to_revenue_ratio")} placeholder="40" className="h-12" />
                        <p className="text-xs text-muted-foreground">Filters out highly leveraged businesses.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Min Years in Business</Label>
                        <Input type="number" {...form.register("min_years_in_business")} placeholder="2" className="h-12" />
                        <p className="text-xs text-muted-foreground">Minimum operational history required.</p>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Lending Preferences</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Preferred Industries (Comma separated)</Label>
                        <Input {...form.register("preferred_industries")} placeholder="Technology, Healthcare, Manufacturing" className="h-12" />
                        {form.formState.errors.preferred_industries && <p className="text-sm text-destructive">{form.formState.errors.preferred_industries.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Locations (Comma separated)</Label>
                        <Input {...form.register("preferred_locations")} placeholder="New York, California, Texas" className="h-12" />
                        {form.formState.errors.preferred_locations && <p className="text-sm text-destructive">{form.formState.errors.preferred_locations.message}</p>}
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" {...form.register("gst_registered_only")} className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                          <span className="text-sm font-medium">Accept GST/Tax Registered Businesses Only</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col mt-12 pt-6 border-t border-border/50">
              {submitError && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                  {typeof submitError === 'string' ? submitError : JSON.stringify(submitError)}
                </div>
              )}
              <div className="flex justify-between">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    {Object.keys(form.formState.errors).length > 0 && (
                      <span className="text-sm text-destructive font-medium">Please fix errors before submitting.</span>
                    )}
                    <Button type="submit" className="px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" onClick={() => console.log("Submit clicked, errors:", form.formState.errors)}>
                      Complete Registration
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
      </PageContainer>
    </div>
  );
}
