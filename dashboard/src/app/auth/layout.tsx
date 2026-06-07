"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { GlitchText } from "@/components/ui";

const TYPING_SENTENCES = [
  "Initializing secure node link...",
  "Synchronizing with core cluster...",
  "Verifying cryptographic identity...",
  "Loading secure environment v4.2...",
  "Status: Awaiting node credentials...",
  "Monitoring active network load...",
];

const LOG_LINES = [
  "[SYSTEM] KERNEL_V4.2_LOADED",
  "[NET] HANDSHAKE_INIT_PORT_8080",
  "[AUTH] CRYPTO_SERVICE_STABLE",
  "[SEC] FIREWALL_LEVEL_4_ACTIVE",
  "[SYNC] CLUSTER_REPLICATION_OK",
  "[NODE] EXTERNAL_LINK_STANDBY",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const [displayText, setDisplayText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const currentSentence = TYPING_SENTENCES[sentenceIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentSentence.substring(0, displayText.length + 1));
        setTypingSpeed(70);
        if (displayText === currentSentence) {
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentSentence.substring(0, displayText.length - 1));
        setTypingSpeed(30);
        if (displayText === "") {
          setIsDeleting(false);
          setSentenceIndex((prev) => (prev + 1) % TYPING_SENTENCES.length);
          setTypingSpeed(50);
        }
      }
    }, typingSpeed);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [mouseX, mouseY, displayText, isDeleting, sentenceIndex, typingSpeed]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-black)] relative overflow-hidden font-mono flex flex-col custom-scrollbar select-none text-[var(--color-primary)]">
      
      {/* 1. LAYER: INTERACTIVE GLOW */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at var(--x) var(--y), rgba(var(--color-primary-rgb), 0.07), transparent)`,
          // @ts-ignore
          "--x": springX ? `${springX.get()}px` : "50%",
          "--y": springY ? `${springY.get()}px` : "50%",
        }}
      />

      {/* 2. LAYER: FIXED BACKGROUND HUD */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 scanline opacity-[0.15] z-50" />
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`, 
                      backgroundSize: '100px 100px' }} />
      </div>

      {/* 3. MAIN CONTENT LAYER */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 lg:p-10">
        
        {/* MOBILE HEADER: Only visible when left panel is hidden */}
        <div className="lg:hidden w-full max-w-sm mb-8 flex items-center justify-between opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--color-primary)] flex items-center justify-center text-sm font-black">E</div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">ENIAC_STATION</span>
          </div>
          <div className="flex items-center gap-2 text-[8px]">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            SECURE_LINK
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl h-[700px] max-h-[90vh] bg-black/40 backdrop-blur-2xl border border-[var(--color-primary)]/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row overflow-hidden rounded-sm"
        >
          {/* LEFT: Branding & Diagnostic (Hidden on Mobile/Tablet) */}
          <div className="hidden lg:flex flex-[0.8] p-8 lg:p-12 border-r border-[var(--color-primary)]/10 bg-black/20 flex-col relative overflow-hidden shrink-0">
            
            {/* [TOP] Static Branding */}
            <div className="space-y-2 relative z-10">
              <div className="w-10 h-10 border border-[var(--color-primary)] flex items-center justify-center text-xl font-black">E</div>
              <GlitchText text="ENIAC_GATEWAY" as="h1" className="text-3xl lg:text-4xl font-black tracking-tighter" />
              <p className="text-[10px] text-[var(--color-primary)]/50 tracking-[0.3em] uppercase font-bold">Secure Access Terminal</p>
            </div>

            {/* [CENTER] Diagnostic Terminal */}
            <div className="flex-1 flex flex-col justify-start relative mt-16">
              <div className="absolute inset-0 opacity-[0.05] overflow-hidden pointer-events-none space-y-1">
                {Array(20).fill(0).map((_, i) => (
                  <motion.p key={i} initial={{ x: -20 }} animate={{ x: 0 }} className="text-[8px] whitespace-nowrap">
                    {LOG_LINES[i % LOG_LINES.length]} // UUID_{Math.random().toString(16).slice(2, 8).toUpperCase()} // STATUS_OK
                  </motion.p>
                ))}
              </div>

              <div className="relative z-10 space-y-6 pt-4">
                <div className="inline-block relative">
                  <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-[var(--color-primary)]/40" />
                  <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-[var(--color-primary)]/40" />
                  
                  <div className="p-4 bg-[var(--color-primary)]/[0.03] border border-[var(--color-primary)]/10 min-w-[300px]">
                    <div className="flex items-center gap-2 mb-2 text-[8px] opacity-40 font-bold tracking-widest">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      LIVE_SYSTEM_DIAGNOSTIC
                    </div>
                    <p className="text-sm lg:text-lg text-emerald-400 font-bold uppercase tracking-widest flex items-center min-h-[1.5em]">
                      <span className="mr-3 opacity-50 text-xs text-[var(--color-primary)]">#</span>
                      {displayText}
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-2 h-4 bg-emerald-500 ml-2" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* [FIXED ANCHOR] Waveform Visualization */}
            <div className="absolute bottom-24 left-0 right-0 px-8 lg:px-12 pointer-events-none">
              <div className="flex items-end gap-1 h-8 opacity-40">
                {Array(48).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-[var(--color-primary)]/30"
                    animate={{ height: [2, Math.random() * 24 + 2, 2] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.02 }}
                  />
                ))}
              </div>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
            </div>

            {/* [BOTTOM] System Metrics */}
            <div className="space-y-4 relative z-10 mt-auto pt-8">
              <div className="h-px w-full bg-[var(--color-primary)]/10" />
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] opacity-40 uppercase tracking-widest">Node_Cluster_Status</p>
                  <p className="text-[10px] font-bold">STABLE // SYNC_ACTIVE</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Content (Fixed and Scrollable) */}
          <div className="flex-[1.2] bg-black/40 flex flex-col relative z-10 overflow-hidden">
            <div className="w-full h-full p-6 md:p-10 lg:p-14 overflow-y-auto custom-scrollbar flex items-center justify-center">
              <div className="w-full py-6">
                {children}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small Technical Metadata */}
        <div className="mt-6 text-[7px] font-mono opacity-30 uppercase tracking-[0.5em]">
          ENIAC_GATEWAY_V4.2.0_INITIALIZED // {new Date().toISOString()}
        </div>
      </div>

      {/* 4. Global Stats Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-[var(--color-primary)]/10 flex justify-between items-center text-[8px] bg-black/90">
        <div className="flex items-center gap-6">
          <span className="opacity-60 font-bold tracking-widest uppercase">ENIAC_OS</span>
          <div className="flex gap-4 opacity-40">
            <span>CPU: 12%</span>
            <span>MEM: 4.2GB</span>
          </div>
        </div>
        <div className="hidden sm:block opacity-40 uppercase tracking-widest font-bold">
          Handshake_Protocol_Standing_By_
        </div>
      </footer>
    </div>
  );
}
