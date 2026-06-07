"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import { GlitchText } from "@/components/ui";
import { signOut } from "next-auth/react";
import clsx from "clsx";

interface LogMessage {
  text: string;
  type: "info" | "success" | "warn" | "error" | "code";
  time: string;
}

export function AwaitingApproval() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Generate initial simulated terminal logs
  useEffect(() => {
    if (!user) return;

    const initialLogs: LogMessage[] = [
      { text: "INITIALIZING SECURITY PROTOCOLS...", type: "info", time: "00:01" },
      { text: `NODE IDENTIFIED: ${user.username.toUpperCase()} (ID: ${user.id})`, type: "success", time: "00:02" },
      { text: `IP CONTEXT SYNCED. CLASS MESH ENIAC NETWORKED.`, type: "info", time: "00:03" },
      { text: "CHECKING ACCESS PERMISSIONS...", type: "info", time: "00:04" },
      { text: "ACCESS CRITERIA: APPROVED=FALSE", type: "warn", time: "00:05" },
      { text: "STATUS: AWAITING ADMIN ACTIVATION", type: "error", time: "00:06" },
      { text: "RUNNING BACKGROUND HANDSHAKE SYNCHRONIZER...", type: "code", time: "00:07" },
    ];

    setLogs(initialLogs);
  }, [user]);

  // Scroll logs to bottom when updated
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: LogMessage["type"]) => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { text, type, time }]);
  };

  const handleCheckStatus = async () => {
    if (!user || checking) return;
    setChecking(true);
    setCheckResult(null);
    addLog(`PINGING AUTHORIZATION SERVER: /api/auth/status?userId=${user.id}`, "code");

    try {
      const response = await fetch(`/api/auth/status?userId=${user.id}`);
      if (!response.ok) throw new Error("NETWORK_NODE_OFFLINE");

      const data = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Cool loading delay

      if (data.isApproved) {
        addLog("RESPONSE RECEIVED: ACCESS_GRANTED. DIRECTING TO GATEWAY...", "success");
        updateUser({ isApproved: true });
        router.push("/");
      } else {
        addLog("RESPONSE RECEIVED: ACCESS_DENIED. NODE_INACTIVE_PENDING_ADMIN.", "error");
        setCheckResult("INACTIVE");
      }
    } catch (err) {
      addLog("CONNECTION TIMEOUT. SECURITY LAYER DROPPED PACKET.", "error");
      setCheckResult("ERROR");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    addLog("SHUTTING DOWN CRYPTOGRAPHIC WORKSPACE...", "warn");
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Sign out next auth if relevant
    await signOut({ redirect: false });
    // Sign out internal API
    await fetch("/api/auth/logout", { method: "POST" });
    // Clear Zustand store
    logout();
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="h-screen w-full bg-[var(--color-bg-black)] text-[var(--color-primary)] font-mono relative overflow-hidden flex flex-col p-4 md:p-8 select-none">
      {/* Background CRT scanline and noise effects */}
      <div className="absolute inset-0 pointer-events-none scanline z-[60] opacity-[0.15]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] z-[55] bg-[url('https://res.cloudinary.com/djne76asw/image/upload/v1624442144/noise_vv6vsm.png')]" />

      {/* Grid cyber mesh background */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`, 
                    backgroundSize: '100px 100px' }} />

      <header className="flex justify-between items-center border-b border-[var(--color-primary)]/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-red-500 animate-ping rounded-full" />
          <GlitchText text="RESTRICTED_ACCESS_ROOM" as="h1" className="text-base md:text-lg font-black tracking-widest text-red-500" />
        </div>
        <div className="text-[10px] opacity-50 uppercase hidden md:block">
          ENIAC SECURE CORE SERVER // PORT 4080
        </div>
      </header>

      {/* Content layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 overflow-hidden relative z-10 min-h-0">
        
        {/* Terminal Log Console */}
        <div className="lg:col-span-8 border border-[var(--color-primary)]/20 bg-black/70 p-4 flex flex-col rounded-sm relative overflow-hidden h-full">
          <div className="flex justify-between items-center text-[10px] text-[var(--color-primary)]/40 uppercase mb-3 font-bold border-b border-[var(--color-primary)]/10 pb-2">
            <span>Terminal Live Status Logs</span>
            <span className="animate-pulse">● FEED_ONLINE</span>
          </div>

          <div 
            ref={logContainerRef}
            className="flex-1 overflow-y-auto space-y-2 text-xs custom-scrollbar pr-2 leading-relaxed"
          >
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-[var(--color-primary)]/30 font-bold">[{log.time}]</span>
                <span className={clsx(
                  "font-mono",
                  log.type === "success" && "text-emerald-400 font-bold",
                  log.type === "warn" && "text-amber-400 font-bold",
                  log.type === "error" && "text-red-500 font-bold",
                  log.type === "code" && "text-cyan-400 font-mono",
                  log.type === "info" && "text-[var(--color-primary)]/80"
                )}>
                  {log.type === "code" ? "> " : ""}
                  {log.text}
                </span>
              </div>
            ))}
            
            {checking && (
              <div className="flex gap-2 items-center text-cyan-400 font-bold animate-pulse">
                <span>[{new Date().toLocaleTimeString("en-US", { hour12: false })}]</span>
                <span>&gt; TRANSMITTING ENCRYPTION KEYS... PLEASE WAIT</span>
              </div>
            )}
          </div>

          {/* Glowing bottom indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/10 to-transparent" />
        </div>

        {/* Status Card & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full justify-between">
          
          {/* Cybernetic Status Core */}
          <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-sm space-y-6 text-center relative overflow-hidden flex-1 flex flex-col justify-center">
            {/* Spinning cyber logo background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border-4 border-dashed border-red-500 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-500/60 font-bold">NODE_STATUS</h2>
              <div className="text-3xl font-black text-red-500 tracking-wider uppercase animate-pulse">
                AWAITING_APPROVAL
              </div>
            </div>

            <div className="w-24 h-24 mx-auto rounded-full border border-red-500/30 flex items-center justify-center relative bg-black/40">
              <div className="absolute inset-2 border border-red-500/10 rounded-full animate-ping" />
              <motion.div 
                className="w-12 h-12 bg-red-500/10 border border-red-500/60 rounded-full flex items-center justify-center text-red-500 font-bold text-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔒
              </motion.div>
            </div>

            <div className="text-[10px] text-gray-400 font-mono max-w-xs mx-auto leading-relaxed uppercase">
              // Your account is registered. An administrator must activate your node before you can access the central network.
            </div>

            {checkResult === "INACTIVE" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-red-500 bg-red-500/10 rounded-sm text-red-400 font-mono text-[10px] uppercase font-bold"
              >
                // ALERT: Node remains inactive. Please contact system admin.
              </motion.div>
            )}
          </div>

          {/* Action Buttons Panel */}
          <div className="border border-[var(--color-primary)]/20 bg-black/60 p-4 rounded-sm space-y-3 relative z-10 flex-shrink-0">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-2">SYSTEM_COMMANDS</h3>
            
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className={clsx(
                "w-full py-3 border font-mono text-[11px] uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2",
                checking 
                  ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/5" 
                  : "border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] active:scale-98 cursor-pointer"
              )}
            >
              {checking ? (
                <>
                  <span className="w-2.5 h-2.5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin" />
                  PINGING_SERVER...
                </>
              ) : (
                "[PING_COMMAND_NODE] (CHECK STATUS)"
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 border border-red-500/30 hover:border-red-500 text-red-500 hover:bg-red-500/10 text-[11px] font-mono uppercase tracking-widest transition-all active:scale-98 cursor-pointer"
            >
              "[TERMINATE_SESSION] (LOGOUT)"
            </button>
          </div>

        </div>

      </main>

      <footer className="border-t border-[var(--color-primary)]/10 pt-4 flex justify-between items-center text-[8px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em] relative z-10">
        <div>CODENAME: ENIAC_V2_HUD // LOCALHOST_VERIFICATION</div>
        <div>AUTHORIZED ACCESS ONLY</div>
      </footer>
    </div>
  );
}
