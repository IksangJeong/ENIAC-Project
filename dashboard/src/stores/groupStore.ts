import { create } from "zustand";
import { Group, GroupStatus, GroupType } from "@/types";
import { mockGroups } from "@/lib/mockData";

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;

  // Actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => Group | undefined;
  getGroupsByMemberId: (memberId: string) => Group[];
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: mockGroups,
  loading: false,
  error: null,

  setGroups: (groups) => set({ groups }),

  addGroup: (group) => set((state) => ({ 
    groups: [group, ...state.groups] 
  })),

  updateGroup: (id, updates) => set((state) => ({
    groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
  })),

  deleteGroup: (id) => set((state) => ({
    groups: state.groups.filter((g) => g.id !== id),
  })),

  getGroupById: (id) => get().groups.find((g) => g.id === id),

  getGroupsByMemberId: (memberId) => get().groups.filter((g) => g.memberIds.includes(memberId)),
}));
