import { create } from "zustand";
import { useEffect, useState } from "react";
import { DepartmentId } from "@/lib/constants";
import { Member, ClearanceType } from "@/types";
import { fetchMembers } from "@/lib/api";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "member";
  clearance?: ClearanceType;
  isApproved: boolean;
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
  members: Member[];

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
  loadMembers: () => Promise<void>;
  
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
  members: [],

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.clearance === "root" || user?.clearance === "officer" || user?.role === "admin",
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
        isAdmin: updatedUser.clearance === "root" || updatedUser.clearance === "officer" || updatedUser.role === "admin",
      });
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
    }
  },

  getAllMembers: () => {
    return get().members;
  },

  loadMembers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchMembers();
      set({ members: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
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
          isAdmin: user?.clearance === "root" || user?.clearance === "officer" || user?.role === "admin",
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
