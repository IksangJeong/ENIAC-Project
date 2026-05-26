import { create } from "zustand";
import { Group } from "@/types";
import { fetchGroups, createGroup, updateGroup as apiUpdateGroup, deleteGroup as apiDeleteGroup } from "@/lib/api";

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;

  // Actions
  loadGroups: () => Promise<void>;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => Promise<void>;
  updateGroup: (id: string, updates: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  getGroupById: (id: string) => Group | undefined;
  getGroupsByMemberId: (memberId: string) => Group[];
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  loading: false,
  error: null,

  loadGroups: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchGroups();
      set({ groups: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  setGroups: (groups) => set({ groups }),

  addGroup: async (group) => {
    set({ loading: true, error: null });
    try {
      const savedGroup = await createGroup(group);
      set((state) => ({ 
        groups: [savedGroup, ...state.groups],
        loading: false 
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateGroup: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const savedGroup = await apiUpdateGroup(id, updates);
      set((state) => ({
        groups: state.groups.map((g) => (g.id === id ? savedGroup : g)),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteGroup(id);
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  getGroupById: (id) => get().groups.find((g) => g.id === id),

  getGroupsByMemberId: (memberId) => get().groups.filter((g) => g.memberIds.includes(memberId)),
}));
