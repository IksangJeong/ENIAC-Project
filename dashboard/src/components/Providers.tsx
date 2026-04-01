"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";

function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, isAuthenticated, user: currentUser } = useAuthStore();
  const syncRef = useRef(false);

  useEffect(() => {
    // 세션이 성공적으로 로드되었을 때만 실행
    if (status === "authenticated" && session?.user) {
      // 이미 현재 유저와 동일한 정보로 인증되어 있다면 추가 업데이트 방지
      if (isAuthenticated && currentUser?.email === session.user.email) {
        return;
      }

      setUser({
        id: (session.user as any).id || "",
        username: (session.user as any).login || session.user.name || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || "user",
        avatar: session.user.image || "",
      });
      syncRef.current = true;
    }
  }, [session, status, setUser, isAuthenticated, currentUser]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
