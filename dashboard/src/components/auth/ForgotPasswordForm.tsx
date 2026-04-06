"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlitchText } from "@/components/ui";
import clsx from "clsx";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "RECOVERY_FAILED: Node address not found");
      }

      setMessage("RECOVERY_LINK_SENT: Check your node inbox");
    } catch (err) {
      setError(err instanceof Error ? err.message : "SYSTEM_ERROR: Access recovery failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono w-full max-w-sm mx-auto">
      <div className="space-y-1">
        <GlitchText text="RECOVER_ACCESS" as="h2" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]" />
        <p className="text-[9px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">Initiating key recovery sequence</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] text-[var(--color-primary)] uppercase tracking-widest font-bold opacity-70">
            [01] REGISTERED_NODE_ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL@ENIAC.COM"
            className={clsx(
              "w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-0 py-2 text-base text-white placeholder-[var(--color-primary)]/10",
              "focus:outline-none focus:border-[var(--color-primary)] transition-all"
            )}
            required
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border-l border-red-500 text-red-500 p-3 text-[9px] uppercase font-bold">
              !! FAILURE: {error}
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border-l border-emerald-500 text-emerald-400 p-3 text-[9px] uppercase font-bold">
              &gt;&gt; SUCCESS: {message}
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
          {loading ? "PROCESSING..." : "SEND_RECOVERY_KEY"}
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
