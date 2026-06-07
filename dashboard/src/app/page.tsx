"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  ClockQuotePanel,
  CompactStatsGrid,
  CommitPreview,
  AlgorithmSummary,
  ActiveNodesPreview,
  EventPreview,
} from "@/components/dashboard";
import {
  mockServerStatus,
  mockUsers,
  mockCommitRankings,
  mockQuote,
  mockChallenges,
} from "@/lib/mockData";
import { fetchServerStatus, fetchAnnouncements } from "@/lib/api";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useAuthStore } from "@/stores/authStore";
import type { ServerStatus as ServerStatusType } from "@/types";
import Link from "next/link";
import clsx from "clsx";

// 앱 탭 유지 동안 한 번만 실행되도록 하는 모듈 전역 변수
let dashboardInitialBootDone = false;

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();
  const { schedules, loadSchedules } = useScheduleStore();
  
  const [isConnected, setIsConnected] = useState(true);
  const [serverStatus, setServerStatus] = useState<ServerStatusType>(mockServerStatus);
  const [showBoot, setShowBoot] = useState(!dashboardInitialBootDone);
  const [liveMonitoring, setLiveMonitoring] = useState(true);

  // Load schedules on mount
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Sync server status via API polling (30s interval for mini PC safety)
  useEffect(() => {
    if (!liveMonitoring) return;

    const updateStatus = async () => {
      try {
        const status = await fetchServerStatus();
        setServerStatus(status);
      } catch (err) {
        console.error("Failed to sync server status:", err);
      }
    };

    // First load
    updateStatus();

    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, [liveMonitoring]);

  // Simulate connection status check (passive check, 20s interval)
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(Math.random() > 0.02);
    };
    const interval = setInterval(checkConnection, 20000);
    return () => clearInterval(interval);
  }, []);

  // Boot animation control
  useEffect(() => {
    if (!dashboardInitialBootDone) {
      const timer = setTimeout(() => {
        setShowBoot(false);
        dashboardInitialBootDone = true;
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <PageLayout activePage="dashboard" isConnected={isConnected}>
        <div className="lg:h-full grid gap-3 lg:gap-4 grid-rows-[auto_auto_auto] lg:grid-rows-[auto_1fr_1fr] pb-4 lg:pb-0">
          
          {/* Header Sub Bar / Controls */}
          <div className="flex justify-between items-center px-2 py-1.5 border-b border-[var(--color-primary)]/10 font-mono text-[9px] uppercase tracking-wider mb-1">
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text-secondary)]">// SYSTEM_NODE: ACTIVE</span>
              {user?.role === "admin" && (
                <Link href="/admin" className="text-amber-400 hover:underline font-bold animate-pulse">
                  [ADMIN_PANEL_ROOT]
                </Link>
              )}
            </div>
            
            <button 
              onClick={() => setLiveMonitoring(!liveMonitoring)}
              className={clsx(
                "px-2.5 py-0.5 border rounded-sm transition-all flex items-center gap-1.5 cursor-pointer",
                liveMonitoring 
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" 
                  : "border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10"
              )}
            >
              <span className={clsx("w-1.5 h-1.5 rounded-full", liveMonitoring ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              LIVE_MONITORING: {liveMonitoring ? "ACTIVE" : "SUSPENDED"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
            <div className="lg:col-span-8">
              <CompactStatsGrid data={serverStatus} delay={0.1} />
            </div>
            <div className="lg:col-span-4 hidden lg:block">
              <ClockQuotePanel quote={mockQuote} delay={0.2} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:min-h-0">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div className="min-h-[180px]">
                <CommitPreview rankings={mockCommitRankings} delay={0.3} />
              </div>
              <div className="min-h-[180px]">
                <AlgorithmSummary challenges={mockChallenges} delay={0.4} />
              </div>
            </div>
            <div className="lg:col-span-4 min-h-[180px]">
              <ActiveNodesPreview users={mockUsers} delay={0.5} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:min-h-0">
            <div className="hidden lg:block lg:col-span-8">
              <BroadcastPanel delay={0.6} />
            </div>
            <div className="lg:col-span-4 min-h-[180px]">
              <EventPreview schedules={schedules} delay={0.7} />
            </div>
          </div>
        </div>
      </PageLayout>

      {showBoot && <BootAnimation />}
    </>
  );
}

import type { Announcement } from "@/types";

function BroadcastPanel({ delay = 0 }: { delay?: number }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBroadcasts = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load broadcasts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBroadcasts();
    
    // Poll for new broadcasts every 30 seconds
    const interval = setInterval(loadBroadcasts, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-400";
      case "important": return "text-amber-400";
      default: return "text-cyan-400";
    }
  };

  return (
    <motion.div
      className="h-full border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)] p-3 rounded-sm panel-corners flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          System Broadcasts
        </h3>
        <svg className="w-4 h-4 text-[var(--color-primary)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {loading ? (
          <div className="h-full flex items-center justify-center py-6 text-center opacity-30 text-[9px] uppercase tracking-widest">
            Fetching Broadcasts...
          </div>
        ) : announcements.length > 0 ? (
          announcements.slice(0, 3).map((ann) => (
            <div 
              key={ann.id}
              className="border-b border-white/5 pb-2 last:border-b-0 last:pb-0 text-left font-mono"
            >
              <div className="flex justify-between items-center text-[8px] opacity-40 uppercase mb-0.5">
                <span>@{ann.author || "system"}</span>
                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 className={clsx("text-[10px] font-bold uppercase tracking-wide", getPriorityColor(ann.priority))}>
                [{ann.priority.toUpperCase()}] {ann.title}
              </h4>
              <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed line-clamp-2">
                {ann.content}
              </p>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center opacity-40 py-6">
              <motion.div
                className="w-6 h-6 mx-auto mb-1.5 border border-[var(--color-primary)]/20 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-1.5 h-1.5 bg-[var(--color-primary)]/30 rounded-full" />
              </motion.div>
              <p className="text-[9px] uppercase tracking-widest">
                Monitoring Active
              </p>
              <p className="text-[7px] text-[var(--color-text-secondary)] mt-0.5">
                No active broadcast packets detected
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BootAnimation() {
  const [phase, setPhase] = useState<"logo" | "loading" | "done">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("loading"), 1000);
    const loadingTimer = setTimeout(() => setPhase("done"), 2000);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[var(--color-bg-black)] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "done" ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: phase === "done" ? "none" : "auto" }}
    >
      <div className="text-center">
        {phase === "logo" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.h1
              className="text-5xl font-bold tracking-widest glow"
              animate={{
                textShadow: [
                  "0 0 10px var(--color-primary)",
                  "0 0 30px var(--color-primary)",
                  "0 0 10px var(--color-primary)",
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ENIAC
            </motion.h1>
            <motion.p
              className="text-xs tracking-[0.5em] mt-2 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3 }}
            >
              DASHBOARD
            </motion.p>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="text-xs tracking-wider opacity-70">
              INITIALIZING...
            </div>
            <div className="w-40 h-1 bg-[var(--color-accent-dim)] mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-primary)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
