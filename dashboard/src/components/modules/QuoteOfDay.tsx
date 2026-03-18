"use client";

import { Panel, TypingText } from "@/components/ui";
import { motion } from "framer-motion";
import type { Quote } from "@/types";

interface QuoteOfDayProps {
  quote: Quote | null;
  delay?: number;
}

export function QuoteOfDay({ quote, delay = 0 }: QuoteOfDayProps) {
  return (
    <Panel
      title="QUOTE OF THE DAY"
      subtitle="WISDOM"
      delay={delay}
      className="h-full"
    >
      <div className="flex flex-col justify-center h-full min-h-[120px]">
        {quote ? (
          <>
            {/* Quote Icon */}
            <motion.div
              className="text-4xl opacity-20 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: delay + 0.2 }}
            >
              &ldquo;
            </motion.div>

            {/* Quote Text */}
            <motion.blockquote
              className="text-lg leading-relaxed mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              <TypingText
                text={quote.quote}
                speed={30}
                delay={delay * 1000 + 500}
              />
            </motion.blockquote>

            {/* Author */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 1 }}
            >
              <div className="w-8 h-[1px] bg-[var(--color-primary)] opacity-30" />
              <span className="text-sm opacity-70 italic">
                {quote.author}
              </span>
            </motion.div>

            {/* Category Tag */}
            {quote.category && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 1.2 }}
              >
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 border border-[var(--color-accent-dim)] opacity-50">
                  {quote.category}
                </span>
              </motion.div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-sm opacity-50"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              LOADING WISDOM...
            </motion.div>
          </div>
        )}
      </div>
    </Panel>
  );
}
