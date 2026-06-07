"use client";

import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { MemberDetailModal } from "@/components/dashboard";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import { Member } from "@/types";
import Link from "next/link";
import clsx from "clsx";

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getScheduleById, loadSchedules, loading: scheduleLoading } = useScheduleStore();
  const { user: currentUser, members, loadMembers, loading: memberLoading } = useAuthStore();
  
  useEffect(() => {
    loadSchedules();
    loadMembers();
  }, [loadSchedules, loadMembers]);

  const schedule = getScheduleById(params.id as string);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이 일정에 참여 중인 멤버 필터링
  const participatingNodes = useMemo(() => {
    if (!schedule?.participantIds) return [];
    return members.filter(m => schedule.participantIds?.includes(m.id));
  }, [schedule, members]);

  if ((scheduleLoading || memberLoading) && !schedule) {
    return (
      <ProtectedRoute>
        <PageLayout activePage="schedule">
          <div className="flex flex-col items-center justify-center h-[60vh] font-mono">
            <div className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-[0.3em]">
              // SYNCING_OPERATION_DEBRIEFING...
            </div>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (!schedule) {
    return (
      <ProtectedRoute>
        <PageLayout activePage="schedule">
          <div className="flex flex-col items-center justify-center h-[60vh] font-mono">
            <h1 className="text-red-500 text-2xl mb-4 font-bold">ERROR: DATA_NOT_FOUND</h1>
            <p className="text-gray-500 mb-8 uppercase tracking-widest">Requested record is no longer available in the local node.</p>
            <Link href="/schedule" className="px-6 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all">
              RETURN_TO_TIMELINE
            </Link>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <PageLayout activePage="schedule">
        <div className="max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar pr-2">
          {/* Header Navigation */}
          <div className="flex items-center gap-4 mb-8 text-[10px] font-mono">
            <Link href="/schedule" className="opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">
              &lt; RETURN_TO_TIMELINE
            </Link>
            <span className="opacity-20">/</span>
            <span className="text-[var(--color-primary)]">MISSION_DEBRIEFING: {schedule.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Left Column: Data Grid */}
            <div className="lg:col-span-2 space-y-10">
              <header className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                    {schedule.type}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                    schedule.priority === 'critical' ? "text-red-500 border-red-500/30 bg-red-500/5" : "text-amber-500 border-amber-500/30 bg-amber-500/5"
                  )}>
                    {schedule.priority}_PRIORITY
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white uppercase leading-tight">
                  {schedule.title}
                </h1>
              </header>

              <section className="border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]/40 p-6 rounded-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                   </svg>
                </div>

                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <DataPoint label="Temporal_Data" value={format(new Date(schedule.date), "yyyy.MM.dd EEEE", { locale: ko })} subValue={format(new Date(schedule.date), "HH:mm (GMT+09:00)")} />
                  <DataPoint label="Sector_Location" value={schedule.location || "UNSPECIFIED"} subValue="COORDINATES_ENCRYPTED" />
                </div>

                <div className="space-y-2 border-t border-[var(--color-primary)]/10 pt-6">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 text-[var(--color-primary)]">
                    &gt; MISSION_OBJECTIVES
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                    {schedule.description || "No mission brief provided for this operation."}
                  </p>
                </div>
              </section>

              {/* Participating Nodes - New Section */}
              <section className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-[var(--color-primary)]">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    Participating_Nodes (Active Clusters)
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {participatingNodes.length > 0 ? (
                      participatingNodes.map(member => (
                        <div 
                          key={member.id}
                          onClick={() => handleMemberClick(member)}
                          className="flex items-center gap-4 p-3 border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10 transition-all cursor-pointer group"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full border border-[var(--color-primary)]/30 overflow-hidden">
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                                  {member.name[0]}
                                </div>
                              )}
                            </div>
                            <div className={clsx(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-bg-black)]",
                              member.status === 'online' ? "bg-emerald-500" : "bg-slate-500"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-white group-hover:text-[var(--color-primary)] transition-colors uppercase truncate">
                              {member.name}
                            </p>
                            <p className="text-[9px] text-[var(--color-text-secondary)] font-mono uppercase truncate">
                              {member.position} // {member.department}
                            </p>
                          </div>
                          <div className="text-[10px] font-mono text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                            &gt; INSPECT
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="sm:col-span-2 p-8 border border-dashed border-[var(--color-primary)]/10 rounded text-center">
                        <p className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase tracking-widest">No nodes currently engaged in this operation.</p>
                      </div>
                    )}
                 </div>
              </section>
            </div>

            {/* Right Column: System Logs & Stats */}
            <div className="space-y-6">
               <section className="space-y-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Engagement_Metrics</h3>
                 <div className="grid grid-cols-1 gap-2">
                    <StatusCard label="Active Nodes" value={participatingNodes.length} />
                    <StatusCard label="Total Capacity" value="40" />
                    <StatusCard label="Efficiency" value={Math.round((participatingNodes.length / 10) * 100) + "%"} />
                 </div>
               </section>

               <div className="border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]/60 p-4 rounded-sm space-y-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">SYSTEM_LOGS</h3>
                  <div className="space-y-2 font-mono text-[9px] text-gray-500">
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> NODE_SYNC_COMPLETED</p>
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> {participatingNodes.length} DATA_PACKETS_RETRIEVED</p>
                     <p className="flex gap-2"><span className="text-amber-500">[WARN]</span> ENCRYPTION_LAYER_3_EXPIRED</p>
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> DEBRIEFING_UI_LOADED</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Member Modal Integration */}
        <MemberDetailModal 
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}

function DataPoint({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[9px] font-mono uppercase tracking-widest opacity-40">{label}</span>
      <p className="text-base font-bold text-white uppercase">{value}</p>
      {subValue && <p className="text-[10px] font-mono text-[var(--color-primary)]/60">{subValue}</p>}
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[var(--color-primary)]/10 bg-white/5 p-4 flex justify-between items-center">
      <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">{label}</span>
      <p className="text-lg font-bold text-[var(--color-primary)] font-mono">{value}</p>
    </div>
  );
}
