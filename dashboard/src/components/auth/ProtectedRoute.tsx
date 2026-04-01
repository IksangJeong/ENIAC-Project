"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydrate } from "@/stores/authStore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const isHydrated = useAuthHydrate();
  const { status } = useSession();

  useEffect(() => {
    // NextAuth 세션 로딩 중이거나 Zustand가 복구되는 중이면 대기
    if (status === "loading" || !isHydrated) return;

    // NextAuth 세션이 없고 Zustand로도 인증되지 않은 경우에만 로그인 페이지로 리다이렉트
    if (status === "unauthenticated" && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isHydrated, isAuthenticated, status, router]);

  // 로딩 상태 표시
  if (!isHydrated || status === "loading") {
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

  // 인증되지 않음 (이미 리다이렉트 로직이 실행 중임)
  if (status === "unauthenticated" && !isAuthenticated) {
    return null;
  }

  // 인증됨 - 페이지 표시
  return <>{children}</>;
}
