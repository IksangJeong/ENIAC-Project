"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { signIn } from "next-auth/react";
import { GlitchText } from "@/components/ui";
import clsx from "clsx";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "INVALID_CREDENTIALS");
      }

      setUser(data.user);
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "CONNECTION_FAILED";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (err) {
      setError("GITHUB_SYNC_FAILED");
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-5 font-mono w-full max-w-sm mx-auto">
      <div className="space-y-1">
        <GlitchText text="LOGIN_SESSION" as="h2" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]" />
        <p className="text-[9px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">Verification required for access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[01] NODE_ID</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="ENTER_IDENTIFIER"
              className="w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-0 py-1.5 text-base text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:border-[var(--color-primary)] transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[02] CRYPT_KEY</label>
              <Link href="/auth/forgot-password" className="text-[8px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-2 opacity-60 hover:opacity-100 font-mono">LOST_KEY?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-0 py-1.5 text-base text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:border-[var(--color-primary)] transition-all"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-[var(--color-text-secondary)]">
          <span>New node?</span>
          <Link href="/auth/signup" className="text-[var(--color-primary)] hover:underline font-bold">REGISTER_NODE</Link>
        </div>

        {/* Error Log Area - Fixed Height to prevent layout shift */}
        <div className="h-6 flex items-center">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 5 }}
                className="text-red-500 text-[9px] font-bold uppercase tracking-tight flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                !! AUTH_FAILURE: {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading || githubLoading}
          className={clsx(
            "w-full bg-[var(--color-primary)] text-black font-black py-3 text-[11px] uppercase tracking-[0.3em] transition-all",
            "hover:glow active:scale-95 disabled:opacity-50"
          )}
        >
          {loading ? "SYNCING..." : "ESTABLISH_CONNECTION"}
        </motion.button>
      </form>

      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em] whitespace-nowrap">External_Sync</span>
          <div className="h-px flex-1 bg-[var(--color-primary)]/10" />
        </div>

        <motion.button
          whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGithubLogin}
          disabled={loading || githubLoading}
          className="flex items-center justify-center gap-2 w-full border border-white/10 text-white text-[9px] font-bold py-2.5 uppercase tracking-widest transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          GitHub Login
        </motion.button>
      </div>
    </div>
  );
}
