"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="border border-cyan-500/50 bg-black/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl relative">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="text-cyan-400 text-sm font-mono tracking-widest">
            &gt; SYSTEM AUTHENTICATION
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            LOGIN
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-cyan-500/20"></div>
          <span className="text-cyan-500/50 text-xs">OR</span>
          <div className="flex-1 h-px bg-cyan-500/20"></div>
        </div>

        {/* Signup Link */}
        <div className="text-center">
          <p className="text-cyan-500/70 text-sm">
            No account yet?{" "}
            <Link
              href="/auth/signup"
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Footer Status */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20">
          <div className="text-xs text-cyan-500/50 font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Connection Status: ACTIVE
          </div>
        </div>
      </div>
    </motion.div>
  );
}
