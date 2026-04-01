"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

export function SignupForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      // Store user data
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

  return (
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

      {/* Name Input */}
      <div className="space-y-2">
        <label className="text-[var(--color-primary)] text-base font-mono">
          &gt; FULL NAME
        </label>
        <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-[var(--color-bg-black)]/50 px-4 py-3 text-[var(--color-primary)] text-base placeholder-[var(--color-primary)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            required
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-[var(--color-primary)] text-base font-mono">
          &gt; EMAIL ADDRESS
        </label>
        <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
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

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label className="text-[var(--color-primary)] text-base font-mono">
          &gt; CONFIRM PASSWORD
        </label>
        <div className="relative border border-[var(--color-primary)]/30 rounded overflow-hidden">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[var(--color-bg-black)]/50 px-4 py-3 text-[var(--color-primary)] text-base placeholder-[var(--color-primary)]/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            required
          />
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

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-[var(--color-primary)] text-[var(--color-bg-black)] font-bold py-3 text-base rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
      >
        {loading ? "REGISTERING..." : "CREATE ACCOUNT"}
      </motion.button>
    </form>
  );
}
