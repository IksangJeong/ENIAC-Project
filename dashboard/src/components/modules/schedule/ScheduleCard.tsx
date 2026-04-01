"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Schedule } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import clsx from "clsx";

interface ScheduleCardProps {
  schedule: Schedule;
  isPast?: boolean;
  isNew?: boolean;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
}

export function ScheduleCard({ schedule, isPast, isNew, onEdit, onDelete }: ScheduleCardProps) {
  const { isAdmin } = useAuthStore();
  const [isJoined, setIsJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(schedule.participants || 0);

  const typeColors = {
    study: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
    seminar: "text-purple-400 border-purple-400/30 bg-purple-400/5",
    event: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    meeting: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  };

  const priorityColors = {
    normal: "bg-gray-500",
    high: "bg-amber-500",
    critical: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  };

  const toggleJoin = async () => {
    if (isProcessing || isPast) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (isJoined) {
      setLocalParticipants(prev => Math.max(0, prev - 1));
      setIsJoined(false);
    } else {
      setLocalParticipants(prev => prev + 1);
      setIsJoined(true);
    }
    setIsProcessing(false);
  };

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, scale: 0.9, x: -20 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className={clsx(
        "relative p-4 border rounded-sm transition-all duration-300 group",
        isPast ? "opacity-50 grayscale-[0.5]" : "opacity-100",
        isNew ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-cyan-400/5" : 
        schedule.status === "active" ? "border-cyan-400 glow-sm" : "border-[var(--color-primary)]/20",
        isJoined && "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-500/5"
      )}
    >
      {/* Admin Quick Tools (Top Left) */}
      {isAdmin && (
        <div className="absolute -top-2 -left-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit?.(schedule)}
            className="bg-gray-800 border border-cyan-500/50 p-1 rounded-sm text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"
            title="Edit Registry"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => {
              if(confirm("TERMINATE_MISSION_RECORD: Are you sure?")) {
                onDelete?.(schedule.id);
              }
            }}
            className="bg-gray-800 border border-red-500/50 p-1 rounded-sm text-red-400 hover:bg-red-500 hover:text-white transition-all"
            title="Purge Record"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h14" />
            </svg>
          </button>
        </div>
      )}

      {/* Admin Crown Badge */}
      {schedule.isOfficial && (
        <div className="absolute -top-2 -right-2 bg-[#0a0a0a] border border-amber-500/50 p-1 rounded-full shadow-lg z-20">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
          </svg>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={clsx(
            "text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border rounded-full",
            typeColors[schedule.type]
          )}>
            {schedule.type}
          </span>
          <div className="flex items-center gap-2">
             {schedule.priority === 'critical' && !isPast && (
                <span className="flex h-2 w-2 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
             )}
             <span className={clsx("w-1.5 h-1.5 rounded-full", priorityColors[schedule.priority])} />
             <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono">
                {isPast ? "ARCHIVED" : schedule.status}
             </span>
          </div>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <Link href={`/schedule/${schedule.id}`} className="block group/title">
              <h3 className={clsx(
                "text-base font-bold tracking-wide mb-1 transition-colors group-hover/title:text-[var(--color-primary)]",
                isJoined ? "text-emerald-400" : (schedule.status === "active" ? "text-cyan-400" : "text-white")
              )}>
                {schedule.title}
                <span className="inline-block ml-2 opacity-0 group-hover/title:opacity-100 transition-opacity text-[10px]">&gt; VIEW_DETAILS</span>
              </h3>
            </Link>
            <p className="text-xs font-mono text-[var(--color-text-secondary)]">
              {format(new Date(schedule.date), "yyyy.MM.dd HH:mm", { locale: ko })}
            </p>
          </div>

          {!isPast && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleJoin}
              disabled={isProcessing}
              className={clsx(
                "px-3 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 min-w-[100px]",
                isJoined 
                  ? "border-emerald-500/50 text-emerald-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5" 
                  : "border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
              )}
            >
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.span key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 border-2 border-t-transparent border-current rounded-full animate-spin" />
                    {isJoined ? "ABORTING" : "AUTH..."}
                  </motion.span>
                ) : isJoined ? (
                  <motion.span key="joined" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="group-hover:hidden block">
                    GRANTED
                  </motion.span>
                ) : (
                  <motion.span key="join">JOIN_MISSION</motion.span>
                )}
                {isJoined && !isProcessing && (
                  <motion.span key="leave" className="hidden group-hover:block text-red-400">
                    ABORT_LINK
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-tighter opacity-60 font-mono">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {schedule.location || "TBA"}
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className={clsx("transition-all duration-500", isJoined && "text-emerald-400 font-bold")}>
                {localParticipants} UNITS_ENGAGED
              </span>
            </div>
          </div>
        </div>

        {schedule.description && (
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-primary)]/10 pt-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
            {schedule.description}
          </p>
        )}
      </div>

      {isJoined && (
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "100%" }}
          className="absolute bottom-0 left-0 h-[1px] bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
        />
      )}
    </motion.div>
  );
}
