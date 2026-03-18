"use client";

import { useState } from "react";
import { Panel, ProgressBar } from "@/components/ui";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { CommitRanking as CommitRankingType } from "@/types";

interface CommitRankingProps {
  rankings: CommitRankingType[];
  delay?: number;
}

type Period = "today" | "week";

export function CommitRanking({ rankings, delay = 0 }: CommitRankingProps) {
  const [period, setPeriod] = useState<Period>("today");

  const maxCommits = Math.max(...rankings.map((r) => r.commits), 1);

  return (
    <Panel
      title="COMMIT RANKING"
      subtitle="GITHUB"
      delay={delay}
      className="h-full"
    >
      {/* Period Toggle */}
      <div className="flex gap-2 mb-4">
        {(["today", "week"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={clsx(
              "px-3 py-1 text-[10px] uppercase tracking-wider transition-all",
              "border",
              period === p
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10"
                : "border-[var(--color-accent-dim)] opacity-50 hover:opacity-100"
            )}
          >
            {p === "today" ? "TODAY" : "THIS WEEK"}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.length > 0 ? (
          rankings.slice(0, 5).map((user, index) => (
            <motion.div
              key={user.userId}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 * index }}
            >
              {/* Rank Number */}
              <div
                className={clsx(
                  "w-6 h-6 flex items-center justify-center text-sm font-bold",
                  index === 0 && "text-[var(--color-warning)] glow",
                  index === 1 && "text-[var(--color-primary)]",
                  index === 2 && "text-[var(--color-info)]",
                  index > 2 && "opacity-50"
                )}
              >
                {user.rank}
              </div>

              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className={clsx(
                    "w-8 h-8 rounded-full border",
                    index === 0
                      ? "border-[var(--color-warning)]"
                      : "border-[var(--color-accent-glow)]"
                  )}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-xs">
                  {user.username[0].toUpperCase()}
                </div>
              )}

              {/* User Info & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm truncate">{user.username}</span>
                  <span className="text-sm font-mono flex items-center gap-1">
                    {user.commits}
                    {user.trend && (
                      <TrendIcon trend={user.trend} />
                    )}
                  </span>
                </div>
                <ProgressBar
                  value={user.commits}
                  max={maxCommits}
                  showValue={false}
                  size="sm"
                  variant={index === 0 ? "success" : "default"}
                />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 opacity-50">
            <div className="text-2xl mb-2">0</div>
            <div className="text-xs">NO COMMITS YET</div>
          </div>
        )}
      </div>

      {/* Total Stats */}
      {rankings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--color-accent-dim)]">
          <div className="flex justify-between text-xs">
            <span className="opacity-50">TOTAL COMMITS</span>
            <span className="font-mono">
              {rankings.reduce((acc, r) => acc + r.commits, 0)}
            </span>
          </div>
        </div>
      )}
    </Panel>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up") {
    return (
      <motion.span
        className="text-[var(--color-success)] text-xs"
        initial={{ y: 5 }}
        animate={{ y: 0 }}
      >
        ↑
      </motion.span>
    );
  }
  if (trend === "down") {
    return (
      <motion.span
        className="text-[var(--color-error)] text-xs"
        initial={{ y: -5 }}
        animate={{ y: 0 }}
      >
        ↓
      </motion.span>
    );
  }
  return null;
}
