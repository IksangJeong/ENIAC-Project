"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { useAuthStore } from "@/stores/authStore";
import { 
  NodeRegistry, 
  ClusterControl, 
  MissionScheduler, 
  BroadcastCenter, 
  SystemCore 
} from "@/components/admin";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

type AdminTab = "node_registry" | "cluster_control" | "mission_scheduler" | "broadcast_center" | "system_core";

function AdminPageContent() {
  const router = useRouter();
  const { user, loadMembers, members } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("node_registry");

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Admin access validation
  useEffect(() => {
    if (user && user.clearance !== "root" && user.clearance !== "officer") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || (user.clearance !== "root" && user.clearance !== "officer")) {
    return null; // Let the validation redirect take care of it
  }

  const isRoot = user.clearance === "root";
  const pendingCount = members.filter(m => !m.isApproved).length;

  const tabItems = [
    { id: "node_registry" as const, label: "NODE_REGISTRY", count: pendingCount > 0 ? pendingCount : undefined },
    { id: "cluster_control" as const, label: "CLUSTER_CONTROL" },
    { id: "mission_scheduler" as const, label: "MISSION_SCHEDULER" },
    { id: "broadcast_center" as const, label: "BROADCAST_CENTER" },
    ...(isRoot ? [{ id: "system_core" as const, label: "SYSTEM_CORE" }] : []),
  ];

  return (
    <PageLayout activePage="dashboard">
      <div className="max-w-6xl mx-auto space-y-8 pb-20 font-mono">
        
        {/* Header */}
        <div className={clsx(
          "border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4",
          isRoot ? "border-amber-500/20" : "border-cyan-500/20"
        )}>
          <div>
            <h1 className={clsx(
              "text-3xl font-black tracking-tighter uppercase mb-1 flex items-center gap-3",
              isRoot ? "text-amber-500" : "text-cyan-400"
            )}>
              <span className={clsx("w-3 h-3 animate-pulse", isRoot ? "bg-amber-500" : "bg-cyan-500")} />
              {isRoot ? "SYSTEM_ADMIN_CORE" : "CLUB_OFFICER_CORE"}
            </h1>
            <p className={clsx(
              "text-[10px] uppercase tracking-[0.3em]",
              isRoot ? "text-amber-500/60" : "text-cyan-400/60"
            )}>
              {isRoot ? "// ROOT_SECURITY_GATEWAY" : "// CLUB_OPERATIONS_GATEWAY"}
            </p>
          </div>
          
          <Link 
            href="/"
            className={clsx(
              "px-3 py-1.5 border text-[9px] uppercase tracking-wider transition-colors font-bold",
              isRoot 
                ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10" 
                : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            )}
          >
            [EXIT_ADMIN_CORE]
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={clsx(
            "border p-6 rounded-sm relative overflow-hidden flex flex-col justify-between h-32",
            isRoot ? "border-amber-500/20 bg-amber-500/5" : "border-cyan-500/20 bg-cyan-500/5"
          )}>
            <div>
              <p className={clsx(
                "text-[9px] uppercase tracking-widest font-bold",
                isRoot ? "text-amber-500/60" : "text-cyan-400/60"
              )}>NODE DIRECTORY POOL</p>
              <h3 className="text-4xl font-bold text-white mt-2">{members.length}</h3>
            </div>
            <span className={clsx(
              "text-[8px]",
              isRoot ? "text-amber-500/40" : "text-cyan-400/40"
            )}>// TOTAL_REGISTERED_IDENTITIES</span>
          </div>

          <button 
            onClick={() => setActiveTab("node_registry")}
            className={clsx(
              "border p-6 rounded-sm relative overflow-hidden flex flex-col justify-between h-32 text-left transition-all active:scale-98 cursor-pointer",
              pendingCount > 0 
                ? "border-red-500/40 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-500/60" 
                : isRoot 
                  ? "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30" 
                  : "border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/30"
            )}
          >
            <div>
              <p className={clsx(
                "text-[9px] uppercase tracking-widest font-bold",
                pendingCount > 0 ? "text-red-400" : isRoot ? "text-amber-500/60" : "text-cyan-400/60"
              )}>PENDING_ACTIVATIONS</p>
              <h3 className={clsx("text-4xl font-bold mt-2", pendingCount > 0 ? "text-red-500 animate-pulse" : "text-white")}>
                {pendingCount}
              </h3>
            </div>
            <span className="text-[9px] underline font-bold uppercase tracking-widest text-neutral-400 hover:text-white">
              {pendingCount > 0 ? "> OPEN APPROVAL QUEUE" : "// REGISTRY STABLE"}
            </span>
          </button>

          <div className={clsx(
            "border p-6 rounded-sm relative overflow-hidden flex flex-col justify-between h-32",
            isRoot ? "border-amber-500/20 bg-amber-500/5" : "border-cyan-500/20 bg-cyan-500/5"
          )}>
            <div>
              <p className={clsx(
                "text-[9px] uppercase tracking-widest font-bold",
                isRoot ? "text-amber-500/60" : "text-cyan-400/60"
              )}>SYSTEM OVERSEER Clearance</p>
              <h3 className={clsx(
                "text-lg font-black mt-3 uppercase tracking-widest",
                isRoot ? "text-amber-400" : "text-cyan-400"
              )}>● {isRoot ? "ROOT_ACCESS" : "OFFICER_ACCESS"}</h3>
            </div>
            <span className={clsx(
              "text-[8px]",
              isRoot ? "text-amber-500/40" : "text-cyan-400/40"
            )}>// SECURE_SESSION: CONTEXT_OK</span>
          </div>
        </div>

        {/* Cyber Console Tabs Switcher */}
        <div className={clsx(
          "flex flex-wrap border-b",
          isRoot ? "border-amber-500/20" : "border-cyan-500/20"
        )}>
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-6 py-3.5 text-xs font-bold uppercase tracking-widest border-t border-x -mb-[1px] transition-all relative",
                activeTab === tab.id
                  ? isRoot 
                    ? "bg-amber-500/5 text-amber-400 border-amber-500/30 border-b-black"
                    : "bg-cyan-500/5 text-cyan-400 border-cyan-500/30 border-b-[var(--color-bg-black)]"
                  : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-300"
              )}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="activeTabGlow"
                  className={clsx(
                    "absolute top-0 left-0 right-0 h-[2px]",
                    isRoot ? "bg-amber-500" : "bg-cyan-500"
                  )}
                />
              )}
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 bg-red-500 text-black text-[9px] font-black rounded-sm animate-pulse">
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Console Output Screen */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "node_registry" && <NodeRegistry />}
              {activeTab === "cluster_control" && <ClusterControl />}
              {activeTab === "mission_scheduler" && <MissionScheduler />}
              {activeTab === "broadcast_center" && <BroadcastCenter />}
              {activeTab === "system_core" && <SystemCore />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </PageLayout>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
