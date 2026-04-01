"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Member, Schedule } from "@/types";
import { GlitchText } from "@/components/ui";
import { mockSchedules } from "@/lib/mockData";
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

  // 이 멤버가 참여 중인 일정 필터링
  const assignedSchedules = mockSchedules.filter(s => s.participantIds?.includes(member.id));

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
              "relative w-full max-w-2xl h-full bg-[var(--color-bg-black)] border-l border-[var(--color-primary)]/30 shadow-2xl",
              "flex flex-col overflow-hidden"
            )}
          >
            <div className="absolute inset-0 pointer-events-none scanline opacity-20" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-[var(--color-primary)] flex items-center justify-center font-bold text-xl">
                  {member.name[0]}
                </div>
                <div>
                  <GlitchText text={member.name} as="h2" className="text-2xl font-black uppercase tracking-tighter" />
                  <p className="text-xs text-[var(--color-primary)] font-mono uppercase">
                    ID: {member.id.padStart(4, '0')} // ACTIVITY_PULSE: {todayCommits > 10 ? 'OVERCLOCKED' : 'STABLE'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {/* Activity Pulse Header */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">// 7_DAY_ACTIVITY_PULSE</h3>
                    <span className="text-[9px] text-emerald-400/60 font-mono">NODE_HEALTH: 100%</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                    {weeklyActivity.map((count, i) => {
                      const height = Math.max((count / 15) * 100, 5);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            className={clsx(
                              "w-full rounded-t-sm transition-colors",
                              count > 10 ? "bg-rose-500" : count > 5 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                          />
                          <span className="text-[7px] text-[var(--color-text-secondary)] font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded flex flex-col justify-center items-center text-center">
                  <p className="text-[9px] text-[var(--color-text-secondary)] uppercase mb-1">Today_Commits</p>
                  <p className="text-3xl font-black text-[var(--color-primary)] tracking-tighter">
                    {todayCommits}
                  </p>
                  <p className="text-[8px] text-emerald-400 font-mono mt-1 animate-pulse">▲ ACTIVE</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Position & Dept</h3>
                    <p className="text-lg text-[var(--color-text-primary)] font-bold uppercase">
                      {member.position} <span className="text-[var(--color-text-secondary)] mx-2 text-sm">/</span> {member.department}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Bio</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {member.bio || "No description provided in the system database."}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Technical Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[10px] text-[var(--color-primary)] rounded">{skill}</span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 rounded">
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Current Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">Availability</p>
                        <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">{member.status}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">Join Date</p>
                        <p className="text-sm text-[var(--color-text-primary)] font-bold">{member.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  <section>
                    <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3 font-bold">// System Access</h3>
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex justify-between items-center border-b border-[var(--color-primary)]/10 pb-2">
                        <span className="text-[var(--color-text-secondary)] uppercase">Username</span>
                        <span className="text-[var(--color-primary)]">@{member.username}</span>
                      </div>
                      {member.socialLinks?.github && (
                        <div className="flex justify-between items-center border-b border-[var(--color-primary)]/10 pb-2 group/link">
                          <span className="text-[var(--color-text-secondary)] uppercase">Github</span>
                          <a href={getGithubUrl(member.socialLinks.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[var(--color-primary)] hover:text-white transition-colors bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)] px-2 py-1 rounded">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            OPEN_PROFILE
                          </a>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              {/* Assigned Processes (Schedules) - New Section */}
              <section className="mb-10">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Assigned_Processes</h3>
                <div className="grid grid-cols-1 gap-2">
                  {assignedSchedules.length > 0 ? (
                    assignedSchedules.map(schedule => (
                      <Link 
                        key={schedule.id}
                        href={`/schedule/${schedule.id}`}
                        className="flex items-center justify-between p-3 border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            schedule.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          )} />
                          <div>
                            <p className="text-[11px] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{schedule.title}</p>
                            <p className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">{schedule.type} // {schedule.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-mono text-[var(--color-primary)] opacity-60">[{schedule.status.toUpperCase()}]</p>
                          <p className="text-[8px] text-[var(--color-text-secondary)]">{new Date(schedule.date).toLocaleDateString()}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 border border-dashed border-[var(--color-primary)]/10 rounded text-center">
                      <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-mono">No active processes assigned to this node.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Recent System Activity Log */}
              <section className="mt-8">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Recent System Activity</h3>
                <div className="space-y-2">
                  <div className="flex gap-4 p-3 border border-emerald-500/20 bg-emerald-500/5 text-[11px] font-mono animate-pulse">
                    <span className="text-emerald-400">[{new Date().toISOString().slice(0, 10)}]</span>
                    <span className="text-emerald-400 uppercase">System.Update:</span>
                    <span className="text-[var(--color-text-primary)] font-bold">Node Configuration synchronized successfully.</span>
                  </div>
                  <div className="flex gap-4 p-3 border border-[var(--color-primary)]/10 bg-[var(--color-bg-black)]/50 text-[11px] font-mono">
                    <span className="text-[var(--color-primary)]">[{new Date().toISOString().slice(0, 10)}]</span>
                    <span className="text-[var(--color-text-secondary)] uppercase">Commit.Sync:</span>
                    <span className="text-[var(--color-text-primary)]">Logged {todayCommits} new interactions to global branch.</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-[var(--color-primary)]/20 text-[10px] text-[var(--color-text-secondary)] font-mono flex justify-between">
              <span>SECURITY_LEVEL: {member.role === 'admin' ? 'MAXIMUM' : 'STANDARD'}</span>
              <span className="animate-pulse">_LISTENING_FOR_COMMANDS...</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
