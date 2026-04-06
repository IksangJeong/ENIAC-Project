"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={clsx(
        "flex-shrink-0 h-8",
        "px-4 md:px-6 lg:px-8",
        "border-t border-[var(--color-primary)]/10",
        "bg-[var(--color-bg-black)]",
        "flex items-center justify-between",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* System Info */}
      <div className="flex items-center gap-4 md:gap-6">
        <StatusItem label="Status" value="Stable" />
        <StatusItem label="Encryption" value="AES-256" className="hidden sm:flex" />
        <StatusItem label="Protocol" value="HTTPS/2" className="hidden md:flex" />
      </div>

      {/* Copyright */}
      <p className="text-[10px] text-[var(--color-text-secondary)]/60 font-mono">
        © {currentYear} ENIAC_OPS
      </p>
    </motion.footer>
  );
}

function StatusItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <span className="text-[10px] text-[var(--color-text-secondary)]/50 uppercase tracking-widest">
        {label}:
      </span>
      <span className="text-[10px] text-[var(--color-primary)]/70 uppercase tracking-wider">
        {value}
      </span>
    </div>
  );
}
