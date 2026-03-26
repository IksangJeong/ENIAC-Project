"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlitchText, Clock, ConnectionStatus } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";

interface HeaderProps {
  isConnected?: boolean;
  className?: string;
}

export function Header({ isConnected = true, className }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    // API 호출 (옵션)
    await fetch("/api/auth/logout", { method: "POST" });
    
    // 클라이언트 상태 초기화
    logout();
    
    // 로그인 페이지로 리다이렉트
    router.push("/auth/login");
  };
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
        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 border border-cyan-500/30 rounded">
            <div className="text-right">
              <p className="text-xs font-mono text-cyan-400">{user.username}</p>
              <p className="text-[9px] text-cyan-500/70 uppercase tracking-wider">
                Online
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="ml-2 px-3 py-1 text-xs font-mono bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              LOGOUT
            </motion.button>
          </div>
        )}

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
