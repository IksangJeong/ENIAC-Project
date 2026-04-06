import { create } from "zustand";
import { Schedule } from "@/types";
import { mockSchedules as initialSchedules } from "@/lib/mockData";

interface ScheduleState {
  schedules: Schedule[];
  addSchedule: (newSchedule: Schedule) => void;
  updateSchedule: (id: string, updatedSchedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  getScheduleById: (id: string) => Schedule | undefined;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: initialSchedules,
  
  addSchedule: (newSchedule) => {
    set((state) => ({
      schedules: [...state.schedules, newSchedule],
    }));
  },

  updateSchedule: (id, updatedFields) => {
    set((state) => ({
      schedules: state.schedules.map((s) => 
        s.id === id ? { ...s, ...updatedFields } : s
      ),
    }));
  },

  deleteSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    }));
  },
  
  getScheduleById: (id) => {
    return get().schedules.find((s) => s.id === id);
  },
}));
