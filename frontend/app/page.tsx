import { PageContainer } from "@/components/layout/PageContainer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <PageContainer>
      <section className="py-20 text-center flex flex-col items-center">
        <AnimatedSection>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-6">
            The Future of Business Funding
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            FundBridge AI intelligently matches businesses seeking capital with the perfect banking partners, all powered by advanced AI.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2} className="flex gap-4">
          <Link href="/borrow" passHref>
            <Button size="lg" className="rounded-full px-8">
              Get Funded <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/invest" passHref>
            <Button size="lg" variant="outline" className="rounded-full px-8">Become a Lender</Button>
          </Link>
        </AnimatedSection>
      </section>

      <section className="py-20 grid md:grid-cols-3 gap-8">
        <AnimatedSection delay={0.3} className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Fast Approvals</h3>
          <p className="text-muted-foreground">Our AI pre-screens applications to ensure lenders get qualified leads instantly.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
          <p className="text-muted-foreground">We align business profiles with bank criteria to ensure high success rates.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.5} className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Secure & Compliant</h3>
          <p className="text-muted-foreground">Bank-grade encryption and compliance at every step of the process.</p>
        </AnimatedSection>
      </section>
    </PageContainer>
  );
}
