"use client";

import { useParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { useScheduleStore } from "@/stores/scheduleStore";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import clsx from "clsx";

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getScheduleById } = useScheduleStore();
  const schedule = getScheduleById(params.id as string);

  if (!schedule) {
    return (
      <ProtectedRoute>
        <PageLayout>
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

  return (
    <ProtectedRoute>
      <PageLayout activePage="schedule">
        <div className="max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar pr-2">
          {/* Header Navigation */}
          <div className="flex items-center gap-4 mb-8 text-[10px] font-mono">
            <Link href="/schedule" className="opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">
              &lt; RETURN_TO_TIMELINE
            </Link>
            <span className="opacity-20">/</span>
            <span className="text-[var(--color-primary)]">MISSION_DEBRIEFING: {schedule.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
            {/* Left Column: Data Grid */}
            <div className="md:col-span-2 space-y-8">
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

              {/* Recruitment Progress */}
              <section className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)]" />
                    Unit_Engagement_Status
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatusCard label="Current Units" value={schedule.participants || 0} />
                    <StatusCard label="Mission Capacity" value="40" />
                    <StatusCard label="Engagement Rate" value={Math.round(((schedule.participants || 0) / 40) * 100) + "%"} />
                 </div>
              </section>
            </div>

            {/* Right Column: System Logs */}
            <div className="space-y-6">
               <div className="border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]/60 p-4 rounded-sm space-y-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">SYSTEM_LOGS</h3>
                  <div className="space-y-2 font-mono text-[9px] text-gray-500">
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> NODE_SYNC_COMPLETED</p>
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> DATA_PACKETS_RETRIEVED</p>
                     <p className="flex gap-2"><span className="text-amber-500">[WARN]</span> ENCRYPTION_LAYER_3_EXPIRED</p>
                     <p className="flex gap-2"><span className="text-[var(--color-primary)]">[OK]</span> DEBRIEFING_UI_LOADED</p>
                  </div>
               </div>

               <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-sm space-y-3">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500/70">AUTHORIZED_COMMANDS</h3>
                  <button className="w-full py-2 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-[9px] uppercase tracking-widest transition-all">
                    REQUEST_EDIT_ACCESS
                  </button>
                  <button className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 text-[9px] uppercase tracking-widest transition-all">
                    TERMINATE_OPERATION
                  </button>
               </div>
            </div>
          </div>
        </div>
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
    <div className="border border-[var(--color-primary)]/10 bg-white/5 p-4 text-center space-y-1">
      <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">{label}</span>
      <p className="text-xl font-bold text-[var(--color-primary)] font-mono">{value}</p>
    </div>
  );
}
