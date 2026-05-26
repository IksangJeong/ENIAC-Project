import { create } from "zustand";
import { Schedule } from "@/types";
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from "@/lib/api";

interface ScheduleState {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadSchedules: () => Promise<void>;
  addSchedule: (newSchedule: Schedule) => Promise<void>;
  updateSchedule: (id: string, updatedSchedule: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  loading: false,
  error: null,

  loadSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchSchedules();
      set({ schedules: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  
  addSchedule: async (newSchedule) => {
    set({ loading: true, error: null });
    try {
      const savedSchedule = await createSchedule(newSchedule);
      set((state) => ({
        schedules: [...state.schedules, savedSchedule],
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateSchedule: async (id, updatedFields) => {
    set({ loading: true, error: null });
    try {
      const savedSchedule = await updateSchedule(id, updatedFields);
      set((state) => ({
        schedules: state.schedules.map((s) => 
          s.id === id ? savedSchedule : s
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteSchedule(id);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  
  getScheduleById: (id) => {
    return get().schedules.find((s) => s.id === id);
  },
}));
