"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { ServerStatus } from "@/types";
import { fetchServerStatus } from "@/lib/api";
import { motion } from "framer-motion";
import clsx from "clsx";

export function SystemCore() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const isRoot = user?.clearance === "root";

  // Telemetry fetcher
  useEffect(() => {
    if (!isRoot) return;

    const syncStatus = async () => {
      try {
        const data = await fetchServerStatus();
        setStatus(data);
      } catch (err) {
        console.error(err);
      }
    };

    syncStatus();
    const interval = setInterval(syncStatus, 4000);
    return () => clearInterval(interval);
  }, [isRoot]);

  // Terminal log stream generator
  useEffect(() => {
    if (!isRoot) return;

    const initialLogs = [
      "SYSTEM CORE INITIALIZED: ONLINE // VERSION 2.0.8",
      "CORE_TEMP_SENSOR: ACTIVE (STABLE)",
      "SWAP_MEM_DAEMON: ACTIVE ON LOCAL MESH",
      "NETWORK GATEWAY: PORT 4080 TRANSMITTING OK",
      "DB SYNCHRONIZER: PERSISTING ACTIVE SESSIONS...",
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const randomLogs = [
        "HEARTBEAT: DIAGNOSTIC POOL STABILIZED",
        "SECURITY: RE-KEYING ENCRYPTION SESSION KEYS...",
        "PORT MESH: DATA SEGMENTS TRANSMITTED SUCCESSFULLY",
        "DAEMON: OPTIMIZING LOCAL STORAGE CACHE SECTOR...",
        "RESOURCES: MEMORY POOL SYNC COMPLETED",
      ];
      const selected = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs((prev) => [...prev.slice(-12), `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] > ${selected}`]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isRoot]);

  if (!isRoot) {
    return (
      <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-sm font-mono text-center space-y-4">
        <h2 className="text-red-500 text-lg font-black tracking-widest uppercase animate-pulse">
          !! ACCESS DENIED // SECURITY PROTOCOL INTRUSION ALERT !!
        </h2>
        <p className="text-xs text-red-400 max-w-md mx-auto uppercase">
          Your current security clearance level is unauthorized to access low-level CPU registry gates or maintenance diagnostics.
        </p>
      </div>
    );
  }

  // Convert Uptime to days, hours, mins
  const formatUptime = (seconds?: number) => {
    if (!seconds) return "0s";
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Sub Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-widest">
            [SYSTEM_CORE_DIAGNOSTICS]
          </h2>
          <p className="text-[10px] text-amber-500/60 mt-1 uppercase">// ROOT_LEVEL COMMAND CONSOLE & MINI PC TELEMETRY</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-sm flex flex-col justify-between h-28 font-mono">
          <div>
            <p className="text-[8px] text-amber-500/60 uppercase tracking-widest font-bold">CPU LOGICAL REGISTRY</p>
            <h4 className="text-3xl font-black text-white mt-1.5">{status?.cpu?.toFixed(1) || "0.0"}%</h4>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${status?.cpu || 0}%` }} />
          </div>
        </div>

        <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-sm flex flex-col justify-between h-28 font-mono">
          <div>
            <p className="text-[8px] text-amber-500/60 uppercase tracking-widest font-bold">PHYSICAL RAM CORE</p>
            <h4 className="text-3xl font-black text-white mt-1.5">{status?.ram?.percentage?.toFixed(1) || "0.0"}%</h4>
          </div>
          <div className="text-[9px] text-amber-500/40 flex justify-between">
            <span>USED: {status?.ram ? (status.ram.used / 1024).toFixed(1) : "0.0"} GB</span>
            <span>TOTAL: {status?.ram ? (status.ram.total / 1024).toFixed(1) : "0.0"} GB</span>
          </div>
        </div>

        <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-sm flex flex-col justify-between h-28 font-mono">
          <div>
            <p className="text-[8px] text-amber-500/60 uppercase tracking-widest font-bold">CORE TEMPERATURE</p>
            <h4 className={clsx("text-3xl font-black mt-1.5", (status?.temperature || 0) > 65 ? "text-red-500" : "text-white")}>
              {status?.temperature || "0"}°C
            </h4>
          </div>
          <p className="text-[8px] text-amber-500/40">// THERMAL PROFILE: STABLE</p>
        </div>

        <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-sm flex flex-col justify-between h-28 font-mono">
          <div>
            <p className="text-[8px] text-amber-500/60 uppercase tracking-widest font-bold">SYSTEM UPTIME MESH</p>
            <h4 className="text-lg font-bold text-white mt-3 uppercase tracking-wider">{formatUptime(status?.uptime)}</h4>
          </div>
          <p className="text-[8px] text-amber-500/40">// CONTINUOUS OPERATION TIME</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low level console log - Expanded to full 12 cols */}
        <div className="lg:col-span-12 border border-amber-500/20 bg-black/90 p-5 rounded-sm flex flex-col font-mono relative h-[320px]">
          <div className="absolute inset-0 pointer-events-none scanline opacity-5" />
          <div className="flex justify-between items-center text-[9px] text-amber-500/50 uppercase mb-3 font-bold border-b border-amber-500/10 pb-2">
            <span>LOW_LEVEL DIAGNOSTIC TERMINAL LOGS</span>
            <span className="text-amber-500 animate-pulse">● FEED_ONLINE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-xs text-amber-500/80 custom-scrollbar pr-1 leading-relaxed">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
