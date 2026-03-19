"use client";

import { Panel, ProgressBar, CircularProgress, PointMap } from "@/components/ui";
import { motion } from "framer-motion";
import type { ServerStatus as ServerStatusType } from "@/types";

interface ServerStatusProps {
  data: ServerStatusType | null;
  delay?: number;
}

export function ServerStatus({ data, delay = 0 }: ServerStatusProps) {
  const cpuVariant =
    !data
      ? "default"
      : data.cpu > 80
      ? "error"
      : data.cpu > 60
      ? "warning"
      : "default";

  const ramVariant =
    !data
      ? "default"
      : data.ram.percentage > 80
      ? "error"
      : data.ram.percentage > 60
      ? "warning"
      : "default";

  return (
    <Panel
      title="SERVER STATUS"
      subtitle="SYSTEM"
      delay={delay}
      className="h-full"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* CPU Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider opacity-70">
              CPU
            </span>
            <span className="text-sm font-mono">
              {data?.cpu.toFixed(1) ?? "--"}%
            </span>
          </div>
          <ProgressBar
            value={data?.cpu ?? 0}
            showValue={false}
            variant={cpuVariant}
            size="md"
          />

          {/* CPU Graph Placeholder - Shorter on mobile */}
          <div className="mt-2 h-10 sm:h-12 border border-[var(--color-accent-dim)] relative overflow-hidden">
            <CPUGraph value={data?.cpu ?? 0} />
          </div>
        </div>

        {/* RAM Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider opacity-70">
              MEMORY
            </span>
            <span className="text-xs sm:text-sm font-mono">
              {data
                ? `${(data.ram.used / 1024).toFixed(1)} / ${(data.ram.total / 1024).toFixed(1)} GB`
                : "-- / -- GB"}
            </span>
          </div>
          {/* PointMap - Smaller grid on mobile for performance */}
          <div className="hidden sm:block">
            <PointMap
              value={data?.ram.percentage ?? 0}
              rows={6}
              cols={24}
              className="mb-2"
            />
          </div>
          <div className="block sm:hidden">
            <PointMap
              value={data?.ram.percentage ?? 0}
              rows={4}
              cols={16}
              className="mb-2"
            />
          </div>
          <ProgressBar
            value={data?.ram.percentage ?? 0}
            showValue={false}
            variant={ramVariant}
            size="sm"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-[var(--color-accent-dim)]">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-50 block mb-1">
              UPTIME
            </span>
            <span className="text-xs sm:text-sm font-mono">
              {data ? formatUptime(data.uptime) : "--:--:--"}
            </span>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-50 block mb-1">
              TEMP
            </span>
            <span className="text-xs sm:text-sm font-mono">
              {data?.temperature ? `${data.temperature}°C` : "--°C"}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// Simple CPU Graph Component
function CPUGraph({ value }: { value: number }) {
  return (
    <svg className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M 0 ${48 - (value / 100) * 48} L 100 ${48 - (value / 100) * 48} L 100 48 L 0 48 Z`}
        fill="url(#cpuGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.line
        x1="0"
        y1={48 - (value / 100) * 48}
        x2="100%"
        y2={48 - (value / 100) * 48}
        stroke="var(--color-primary)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
