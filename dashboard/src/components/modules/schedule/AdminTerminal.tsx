"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";

interface AdminTerminalProps {
  onOpenModal: () => void;
}

export function AdminTerminal({ onOpenModal }: AdminTerminalProps) {
  const { isAdmin } = useAuthStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim().toLowerCase();
    setHistory((prev) => [...prev, `> ${command}`]);
    
    if (command === "add") {
      onOpenModal();
      setHistory((prev) => [...prev, "[SYSTEM] OPENING_TACTICAL_ENTRY_FORM..."]);
    } else if (command === "clear") {
      setHistory([]);
    } else if (command === "help") {
      setHistory((prev) => [
        ...prev, 
        "AVAILABLE_COMMANDS:",
        "  add - OPEN_MISSION_DEPLOYMENT_FORM",
        "  clear - CLEAR_TERMINAL_LOG",
        "  help - SHOW_COMMAND_LIST"
      ]);
    } else {
      setHistory((prev) => [...prev, `[ERROR] UNKNOWN_COMMAND: ${command}`]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] px-4 pb-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto flex flex-col items-end gap-2">
        
        {/* Quick Access Floating Button */}
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal()}
            className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] mb-2"
          >
            [+] New_Mission
          </motion.button>
        )}

        <div className="w-full">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 180, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[#0a0a0a]/95 border-x border-t border-[var(--color-primary)]/30 rounded-t-lg overflow-hidden flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="bg-[var(--color-primary)]/10 px-4 py-1.5 flex items-center justify-between border-b border-[var(--color-primary)]/20">
                  <span className="text-[10px] font-mono tracking-widest text-[var(--color-primary)] opacity-70">
                    SECURE_TERMINAL_V1.0.5
                  </span>
                  <button onClick={() => setIsOpen(false)} className="text-[var(--color-primary)] opacity-50 hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar">
                  {history.map((line, i) => (
                    <div key={i} className={clsx(
                      line.startsWith(">") ? "text-white" : 
                      line.startsWith("[ERROR]") ? "text-red-400" : 
                      line.startsWith("[SUCCESS]") || line.includes("OPENING") ? "text-cyan-400" : "text-[var(--color-primary)]/60"
                    )}>
                      {line}
                    </div>
                  ))}
                  <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className={clsx(
              "h-12 border border-[var(--color-primary)]/30 bg-[#0a0a0a]/90 backdrop-blur-md flex items-center px-4 gap-3 transition-all duration-300",
              isOpen ? "rounded-b-lg border-t-0" : "rounded-lg glow-sm hover:border-[var(--color-primary)]/60"
            )}
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <span className="text-[var(--color-primary)] font-mono animate-pulse font-bold">&gt;</span>
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isOpen ? "ENTER_COMMAND_ (type 'add' for form)" : "ADMIN_COMMAND_CONSOLE_"}
                className="w-full bg-transparent border-none outline-none text-[var(--color-primary)] font-mono text-sm placeholder-[var(--color-primary)]/30"
              />
            </form>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[var(--color-primary)]/40 uppercase tracking-tighter">
                  Root@ENIAC-SYS
              </span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_cyan]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
