import { create } from "zustand";
import { useEffect, useState } from "react";
import { DepartmentId } from "@/lib/constants";
import { mockMembers } from "@/lib/mockData";
import { Member } from "@/types";

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

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialLoadComplete: (complete: boolean) => void;
  setProfileSettingsOpen: (open: boolean) => void;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
  
  // Selectors (Derived state)
  getAllMembers: () => Member[];
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
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
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

  // 시스템 전체에서 본인 노드가 포함된 멤버 리스트를 가져오는 단일 창구
  getAllMembers: () => {
    const currentUser = get().user;
    let list = [...mockMembers];
    
    if (currentUser) {
      const existingIndex = list.findIndex(m => m.id === currentUser.id);
      
      // currentUser의 모든 필드를 Member 타입에 맞게 매핑
      const myNode: Member = {
        ...currentUser,
        id: currentUser.id,
        name: currentUser.name || "Unknown Member",
        username: currentUser.username || "guest",
        status: "online",
        role: currentUser.role || "member",
        position: currentUser.position || "Member",
        department: currentUser.department || "Management",
        bio: currentUser.bio || "", // bio 필드 명시적 보장
        skills: currentUser.skills || [],
        joinDate: currentUser.joinDate || new Date().toISOString().split('T')[0],
        socialLinks: currentUser.socialLinks || { github: currentUser.username }
      } as Member;

      if (existingIndex !== -1) {
        // 기존 mock 데이터와 병합하되 내 실시간 데이터(myNode)를 우선함
        list[existingIndex] = { ...list[existingIndex], ...myNode };
      } else {
        list = [myNode, ...list];
      }
    }
    return list;
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setInitialLoadComplete: (complete) => set({ isInitialLoadComplete: complete }),
  setProfileSettingsOpen: (open) => set({ isProfileSettingsOpen: open }),

  logout: () => {
    set({ user: null, isAuthenticated: false, isAdmin: false, error: null });
    localStorage.removeItem("authUser");
  },

  clearError: () => set({ error: null }),

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
