"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydrate } from "@/stores/authStore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { AwaitingApproval } from "./AwaitingApproval";

interface ProtectedRouteProps {
  children: ReactNode;
}

// 브라우저 탭이 유지되는 동안 딱 한 번만 실행됨을 보장하는 모듈 전역 변수
let globalInitialLoadDone = false;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const isHydrated = useAuthHydrate();
  const { status } = useSession();
  
  // globalInitialLoadDone이 true라면 즉시 로딩을 건너뜁니다.
  const [isInitialLoading, setIsInitialLoading] = useState(!globalInitialLoadDone);

  useEffect(() => {
    // 세션 정보가 확정되고 스토어가 준비되면 초기 로딩 완료 처리
    if (status !== "loading" && isHydrated) {
      globalInitialLoadDone = true;
      setIsInitialLoading(false);
    }

    // 인증 확인 및 리다이렉트 (로딩 중이 아닐 때만 수행)
    if (status === "unauthenticated" && !isAuthenticated && !isInitialLoading) {
      router.push("/auth/login");
    }
  }, [isHydrated, isAuthenticated, status, router, isInitialLoading]);

  // 승인 대기 유저의 승인 여부 백그라운드 폴링 (20초 주기 - 미니 PC 부하 방지)
  useEffect(() => {
    if (!isAuthenticated || !user || user.isApproved || user.clearance === "root" || user.clearance === "officer" || user.role === "admin") {
      return;
    }

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/auth/status?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isApproved) {
            updateUser({ isApproved: true });
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Failed to poll approval status:", err);
      }
    };

    const interval = setInterval(pollStatus, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, updateUser, router]);

  // 로딩 화면: 앱 최초 접속 시(globalInitialLoadDone이 false일 때)에만 표시
  if (isInitialLoading) {
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

  // 로그인 상태이나 승인 대기 상태인 경우 대기실 렌더링 (어드민 제외)
  if (isAuthenticated && user && !user.isApproved && user.clearance !== "root" && user.clearance !== "officer" && user.role !== "admin") {
    return <AwaitingApproval />;
  }

  // 인증됨 및 승인됨 - 페이지 표시
  return <>{children}</>;
}
