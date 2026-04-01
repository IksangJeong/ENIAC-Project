"use client";

import { motion } from "framer-motion";
import { Clock } from "@/components/ui";
import clsx from "clsx";
import type { Quote } from "@/types";

interface ClockQuotePanelProps {
  quote: Quote | null;
  delay?: number;
  className?: string;
}

export function ClockQuotePanel({ quote, delay = 0, className }: ClockQuotePanelProps) {
  return (
    <motion.div
      className={clsx(
        "h-full flex flex-col",
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)]",
        "p-3 rounded-sm panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Header */}
      <div className="text-[10px] text-[var(--color-text-secondary)]/60 uppercase tracking-widest mb-2">
        System Time
      </div>

      {/* Clock */}
      <Clock
        format="24h"
        showSeconds
        showDate
        size="md"
        className="text-[var(--color-primary)] mb-3"
      />

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent my-2" />

      {/* Quote */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="text-[10px] text-[var(--color-text-secondary)]/60 uppercase tracking-widest mb-1">
          Kernel Message
        </div>
        {quote ? (
          <>
            <p className="text-[12px] italic text-[var(--color-text)]/80 leading-relaxed line-clamp-3">
              "{quote.quote}"
            </p>
            {quote.author && (
              <p className="text-[11px] text-[var(--color-text-secondary)]/70 mt-1">
                — {quote.author}
              </p>
            )}
          </>
        ) : (
          <p className="text-[12px] opacity-50">Loading...</p>
        )}
      </div>
    </motion.div>
  );
}
