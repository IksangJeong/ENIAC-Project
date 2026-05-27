"use client";

import { motion } from "framer-motion";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <SignupForm />
    </motion.div>
  );
}
