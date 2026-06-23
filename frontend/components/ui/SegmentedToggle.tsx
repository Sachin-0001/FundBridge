"use client";

import { motion } from "framer-motion";

interface SegmentedToggleProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function SegmentedToggle({ options, selected, onChange }: SegmentedToggleProps) {
  return (
    <div className="relative inline-flex items-center justify-center p-1 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm shadow-sm">
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative px-6 py-2.5 text-sm font-medium transition-colors rounded-full z-10 ${
              isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-toggle-bg"
                className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
