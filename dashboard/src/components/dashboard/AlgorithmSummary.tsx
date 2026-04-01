"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { AlgorithmChallenge } from "@/types";

interface AlgorithmSummaryProps {
  challenges: AlgorithmChallenge[];
  delay?: number;
  className?: string;
}

export function AlgorithmSummary({ challenges, delay = 0, className }: AlgorithmSummaryProps) {
  const totalSolved = challenges.reduce((acc, challenge) => {
    return acc + challenge.participants.filter((p) => p.solved).length;
  }, 0);

  const hasActiveChallenge = challenges.some((c) => c.status === "in_progress");
  const weeklyStreak = 12;
  const successRate = 78.4;

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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Algorithm
        </h3>
        <svg className="w-4 h-4 text-[var(--color-primary)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>

      {/* Circular Progress + Stats */}
      <div className="flex-1 flex items-center gap-3 min-h-0">
        {/* Mini Circular */}
        <div className="relative w-16 h-16 shrink-0">
          <div className="absolute inset-0 border border-[var(--color-primary)]/10 rounded-full" />
          <motion.div
            className="absolute inset-1 border border-[var(--color-primary)]/20 rounded-full"
            style={{ borderTopColor: "var(--color-primary)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-mono font-bold text-[var(--color-primary)]">
                {totalSolved || 852}
              </p>
              <p className="text-[9px] text-[var(--color-text-secondary)] uppercase">
                Solved
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[var(--color-text-secondary)]">STREAK</span>
            <span className="text-[12px] font-mono text-[var(--color-primary)]">{weeklyStreak}D</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[var(--color-text-secondary)]">SUCCESS</span>
            <span className="text-[12px] font-mono text-[var(--color-primary)]">{successRate}%</span>
          </div>
          {hasActiveChallenge && (
            <div className="flex items-center gap-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className="text-[10px] uppercase text-[var(--color-error)]">
                Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* View All Link */}
      <Link
        href="/algorithm"
        className={clsx(
          "mt-2 py-1.5 text-center",
          "text-[11px] uppercase tracking-widest",
          "border border-[var(--color-primary)]/20",
          "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-black)]",
          "transition-all duration-300"
        )}
      >
        View Challenges →
      </Link>
    </motion.div>
  );
}
