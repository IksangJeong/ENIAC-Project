"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
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
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Input */}
      <div className="space-y-2">
        <label className="text-cyan-400 text-sm font-mono">
          &gt; USERNAME
        </label>
        <div className="relative border border-cyan-500/30 rounded overflow-hidden">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="admin_user"
            className="w-full bg-black/50 px-4 py-3 text-cyan-400 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />
          <div className="absolute inset-0 pointer-events-none border border-cyan-500/50 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="text-cyan-400 text-sm font-mono">
          &gt; PASSWORD
        </label>
        <div className="relative border border-cyan-500/30 rounded overflow-hidden">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-black/50 px-4 py-3 text-cyan-400 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link
          href="/auth/forgot-password"
          className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded text-sm font-mono"
        >
          ✗ {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50"
      >
        {loading ? "AUTHENTICATING..." : "LOGIN"}
      </motion.button>
    </form>
  );
}
