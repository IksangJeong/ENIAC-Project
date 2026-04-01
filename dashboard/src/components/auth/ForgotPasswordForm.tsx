"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess("Password reset link has been sent to your email!");
      setEmail("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-[var(--color-primary)] text-base font-mono">
          &gt; EMAIL ADDRESS
        </label>
        <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full bg-[var(--color-bg-black)]/50 px-4 py-3 text-[var(--color-primary)] text-base placeholder-[var(--color-primary)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            required
          />
          <div className="absolute inset-0 pointer-events-none border border-[var(--color-primary)]/50 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-error)]/20 border border-[var(--color-error)]/50 text-[var(--color-error)] px-4 py-2 rounded text-base font-mono"
        >
          ✗ {error}
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-success)]/20 border border-[var(--color-success)]/50 text-[var(--color-success)] px-4 py-2 rounded text-base font-mono"
        >
          ✓ {success}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-[var(--color-primary)] text-[var(--color-bg-black)] font-bold py-3 text-base rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
      >
        {loading ? "SENDING..." : "SEND RESET LINK"}
      </motion.button>
    </form>
  );
}
