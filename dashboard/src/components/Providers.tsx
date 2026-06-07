"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, logout, isAuthenticated, user: currentUser } = useAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      // 1. 인증된 세션이 있는 경우 동기화
      if (status === "authenticated" && session?.user) {
        // 이미 동일한 정보로 인증되어 있다면 무시
        if (isAuthenticated && currentUser?.email === session.user.email) {
          return;
        }

        try {
          const res = await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: (session.user as any).id || "",
              username: (session.user as any).login || session.user.name || "",
              name: session.user.name || "",
              email: session.user.email || "",
              avatar: session.user.image || "",
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            const isSessionAdmin = (session.user as any).role === "admin";
            setUser({
              id: (session.user as any).id || "",
              username: (session.user as any).login || session.user.name || "",
              name: session.user.name || "",
              email: session.user.email || "",
              role: isSessionAdmin ? "admin" : "member",
              clearance: isSessionAdmin ? "root" : "member",
              isApproved: isSessionAdmin,
              avatar: session.user.image || "",
            });
          }
        } catch (err) {
          console.error("Failed to sync session user:", err);
        }
      } 
      // 2. NextAuth 세션은 없는데, 현재 스토어 유저가 깃허브 정보라면 로그아웃 처리
      else if (status === "unauthenticated" && isAuthenticated) {
        if (currentUser?.avatar && currentUser.avatar.includes("github")) {
           logout();
        }
      }
    };

    syncUser();
  }, [session, status, setUser, logout, isAuthenticated, currentUser]);

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
