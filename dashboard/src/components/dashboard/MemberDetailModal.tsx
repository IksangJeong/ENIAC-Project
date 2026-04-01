"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Member, Schedule, Group } from "@/types";
import { GlitchText } from "@/components/ui";
import { mockSchedules, mockGroups } from "@/lib/mockData";
import Link from "next/link";
import clsx from "clsx";

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailModal({ member, isOpen, onClose }: MemberDetailModalProps) {
  if (!member) return null;

  const getGithubUrl = (github: string) => {
    if (!github) return "#";
    if (github.startsWith("http")) return github;
    return `https://github.com/${github}`;
  };

  const todayCommits = member.metrics?.todayCommits || 0;
  const weeklyActivity = member.metrics?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];

  // 이 멤버가 참여 중인 일정 및 그룹 필터링
  const assignedSchedules = mockSchedules.filter(s => s.participantIds?.includes(member.id));
  const joinedGroups = mockGroups.filter(g => g.memberIds.includes(member.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-bg-black)]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={clsx(
              "relative w-full max-w-2xl h-full bg-[var(--color-bg-black)] border-l border-[var(--color-primary)]/30 shadow-2xl flex flex-col overflow-hidden"
            )}
          >
            <div className="absolute inset-0 pointer-events-none scanline opacity-20" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-[var(--color-primary)] flex items-center justify-center font-bold text-xl">{member.name[0]}</div>
                <div>
                  <GlitchText text={member.name} as="h2" className="text-2xl font-black uppercase tracking-tighter" />
                  <p className="text-xs text-[var(--color-primary)] font-mono uppercase mt-1">ID: {member.id.padStart(4, '0')} // ACTIVITY: {todayCommits > 10 ? 'HIGH' : 'NORMAL'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              
              {/* Activity Pulse */}
              <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">// 7_DAY_ACTIVITY_PULSE</h3>
                  <span className="text-[9px] text-emerald-400/60 font-mono">TODAY: {todayCommits}</span>
                </div>
                <div className="flex items-end gap-1 h-10">
                  {weeklyActivity?.map((count, i) => (
                    <div key={i} className={clsx("flex-1 rounded-t-sm transition-all", count > 10 ? "bg-rose-500" : count > 5 ? "bg-amber-500" : "bg-emerald-500")} style={{ height: `${Math.max((count / 15) * 100, 5)}%` }} />
                  ))}
                </div>
              </div>

              {/* Joined Clusters (Groups) */}
              <section className="mb-10">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Joined_Clusters</h3>
                <div className="grid grid-cols-2 gap-3">
                  {joinedGroups?.length > 0 ? joinedGroups.map(group => (
                    <Link 
                      key={group.id}
                      href={`/groups?id=${group.id}`}
                      className="p-3 border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10 transition-all group/gcard"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[8px] font-mono text-[var(--color-primary)]/60 uppercase">[{group.type}]</span>
                        <span className={clsx("w-1.5 h-1.5 rounded-full", group.status === 'processing' ? "bg-cyan-400 animate-pulse" : "bg-emerald-500")} />
                      </div>
                      <p className="text-[11px] font-bold text-white group-hover/gcard:text-[var(--color-primary)] transition-colors uppercase truncate">{group.name}</p>
                      <div className="mt-2 h-0.5 w-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)]" style={{ width: `${group.progress}%` }} />
                      </div>
                    </Link>
                  )) : (
                    <p className="text-[10px] text-gray-600 font-mono italic col-span-2 px-2">NO_CLUSTER_AFFILIATION_FOUND</p>
                  )}
                </div>
              </section>

              {/* Assigned Processes (Schedules) */}
              <section className="mb-10">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Assigned_Processes</h3>
                <div className="space-y-2">
                  {assignedSchedules?.length > 0 ? assignedSchedules.map(schedule => (
                    <Link key={schedule.id} href={`/schedule/${schedule.id}`} className="flex items-center justify-between p-3 border border-[var(--color-primary)]/10 bg-black/20 hover:bg-[var(--color-primary)]/5 transition-all group/scard">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-[var(--color-primary)] rounded-full" />
                        <div>
                          <p className="text-[11px] font-bold text-white group-hover/scard:text-[var(--color-primary)] transition-colors uppercase">{schedule.title}</p>
                          <p className="text-[8px] text-[var(--color-text-secondary)] font-mono uppercase">{schedule.date.slice(0, 10)} // {schedule.location}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-[var(--color-primary)]/40 opacity-0 group-hover/scard:opacity-100 transition-opacity">&gt; VIEW</span>
                    </Link>
                  )) : (
                    <p className="text-[10px] text-gray-600 font-mono italic px-2">NO_PROCESSES_IN_QUEUE</p>
                  )}
                </div>
              </section>

              {/* Details & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <div>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Position_Dept</h3>
                    <p className="text-sm text-white font-bold uppercase">{member.position} / {member.department}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Biography</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{member.bio || "No data."}</p>
                  </div>
                </section>
                <section>
                  <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Technical_Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills?.length > 0 ? member.skills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 text-[9px] text-[var(--color-primary)] rounded-sm">{skill}</span>
                    )) : (
                      <span className="text-[9px] text-gray-600 font-mono italic">EMPTY_STACK_LOADED</span>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--color-primary)]/20 text-[10px] text-[var(--color-text-secondary)] font-mono flex justify-between bg-black/40">
              <span>ACCESS_LEVEL: {member.role?.toUpperCase() || "VIEWER"}</span>
              <span className="animate-pulse">_LISTENING_FOR_LINK_COMMANDS...</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
