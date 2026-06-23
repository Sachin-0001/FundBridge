"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  { id: "financials", title: "Financials" },
  { id: "metrics", title: "Metrics" },
  { id: "documents", title: "Documents" },
  { id: "review", title: "Review" },
];

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  website: z.string().url().optional().or(z.literal("")),
  annualRevenue: z.string().min(1, "Required"),
  fundingGoal: z.string().min(1, "Required"),
  employeeCount: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BorrowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      website: "",
      annualRevenue: "",
      fundingGoal: "",
      employeeCount: "",
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await form.trigger(["companyName", "website"]);
    else if (currentStep === 1) isValid = await form.trigger(["annualRevenue"]);
    else if (currentStep === 2) isValid = await form.trigger(["fundingGoal", "employeeCount"]);
    else isValid = true;

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setIsCompleted(true);
    setTimeout(() => {
      router.push("/dashboard/business");
    }, 2500);
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

  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto w-full pt-8 pb-20">
        <div className="mb-12 space-y-6">
          <h1 className="text-3xl font-bold text-center">Let&apos;s get you funded</h1>
          
          <div className="relative">
             <Progress value={progressPercentage} className="h-2" />
             <div className="absolute top-4 left-0 w-full flex justify-between text-xs font-medium text-muted-foreground">
               {steps.map((s, i) => (
                 <span key={s.id} className={i <= currentStep ? "text-primary" : ""}>{s.title}</span>
               ))}
             </div>
          </div>
        </div>

        <Card className="p-8 shadow-lg shadow-primary/5 border-border/50 bg-card/60 backdrop-blur-xl">
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Legal Company Name</Label>
                        <Input id="companyName" {...form.register("companyName")} placeholder="Acme Corp" className="h-12" />
                        {form.formState.errors.companyName && <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL (Optional)</Label>
                        <Input id="website" {...form.register("website")} placeholder="https://example.com" className="h-12" />
                        {form.formState.errors.website && <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Financial Information</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualRevenue">Annual Revenue</Label>
                        <Input id="annualRevenue" {...form.register("annualRevenue")} placeholder="$1,000,000" className="h-12" />
                        {form.formState.errors.annualRevenue && <p className="text-sm text-destructive">{form.formState.errors.annualRevenue.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Business Metrics</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fundingGoal">Funding Goal</Label>
                        <Input id="fundingGoal" {...form.register("fundingGoal")} placeholder="$500,000" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeCount">Number of Employees</Label>
                        <Input id="employeeCount" {...form.register("employeeCount")} placeholder="10-50" className="h-12" />
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Document Upload</h2>
                    <p className="text-muted-foreground">Upload your latest pitch deck or financial statements (Optional for now).</p>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <p className="text-sm font-medium">Click to browse or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Review your application</h2>
                    <div className="space-y-4 bg-muted/30 p-6 rounded-lg text-sm">
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Company:</span><span className="font-medium">{form.getValues("companyName")}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Revenue:</span><span className="font-medium">{form.getValues("annualRevenue")}</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Goal:</span><span className="font-medium">{form.getValues("fundingGoal")}</span></div>
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
                <Button type="button" onClick={nextStep} className="px-8 rounded-full">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="px-8 rounded-full bg-primary hover:bg-primary/90">
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
