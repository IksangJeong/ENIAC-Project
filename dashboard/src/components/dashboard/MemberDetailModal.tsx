"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Member, Schedule, Group } from "@/types";
import { GlitchText } from "@/components/ui";
import { mockSchedules, mockGroups } from "@/lib/mockData";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import clsx from "clsx";

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailModal({ member: initialMember, isOpen, onClose }: MemberDetailModalProps) {
  const { user: currentUser, setProfileSettingsOpen } = useAuthStore();
  
  if (!initialMember) return null;

  // 본인 프로필인 경우 스토어의 최신 유저 정보와 병합 (실시간 반영 보장)
  const isOwnProfile = currentUser?.id === initialMember.id;
  const member = isOwnProfile && currentUser ? {
    ...initialMember,
    ...currentUser,
    socialLinks: {
      ...initialMember.socialLinks,
      ...currentUser.socialLinks
    }
  } as Member : initialMember;

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

  const handleEditProfile = () => {
    onClose();
    setProfileSettingsOpen(true);
  };

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
              <div className="flex items-center gap-2">
                {isOwnProfile && (
                  <button 
                    onClick={handleEditProfile}
                    className="px-3 py-1 border border-[var(--color-primary)]/40 text-[9px] text-[var(--color-primary)] uppercase font-bold hover:bg-[var(--color-primary)] hover:text-black transition-all mr-2"
                  >
                    [EDIT_PROFILE]
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-white/10 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
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
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-2 font-bold">// Biography</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{member.bio || "No data."}</p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-primary)]/5">
                      {member.socialLinks?.github && (
                        <a 
                          href={getGithubUrl(member.socialLinks.github)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group"
                        >
                          <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          <span className="font-mono uppercase">GitHub: {member.socialLinks.github}</span>
                        </a>
                      )}
                      {member.socialLinks?.website && member.socialLinks.website.trim() !== "" && (
                        <a 
                          href={member.socialLinks.website.startsWith('http') ? member.socialLinks.website : `https://${member.socialLinks.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group"
                        >
                          <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                          <span className="font-mono uppercase truncate">Website: {member.socialLinks.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                      )}
                    </div>
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
