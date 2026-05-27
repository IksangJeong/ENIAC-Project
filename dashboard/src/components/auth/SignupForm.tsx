"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlitchText } from "@/components/ui";
import clsx from "clsx";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("VALIDATION_ERROR: Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "INITIALIZATION_FAILED: Registration error");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "SYSTEM_FAILURE: Could not create node");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 font-mono w-full max-w-md mx-auto text-center border border-[var(--color-primary)]/20 bg-black/40 backdrop-blur-sm p-8 rounded-sm relative"
      >
        <div className="absolute inset-0 pointer-events-none scanline opacity-10" />
        
        <div className="w-16 h-16 border border-emerald-500 flex items-center justify-center text-emerald-500 mx-auto text-3xl font-black rounded-sm animate-pulse mb-4">
          ✓
        </div>

        <div className="space-y-1">
          <GlitchText text="NODE_INITIALIZED" as="h2" className="text-2xl font-black tracking-tighter text-emerald-400" />
          <p className="text-[10px] text-[var(--color-primary)]/60 uppercase tracking-[0.2em]">Deployment Request Registered</p>
        </div>

        <div className="p-4 bg-black/40 border border-[var(--color-primary)]/10 text-left text-xs space-y-3 leading-relaxed">
          <p className="text-emerald-500 font-bold tracking-wider">// STATUS: PENDING_ROOT_ACTIVATION</p>
          <p className="text-neutral-300">
            Your user identity <span className="text-[var(--color-primary)]">@{formData.username}</span> has been broadcast to the cluster database. 
          </p>
          <p className="text-neutral-300">
            For security clearance, a <strong>Root Dev Admin</strong> or <strong>Club Officer</strong> must authorize your connection link before network access is granted.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className={clsx(
              "block w-full text-center bg-[var(--color-primary)] text-black font-black py-3 text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden",
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
    <div className="space-y-6 font-mono w-full max-w-md mx-auto">
      <div className="space-y-2 mb-4">
        <div className="text-[var(--color-primary)]/60 text-[10px] font-mono tracking-[0.3em] uppercase">
          &gt; USER_REGISTRATION
        </div>
        <GlitchText text="SIGN_UP" as="h1" className="text-4xl font-black tracking-tighter text-[var(--color-primary)]" />
        <div className="w-12 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          {[
            { label: "01_ID", name: "username", type: "text", placeholder: "ID_SEQUENCE" },
            { label: "02_ALIAS", name: "name", type: "text", placeholder: "HUMAN_NAME" },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[{field.label}]</label>
              <input
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                autoFocus={field.name === "username"}
                className="w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
                required
              />
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[03_NODE_ADDRESS]</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="EMAIL@ENIAC.COM"
            className="w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[04_KEY]</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-2 opacity-60 hover:opacity-100 uppercase text-[8px]"
              >
                {showPassword ? "[CONCEAL]" : "[REVEAL]"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={showPassword ? "ENTER_KEY" : "********"}
              className="w-full bg-black/20 border-b border-[var(--color-primary)]/20 px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[8px] text-[var(--color-primary)] uppercase font-bold opacity-70">[05_VERIFY]</label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-2 opacity-60 hover:opacity-100 uppercase text-[8px]"
              >
                {showConfirmPassword ? "[CONCEAL]" : "[REVEAL]"}
              </button>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={showConfirmPassword ? "VERIFY_KEY" : "********"}
              className={clsx(
                "w-full bg-black/20 border-b px-3 py-2 text-sm text-white placeholder-[var(--color-primary)]/10 focus:outline-none focus:bg-[var(--color-primary)]/[0.02] focus:shadow-[0_1px_15px_rgba(var(--color-primary-rgb),0.15)] transition-all rounded-sm",
                formData.confirmPassword !== "" && formData.password !== formData.confirmPassword
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              )}
              required
            />
            {formData.confirmPassword !== "" && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-[8px] font-bold mt-1 uppercase tracking-tight">// KEY_MISMATCH: KEYS DO NOT MATCH</p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border-l border-red-500 text-red-500 p-2 text-[9px] uppercase font-bold">
              !! ERROR: {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className={clsx(
            "w-full mt-4 bg-[var(--color-primary)] text-black font-black py-3 text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden",
            "hover:glow active:scale-95 disabled:opacity-50"
          )}
        >
          {loading ? "INITIALIZING_NODE..." : "EXECUTE_DEPLOYMENT"}
        </motion.button>
      </form>

      <div className="text-center">
        <Link href="/auth/login" className="text-[9px] text-[var(--color-text-secondary)] uppercase hover:text-[var(--color-primary)] transition-colors">
          {">"} Existing_Node? Return_to_Gateway
        </Link>
      </div>
    </div>
  );
}
