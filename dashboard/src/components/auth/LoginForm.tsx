"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { signIn } from "next-auth/react";

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
        throw new Error(data.message || "Failed to login");
      }

      // Store user data in Zustand
      setUser(data.user);

      // Redirect to dashboard
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
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
      setError("Failed to login with GitHub");
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div className="space-y-2">
          <label className="text-[var(--color-primary)] text-base font-mono">
            &gt; USERNAME
          </label>
          <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="admin_user"
              className="w-full bg-[var(--color-bg-black)]/50 px-4 py-3 text-[var(--color-primary)] text-base placeholder-[var(--color-primary)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-[var(--color-primary)] text-base font-mono">
            &gt; PASSWORD
          </label>
          <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[var(--color-bg-black)]/50 px-4 py-3 text-[var(--color-primary)] text-base placeholder-[var(--color-primary)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              required
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            href="/auth/forgot-password"
            className="text-[var(--color-primary)] hover:opacity-80 text-sm font-mono underline transition-colors"
          >
            Forgot password?
          </Link>
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

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || githubLoading}
          className="w-full mt-6 bg-[var(--color-primary)] text-[var(--color-bg-black)] font-bold py-3 text-base rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--color-primary)]/20"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0a] px-2 text-[var(--color-primary)]/50 font-mono">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Section */}
      <div className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGithubLogin}
          disabled={loading || githubLoading}
          className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 text-white font-semibold py-3 text-base rounded transition-all hover:bg-white/10 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {githubLoading ? "CONNECTING..." : "GITHUB LOGIN"}
        </motion.button>
      </div>
    </div>
  );
}
