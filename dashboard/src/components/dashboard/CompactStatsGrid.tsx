"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { ServerStatus } from "@/types";

interface CompactStatsGridProps {
  data: ServerStatus | null;
  delay?: number;
  className?: string;
}

export function CompactStatsGrid({ data, delay = 0, className }: CompactStatsGridProps) {
  const stats = getStats(data);

  return (
    <motion.div
      className={clsx("grid grid-cols-2 gap-2 h-full", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} delay={delay + index * 0.05} />
      ))}
    </motion.div>
  );
}

interface Stat {
  label: string;
  value: string;
  subValue?: string;
  percent: number;
  icon: React.ReactNode;
}

interface StatCardProps {
  stat: Stat;
  delay: number;
}

function StatCard({ stat, delay }: StatCardProps) {
  return (
    <motion.div
      className={clsx(
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)]",
        "p-2.5 rounded-sm panel-corners",
        "hover:border-[var(--color-primary)]/30 transition-colors"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[8px] text-[var(--color-text-secondary)]/60 uppercase tracking-widest">
          {stat.label}
        </span>
        <span className="text-[var(--color-primary)]/30">{stat.icon}</span>
      </div>

      {/* Value */}
      <div className="mb-1.5">
        <span className="text-lg font-mono font-bold text-[var(--color-primary)]">
          {stat.value}
        </span>
        {stat.subValue && (
          <span className="text-[10px] text-[var(--color-text-secondary)]/50 ml-0.5">
            {stat.subValue}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[2px] bg-[var(--color-bg-black)] overflow-hidden">
        <motion.div
          className="h-full bg-[var(--color-primary)]"
          style={{ boxShadow: "0 0 8px var(--color-accent-glow)" }}
          initial={{ width: 0 }}
          animate={{ width: `${stat.percent}%` }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}

function getStats(data: ServerStatus | null): Stat[] {
  const cpuValue = data?.cpu ?? 0;
  const ramUsed = data?.ram.used ? data.ram.used / 1024 : 0;
  const ramTotal = data?.ram.total ? data.ram.total / 1024 : 32;
  const ramPercent = data?.ram.percentage ?? 0;
  const uptime = data?.uptime ?? 0;
  const days = Math.floor(uptime / 86400);
  const temp = data?.temperature ?? 0;

  const iconClass = "w-3 h-3";

  return [
    {
      label: "CPU",
      value: data ? `${cpuValue.toFixed(1)}%` : "--%",
      percent: cpuValue,
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      label: "RAM",
      value: data ? ramUsed.toFixed(1) : "--",
      subValue: data ? `/${ramTotal.toFixed(0)}GB` : undefined,
      percent: ramPercent,
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "UPTIME",
      value: data ? `${days}D` : "--D",
      percent: 100,
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "TEMP",
      value: data ? `${temp.toFixed(1)}°` : "--°",
      percent: temp,
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];
}
