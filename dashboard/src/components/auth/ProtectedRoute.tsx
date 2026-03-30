"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydrate } from "@/stores/authStore";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const isHydrated = useAuthHydrate();

  useEffect(() => {
    // hydrate가 완료된 후 인증 확인
    if (isHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // hydrate 대기 중
  if (!isHydrated) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400 font-mono text-xl"
        >
          INITIALIZING SYSTEM...
        </motion.div>
      </div>
    );
  }

  // 인증되지 않음 (리다이렉트 중)
  if (!isAuthenticated) {
    return null;
  }

  // 인증됨 - 페이지 표시
  return <>{children}</>;
}
