import { create } from "zustand";
import { useEffect, useState } from "react";
import { DepartmentId } from "@/lib/constants";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: "admin" | "member" | "viewer";
  avatar?: string;
  position?: string;
  department?: DepartmentId;
  bio?: string;
  skills?: string[];
  statusMessage?: string;
  metrics?: {
    todayCommits: number;
    weeklyActivity: number[];
  };
  socialLinks?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  joinDate?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  isInitialLoadComplete: boolean;
  isProfileSettingsOpen: boolean;

  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialLoadComplete: (complete: boolean) => void;
  setProfileSettingsOpen: (open: boolean) => void;
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
  isInitialLoadComplete: false,
  isProfileSettingsOpen: false,

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

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({
        user: updatedUser,
        isAdmin: updatedUser.role === "admin",
      });
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setInitialLoadComplete: (complete) => set({ isInitialLoadComplete: complete }),

  setProfileSettingsOpen: (open) => set({ isProfileSettingsOpen: open }),

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
