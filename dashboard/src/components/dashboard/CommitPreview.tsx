"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { CommitRanking } from "@/types";

interface CommitPreviewProps {
  rankings: CommitRanking[];
  delay?: number;
  className?: string;
}

export function CommitPreview({ rankings, delay = 0, className }: CommitPreviewProps) {
  const top3 = rankings.slice(0, 3);

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
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Commit Leaders
        </h3>
        <svg className="w-4 h-4 text-[var(--color-primary)]/40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>

      {/* Top 3 List */}
      <div className="flex-1 space-y-2 min-h-0">
        {top3.length > 0 ? (
          top3.map((user, index) => (
            <motion.div
              key={user.userId}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 * index }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Rank */}
                <span
                  className={clsx(
                    "text-[12px] font-mono w-4",
                    index === 0 ? "text-[var(--color-warning)]" : "text-[var(--color-text-secondary)]/60"
                  )}
                >
                  {String(user.rank).padStart(2, "0")}
                </span>

                {/* Avatar */}
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-[11px]",
                    index === 0
                      ? "border-[var(--color-warning)]/50"
                      : "border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]"
                  )}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                  ) : (
                    user.username[0].toUpperCase()
                  )}
                </div>

                {/* Name */}
                <span className="text-[12px] font-bold truncate">
                  {user.username.toUpperCase()}
                </span>
              </div>

              {/* Commits */}
              <span className="font-mono text-[12px] text-[var(--color-primary)]">
                {user.commits}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full opacity-50">
            <span className="text-[11px]">NO DATA</span>
          </div>
        )}
      </div>

      {/* View All Link */}
      <Link
        href="/github"
        className={clsx(
          "mt-2 py-1.5 text-center",
          "text-[11px] uppercase tracking-widest",
          "border border-[var(--color-primary)]/20",
          "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-black)]",
          "transition-all duration-300"
        )}
      >
        View All →
      </Link>
    </motion.div>
  );
}
