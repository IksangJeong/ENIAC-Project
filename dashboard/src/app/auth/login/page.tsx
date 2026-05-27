"use client";

import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto"
    >
      <LoginForm />
    </motion.div>
  );
}
