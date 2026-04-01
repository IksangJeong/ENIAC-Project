import { create } from "zustand";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: "admin" | "user";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
  isHydrated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      error: null,
    });
    // localStorage에 저장
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
    });
    // localStorage에서 삭제
    localStorage.removeItem("authUser");
  },

  clearError: () => set({ error: null }),

  // 페이지 새로고침 시 localStorage에서 복구
  hydrate: () => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({
          user,
          isAuthenticated: true,
          isAdmin: user?.role === "admin",
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      localStorage.removeItem("authUser");
      set({ isHydrated: true });
    }
  },
}));

// Custom Hook: 클라이언트 사이드에서 hydrate를 자동으로 실행
export function useAuthHydrate() {
  const [isMounted, setIsMounted] = useState(false);
  const { hydrate, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isMounted) {
      hydrate();
      setIsMounted(true);
    }
  }, [isMounted, hydrate]);

  return isHydrated;
}
