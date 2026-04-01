"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="border border-[var(--color-primary)]/30 bg-[var(--color-bg-black)]/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl relative">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-primary)]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-primary)]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-primary)]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-primary)]"></div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="text-[var(--color-primary)] text-base font-mono tracking-widest">
            &gt; PASSWORD RECOVERY
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-primary)]">
            FORGOT PASSWORD
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent"></div>
        </div>

        {/* Description */}
        <p className="text-[var(--color-primary)]/70 text-base mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Form */}
        <ForgotPasswordForm />

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--color-primary)]/20"></div>
          <span className="text-[var(--color-primary)]/60 text-sm">BACK</span>
          <div className="flex-1 h-px bg-[var(--color-primary)]/20"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-[var(--color-primary)]/70 text-base">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-[var(--color-primary)] hover:opacity-80 underline transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Status */}
        <div className="mt-6 pt-4 border-t border-[var(--color-primary)]/20">
          <div className="text-sm text-[var(--color-primary)]/60 font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
            Connection Status: ACTIVE
          </div>
        </div>
      </div>
    </motion.div>
  );
}
