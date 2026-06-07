"use client";

import { PageLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ScheduleCard } from "@/components/modules/schedule/ScheduleCard";
import { ScheduleModal } from "@/components/modules/schedule/ScheduleModal";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useState, useEffect, useCallback, useRef } from "react";
import { Schedule } from "@/types";
import clsx from "clsx";

export default function SchedulePage() {
  const { schedules, loading, loadSchedules, addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();
  
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const [newScheduleIds, setNewScheduleIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 13, m: 45, s: 22 });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveSchedule = useCallback((schedule: Schedule) => {
    if (editingSchedule) {
      updateSchedule(schedule.id, schedule);
    } else {
      addSchedule(schedule);
      setNewScheduleIds(prev => [...prev, schedule.id]);
      setTimeout(() => {
        setNewScheduleIds(prev => prev.filter(id => id !== schedule.id));
      }, 5000);
    }
    setIsModalOpen(false);
    setEditingSchedule(null);
  }, [addSchedule, updateSchedule, editingSchedule]);

  const handleEditRequest = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const filteredSchedules = schedules
    .filter(s => filter === "all" || s.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (loading && schedules.length === 0) {
    return (
      <PageLayout activePage="schedule">
        <div className="h-full flex items-center justify-center">
          <div className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-[0.3em]">
            // RECONSTRUCTING_TIMELINE_DATABASE...
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout activePage="schedule">
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
            
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block overflow-y-auto custom-scrollbar pr-2">
              <section className="border border-[var(--color-primary)]/20 rounded-sm p-4 bg-[var(--color-bg-black)]/40">
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 opacity-50 text-[var(--color-primary)]">
                  &gt; MISSION_FILTERS
                </h2>
                <div className="flex flex-col gap-2">
                  {["all", "event", "seminar", "study", "meeting"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={clsx(
                        "text-left px-3 py-2 text-xs uppercase tracking-widest transition-all border-l-2",
                        filter === f 
                          ? "text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary)]/5 glow-sm" 
                          : "text-[var(--color-text-secondary)] border-transparent hover:border-[var(--color-primary)]/30"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </section>

              <section className="border border-[var(--color-primary)]/20 rounded-sm p-4 bg-[var(--color-bg-black)]/40">
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 opacity-50 text-[var(--color-primary)]">
                  &gt; SYSTEM_STATS
                </h2>
                <div className="space-y-3">
                  <StatRow label="Upcoming" value={schedules.filter(s => s.status === 'upcoming').length} />
                  <StatRow label="Active" value={schedules.filter(s => s.status === 'active').length} color="text-cyan-400" />
                  <StatRow label="Completed" value={schedules.filter(s => s.status === 'completed').length} />
                </div>
              </section>
            </div>

            {/* Center Column */}
            <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
              <div className="mb-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white">
                  Tactical_Operation_Timeline
                </h2>
                <span className="text-[10px] font-mono opacity-40">UTC+09:00_SEOUL</span>
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8 relative overscroll-contain"
              >
                {/* Vertical Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-primary)]/30 to-transparent ml-2 md:ml-4" />
                
                {/* pt-8 추가로 첫번째 카드 아이콘 잘림 방지 */}
                <motion.div layout className="pl-6 md:pl-10 space-y-12 pb-32 pt-8">
                  <AnimatePresence mode="popLayout">
                    {filteredSchedules.map((schedule) => (
                      <motion.div 
                        key={schedule.id} 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                      >
                        <div className={clsx(
                          "absolute -left-[25px] md:-left-[33px] top-6 w-3 h-3 border rotate-45 z-10 transition-colors duration-500",
                          newScheduleIds.includes(schedule.id) ? "bg-white border-white animate-pulse" :
                          schedule.status === 'active' ? "bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-[#0a0a0a] border-[var(--color-primary)]/50"
                        )} />
                        
                        <ScheduleCard 
                          schedule={schedule} 
                          isNew={newScheduleIds.includes(schedule.id)}
                          isPast={new Date(schedule.date).getTime() < Date.now() && (schedule.status === 'completed' || schedule.status === 'archived')} 
                          onEdit={handleEditRequest}
                          onDelete={deleteSchedule}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredSchedules.length === 0 && (
                    <div className="text-center py-20 opacity-30 font-mono text-xs tracking-widest">
                      NO_DATA_MATCHING_FILTER_CRITERIA
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block overflow-y-auto custom-scrollbar">
              <section className="border border-[var(--color-primary)]/20 rounded-sm p-4 bg-[var(--color-bg-black)]/40 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rotate-45 translate-x-8 -translate-y-8 border border-red-500/10" />
                  <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 opacity-50 text-red-400">
                    &gt; NEXT_CRITICAL_EVENT
                  </h2>
                  <div className="text-center py-4">
                    <p className="text-[10px] opacity-40 mb-1">HACKATHON_START_IN</p>
                    <div className="text-2xl font-bold font-mono tracking-tighter text-white">
                        {timeLeft.h.toString().padStart(2, '0')}
                        <span className="text-[var(--color-primary)] mx-1">:</span>
                        {timeLeft.m.toString().padStart(2, '0')}
                        <span className="text-[var(--color-primary)] mx-1">:</span>
                        {timeLeft.s.toString().padStart(2, '0')}
                    </div>
                    <p className="text-[9px] mt-2 text-red-400/60 font-mono tracking-widest">ENIAC_SPRING_HACK_2026</p>
                  </div>
              </section>

              <section className="border border-[var(--color-primary)]/20 rounded-sm p-4 bg-[var(--color-bg-black)]/40">
                  <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 opacity-50 text-[var(--color-primary)]">
                    &gt; QUICK_ACTIONS
                  </h2>
                  <div className="space-y-2">
                    <ActionButton label="Export Log" />
                    <ActionButton label="Notify Team" />
                    <ActionButton label="Sync External Cal" />
                  </div>
              </section>
            </div>

          </div>
        </div>


        <ScheduleModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingSchedule(null); }} 
          onSave={handleSaveSchedule} 
          initialData={editingSchedule}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}

function StatRow({ label, value, color = "" }: { label: string; value: number, color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-wider opacity-60">{label}</span>
      <span className={clsx("text-xs font-mono font-bold", color)}>{value.toString().padStart(2, '0')}</span>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="w-full py-2 px-3 border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all text-[10px] uppercase tracking-widest text-left">
      {label}
    </button>
  );
}
