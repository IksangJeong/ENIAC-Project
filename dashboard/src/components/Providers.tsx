"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, logout, isAuthenticated, user: currentUser } = useAuthStore();

  useEffect(() => {
    // 1. 인증된 세션이 있는 경우 동기화
    if (status === "authenticated" && session?.user) {
      // 이미 동일한 정보로 인증되어 있다면 무시
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
    } 
    // 2. NextAuth 세션은 없는데, 현재 스토어 유저가 깃허브 정보(avatar가 있거나 특정 조건)라면 로그아웃 처리
    // 이는 깃허브 로그아웃 후 일반 로그인을 시도할 때 잔상이 남는 것을 방지합니다.
    else if (status === "unauthenticated" && isAuthenticated) {
      // 일반 로그인 유저는 avatar가 없거나 다른 방식으로 구분될 수 있음
      // 여기서는 NextAuth가 명시적으로 unauthenticated라면 스토어의 깃허브 세션 잔상을 지웁니다.
      // 단, 일반 로그인 정보를 유지해야 할 수도 있으므로 세션 타입 등을 체크하는 것이 좋으나
      // 현재는 통합 관리를 위해 세션이 없으면 스토어도 동기화하여 비워주는 것이 안전합니다.
      
      // 만약 일반 로그인이 NextAuth를 통하지 않는다면, 
      // 여기서 무조건 로그아웃 시키면 일반 로그인도 튕길 수 있습니다.
      // 따라서 '깃허브로 로그인했던 흔적'이 있을 때만 로그아웃을 수행하도록 보수적으로 접근합니다.
      if (currentUser?.avatar && currentUser.avatar.includes("github")) {
         logout();
      }
    }
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
