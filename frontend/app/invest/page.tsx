/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BankService } from "@/services/bank.service";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Building, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "details", title: "Bank Details" },
  { id: "products", title: "Loan Products" },
  { id: "rules", title: "Eligibility Rules" },
  { id: "review", title: "Review" },
];

const formSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  productTypes: z.string().min(1, "Please list at least one product type"),
  minRevenue: z.string().min(1, "Required"),
  preferredIndustries: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InvestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      productTypes: "",
      minRevenue: "",
      preferredIndustries: "",
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await form.trigger(["bankName"]);
    else if (currentStep === 1) isValid = await form.trigger(["productTypes"]);
    else if (currentStep === 2) isValid = await form.trigger(["minRevenue"]);
    else isValid = true;

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: FormValues) => {
    try {
      setIsCompleted(true);
      await BankService.register({
        institution_name: data.bankName,
        contact_email: "account@bank.com", // Will be extracted from backend token if needed, or left as placeholder
        requirements: {
          min_revenue: parseFloat(data.minRevenue) || 0,
        }
      });
      localStorage.setItem('user_type', 'bank');
      setTimeout(() => {
        router.push("/dashboard/bank");
      }, 1000);
    } catch (error) {
      console.error("Failed to register bank:", error);
      setIsCompleted(false);
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

  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;

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
          {/* <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
            <Building className="h-8 w-8" />
          </div> */}
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
                    <h2 className="text-2xl font-semibold">Bank Details</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Institution Name</Label>
                        <Input id="bankName" {...form.register("bankName")} placeholder="Global Finance Bank" className="h-12" />
                        {form.formState.errors.bankName && <p className="text-sm text-destructive">{form.formState.errors.bankName.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Loan Products</h2>
                    <p className="text-sm text-muted-foreground">Describe the types of capital you provide.</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productTypes">Product Offerings</Label>
                        <Textarea id="productTypes" {...form.register("productTypes")} placeholder="Term loans, SBA 7(a), Lines of credit..." className="min-h-[100px]" />
                        {form.formState.errors.productTypes && <p className="text-sm text-destructive">{form.formState.errors.productTypes.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Eligibility Rules</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="minRevenue">Minimum Annual Revenue Requirement</Label>
                        <Input id="minRevenue" {...form.register("minRevenue")} placeholder="$500,000" className="h-12" />
                        {form.formState.errors.minRevenue && <p className="text-sm text-destructive">{form.formState.errors.minRevenue.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredIndustries">Preferred Industries (Optional)</Label>
                        <Input id="preferredIndustries" {...form.register("preferredIndustries")} placeholder="Tech, Healthcare, Manufacturing" className="h-12" />
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Review Configuration</h2>
                    <div className="space-y-4 bg-muted/30 p-6 rounded-lg text-sm">
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Institution:</span><span className="font-medium">{form.getValues("bankName")}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Email:</span><span className="font-medium">{form.getValues("contactEmail")}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Min Revenue:</span><span className="font-medium">{form.getValues("minRevenue")}</span></div>
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
                <Button type="button" onClick={nextStep} className="px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Complete Registration
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
