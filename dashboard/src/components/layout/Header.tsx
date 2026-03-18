"use client";

import { motion } from "framer-motion";
import { GlitchText, Clock, ConnectionStatus } from "@/components/ui";
import clsx from "clsx";

interface HeaderProps {
  isConnected?: boolean;
  className?: string;
}

export function Header({ isConnected = true, className }: HeaderProps) {
  return (
    <motion.header
      className={clsx(
        "flex items-center justify-between px-4 py-3",
        "border-b border-[var(--color-accent-glow)]",
        "bg-[var(--color-bg-black)] bg-opacity-90",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <motion.div
            className="w-8 h-8 border border-[var(--color-primary)] flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 5px var(--color-accent-glow)",
                "0 0 15px var(--color-accent-glow)",
                "0 0 5px var(--color-accent-glow)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-bold">E</span>
          </motion.div>

          {/* Title */}
          <div className="flex flex-col">
            <GlitchText
              text="ENIAC"
              as="h1"
              className="text-xl font-bold tracking-widest glow"
              glitchOnHover
              glitchInterval={10000}
            />
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-50 -mt-1">
              Dashboard
            </span>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <div className="w-24 h-[1px] bg-gradient-to-r from-[var(--color-primary)] to-transparent opacity-30" />
          <div className="w-2 h-2 border border-[var(--color-primary)] opacity-30 rotate-45" />
        </div>
      </div>

      {/* Center - System Info (Hidden on mobile) */}
      <div className="hidden lg:flex items-center gap-8">
        <SystemInfo label="SYSTEM" value="ACTIVE" />
        <SystemInfo label="MODE" value="REAL-TIME" />
        <SystemInfo label="VERSION" value="1.0.0" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <ConnectionStatus isConnected={isConnected} />

        {/* Decorative Line */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 border border-[var(--color-primary)] opacity-30 rotate-45" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-[var(--color-primary)] to-transparent opacity-30" />
        </div>

        {/* Clock */}
        <Clock format="24h" showSeconds size="sm" />
      </div>
    </motion.header>
  );
}

// System Info Component
function SystemInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] uppercase tracking-wider opacity-50">
        {label}
      </span>
      <span className="text-xs font-mono tracking-wider">{value}</span>
    </div>
  );
}
