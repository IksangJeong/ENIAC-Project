"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Schedule, Member } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/stores/authStore";
import { MemberDetailModal } from "@/components/dashboard";
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
  const { isAdmin, user: currentUser, members } = useAuthStore();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const participatingNodes = useMemo(() => {
    return members.filter(m => schedule.participantIds?.includes(m.id));
  }, [schedule.participantIds, members]);

  const [isJoined, setIsJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleMemberClick = (e: React.MouseEvent, member: Member) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  return (
    <>
      <motion.div
        layout
        className={clsx(
          "relative p-5 border rounded-sm transition-all duration-300 group bg-[var(--color-bg-black)]/40 backdrop-blur-sm",
          isPast ? "opacity-50 grayscale-[0.5]" : "opacity-100",
          schedule.status === "active" ? "border-cyan-400/50 glow-sm" : "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40",
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Top Row: Type and Priority */}
          <div className="flex items-center justify-between">
            <span className={clsx(
              "text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border rounded-full font-mono",
              typeColors[schedule.type]
            )}>
              {schedule.type}
            </span>
            <div className="flex items-center gap-2">
               <span className={clsx("w-1.5 h-1.5 rounded-full", priorityColors[schedule.priority])} />
               <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono">
                  {isPast ? "ARCHIVED" : schedule.status}
               </span>
            </div>
          </div>

          {/* Middle Row: Title and Info */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/schedule/${schedule.id}`} className="inline-block group/title">
                <h3 className={clsx(
                  "text-lg font-bold tracking-tight mb-1 transition-colors uppercase truncate",
                  schedule.status === "active" ? "text-cyan-400" : "text-white group-hover/title:text-[var(--color-primary)]"
                )}>
                  {schedule.title}
                </h3>
              </Link>
              <p className="text-[10px] font-mono text-[var(--color-text-secondary)] opacity-60">
                {format(new Date(schedule.date), "yyyy.MM.dd HH:mm", { locale: ko })} // {schedule.location || "TBA"}
              </p>
            </div>
          </div>

          {/* Bottom Row: Participants Nodes */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--color-primary)]/10">
            <div className="flex -space-x-2 overflow-hidden">
              {participatingNodes.length > 0 ? (
                participatingNodes.slice(0, 5).map((member) => (
                  <button
                    key={member.id}
                    onClick={(e) => handleMemberClick(e, member)}
                    className="relative w-7 h-7 rounded-full border border-[var(--color-bg-black)] overflow-hidden hover:z-10 hover:scale-110 transition-transform"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
                        {member.name[0]}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <span className="text-[9px] font-mono text-[var(--color-text-secondary)] opacity-40 italic">NO_UNITS_ENGAGED</span>
              )}
              {participatingNodes.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-gray-800 border border-[var(--color-bg-black)] flex items-center justify-center text-[8px] font-bold text-gray-400">
                  +{participatingNodes.length - 5}
                </div>
              )}
            </div>

            <Link 
              href={`/schedule/${schedule.id}`}
              className="text-[9px] font-mono text-[var(--color-primary)] opacity-60 hover:opacity-100 transition-all uppercase tracking-widest"
            >
              &gt; VIEW_DEBRIEFING
            </Link>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--color-primary)]/10 group-hover:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--color-primary)]/10 group-hover:border-[var(--color-primary)]/40 transition-all" />
      </motion.div>

      <MemberDetailModal 
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />
    </>
  );
}
