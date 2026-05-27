"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlitchText } from "@/components/ui";
import clsx from "clsx";

export function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "RECOVERY_FAILED: Node validation failed");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "SYSTEM_ERROR: Access recovery failed");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 font-mono w-full max-w-sm mx-auto text-center border border-emerald-500/30 bg-black/60 p-6 rounded-sm relative"
      >
        <div className="absolute inset-0 pointer-events-none scanline opacity-10" />

        <div className="flex justify-center gap-1.5 h-6 items-center mb-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">BROADCASTING_SIGNAL...</span>
        </div>

        <div className="space-y-1">
          <GlitchText text="SIGNAL_TRANSMITTED" as="h2" className="text-xl font-black tracking-tighter text-emerald-400" />
          <p className="text-[9px] text-[var(--color-primary)]/60 uppercase tracking-[0.2em]">Access Key Recovery Queue</p>
        </div>

        <div className="p-4 bg-black/40 border border-emerald-500/10 text-left text-xs space-y-3 leading-relaxed">
          <p className="text-emerald-400 font-bold tracking-wider">// RECOVERY CODE: PENDING_ROOT_DECIDION</p>
          <p className="text-neutral-300">
            A secure recovery signal for node <span className="text-[var(--color-primary)]">@{username}</span> has been dispatched to the master console registry.
          </p>
          <p className="text-neutral-300">
            Since this system operates locally in the mesh network, <strong>please contact a system administrator (Root/Officer) directly</strong> to obtain your temporary access credentials.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className={clsx(
              "block w-full text-center bg-[var(--color-primary)] text-black font-black py-3 text-[11px] uppercase tracking-[0.3em] transition-all",
              "hover:glow active:scale-95"
            )}
          >
            RETURN_TO_GATEWAY
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 font-mono w-full max-w-sm mx-auto">
      <div className="space-y-1">
        <GlitchText text="RECOVER_ACCESS" as="h2" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]" />
        <p className="text-[9px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">Initiating key recovery sequence</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {/* Node ID */}
          <div className="space-y-1">
            <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">
              [01] NODE_IDENTIFIER (ID)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ENTER_NODE_ID"
              className={clsx(
                "w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10",
                "focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
              )}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">
              [02] REGISTERED_NODE_ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL@ENIAC.COM"
              className={clsx(
                "w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10",
                "focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
              )}
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">
              [03] RECOVERY_REASON / DETAILS
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.G. LOST CRYPT_KEY FILE"
              className={clsx(
                "w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10",
                "focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
              )}
              required
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border-l border-red-500 text-red-500 p-3 text-[9px] uppercase font-bold">
              !! FAILURE: {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className={clsx(
            "w-full bg-[var(--color-primary)] text-black font-black py-3 text-[11px] uppercase tracking-[0.3em] transition-all",
            "hover:glow active:scale-95 disabled:opacity-50"
          )}
        >
          {loading ? "TRANSMITTING..." : "SEND_RECOVERY_SIGNAL"}
        </motion.button>
      </form>

      <div className="text-center">
        <Link href="/auth/login" className="text-[9px] text-[var(--color-text-secondary)] uppercase hover:text-[var(--color-primary)] transition-colors">
          {">"} Return_to_Gateway
        </Link>
      </div>
    </div>
  );
}
