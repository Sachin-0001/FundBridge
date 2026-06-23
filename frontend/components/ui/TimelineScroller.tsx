"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowDown, CheckCircle2, ShieldCheck, Zap, Network } from "lucide-react";

const steps = [
  {
    title: "Apply",
    description: "Securely submit your business profile and financial information.",
    icon: ShieldCheck,
  },
  {
    title: "Analyze",
    description: "Our AI evaluates financial health, growth potential and funding readiness.",
    icon: Zap,
  },
  {
    title: "Match",
    description: "Get intelligently matched with lenders whose eligibility criteria fit your business.",
    icon: Network,
  },
  {
    title: "Fund",
    description: "Receive competitive funding offers and track your application status.",
    icon: CheckCircle2,
  },
];

function TimelineItem({ 
  step, 
  index, 
  smoothProgress 
}: { 
  step: typeof steps[0], 
  index: number, 
  smoothProgress: MotionValue<number> 
}) {
  // Now that we have a tall container, we map the scroll progress evenly.
  // There are 4 steps. They appear at 0.1, 0.35, 0.6, 0.85 approx.
  const stepScrollStart = index * 0.25;
  const stepScrollEnd = stepScrollStart + 0.15;
  
  // For the card: opacity, y, scale
  const cardOpacity = useTransform(smoothProgress, [stepScrollStart, stepScrollEnd], [0, 1]);
  const cardY = useTransform(smoothProgress, [stepScrollStart, stepScrollEnd], [40, 0]);
  const cardScale = useTransform(smoothProgress, [stepScrollStart, stepScrollEnd, stepScrollEnd + 0.1], [0.95, 1.02, 1]);
  
  // For the circle node: active opacity
  const nodeActiveOpacity = useTransform(smoothProgress, [stepScrollStart + 0.05, stepScrollEnd], [0, 1]);

  // Determine layout positioning
  const isEven = index % 2 === 0;

  return (
    <div className="relative w-full flex items-center">
      <div className="relative flex items-center justify-start md:justify-center w-full px-4 md:px-0">
        
        {/* Left Card (Desktop Only, Even Items) */}
        <div className={`hidden md:flex w-1/2 pr-12 md:pr-20 justify-end ${isEven ? '' : 'invisible'}`}>
           {isEven && (
             <motion.div style={{ opacity: cardOpacity, y: cardY, scale: cardScale }} className="w-full max-w-sm origin-right">
               <Card className="p-8 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                 <div className="relative z-10 flex flex-col items-end text-right">
                    <div className="text-4xl font-black text-primary/10 mb-2 tracking-tighter">0{index + 1}</div>
                    <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                 </div>
               </Card>
             </motion.div>
           )}
        </div>

        {/* Center Node */}
        <div className="absolute left-8 md:left-1/2 -ml-5 z-20 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden flex items-center justify-center relative">
            <motion.div 
              className="absolute inset-0 bg-primary" 
              style={{ opacity: nodeActiveOpacity }} 
            />
            <step.icon className="h-4 w-4 relative z-10 text-foreground transition-colors duration-300" />
          </div>
        </div>

        {/* Right Card (Desktop Odd Items, Mobile All Items) */}
        <div className={`flex w-full pl-20 md:pl-20 md:w-1/2 justify-start ${isEven ? 'md:invisible md:pointer-events-none' : ''}`}>
           {(!isEven || true) && (
             <motion.div style={{ opacity: cardOpacity, y: cardY, scale: cardScale }} className="w-full max-w-sm origin-left">
               <Card className="p-8 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                 <div className="relative z-10 flex flex-col items-start text-left">
                    <div className="text-4xl font-black text-primary/10 mb-2 tracking-tighter">0{index + 1}</div>
                    <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                 </div>
               </Card>
             </motion.div>
           )}
        </div>

      </div>
    </div>
  );
}

export function TimelineScroller() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Smooth the scroll progress for a buttery experience
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // The vertical line grows as we scroll
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative w-full bg-background py-32 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-24 z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto px-4">
            From funding request to capital approval in four simple steps.
          </p>
        </div>

        <div className="relative w-full flex flex-col">
          {/* Static Background Line */}
          <div className="absolute left-8 md:left-1/2 w-[2px] bg-border h-full -ml-[1px] top-0 rounded-full" />

          {/* Animated Foreground Line */}
          <motion.div 
            className="absolute left-8 md:left-1/2 w-[2px] bg-gradient-to-b from-primary to-blue-500 h-full -ml-[1px] top-0 origin-top rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            style={{ scaleY: lineHeight }}
          />

          {/* Step Nodes and Cards */}
          <div className="w-full relative flex flex-col gap-32 md:gap-40 py-8">
             {steps.map((step, index) => (
                <TimelineItem 
                  key={index} 
                  step={step} 
                  index={index} 
                  smoothProgress={smoothProgress} 
                />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
