"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Group, Member, GroupStatus } from "@/types";
import { GlitchText } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { useGroupStore } from "@/stores/groupStore";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

interface GroupDetailModalProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GroupDetailModal({ group, isOpen, onClose }: GroupDetailModalProps) {
  const { user, getAllMembers } = useAuthStore();
  const { updateGroup } = useGroupStore();
  const { schedules, loadSchedules } = useScheduleStore();

  useEffect(() => {
    if (isOpen) {
      loadSchedules();
    }
  }, [isOpen, loadSchedules]);
  
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState("");
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [editProgressValue, setEditProgressValue] = useState(0);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    if (group) {
      setEditGoalValue(group.goal || "");
      setEditProgressValue(group.progress);
    }
  }, [group]);

  // 중앙 집중화된 전체 멤버 리스트에서 이 그룹의 멤버들을 안전하게 추출
  const allMembers = useMemo(() => getAllMembers(), [getAllMembers]);
  
  const groupMembers = useMemo(() => {
    if (!group) return [];
    return group.memberIds
      .map(id => allMembers.find(m => m.id === id))
      .filter(Boolean) as Member[];
  }, [group, allMembers]);

  const groupSchedules = useMemo(() => {
    if (!group) return [];
    return schedules.filter(s => s.groupId === group.id);
  }, [group, schedules]);

  const leader = useMemo(() => {
    return groupMembers.find(m => m.id === group?.leaderId);
  }, [groupMembers, group?.leaderId]);

  if (!group) return null;

  const hasEditPermission = user?.id === group.leaderId;

  const statusColors = {
    booting: "text-amber-400 border-amber-400 bg-amber-400/5",
    processing: "text-cyan-400 border-cyan-400 bg-cyan-400/5",
    stabilized: "text-emerald-400 border-emerald-400 bg-emerald-400/5",
    halted: "text-red-400 border-red-400 bg-red-400/5",
  };

  const handleAddMember = (memberId: string) => {
    const updatedMembers = [...group.memberIds, memberId];
    updateGroup(group.id, { memberIds: updatedMembers });
    setIsAddingMember(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[var(--color-bg-black)]/80 backdrop-blur-sm" />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={clsx("relative w-full max-w-3xl h-full bg-[var(--color-bg-black)] border-l shadow-2xl flex flex-col overflow-hidden", hasEditPermission ? "border-amber-500/30" : "border-[var(--color-primary)]/30")}
          >
            <div className="absolute inset-0 pointer-events-none scanline opacity-20" />
            <div className={clsx("flex items-center justify-between p-6 border-b", hasEditPermission ? "border-amber-500/20 bg-amber-500/5" : "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5")}>
              <div className="flex items-center gap-4">
                <div className={clsx("w-12 h-12 border flex items-center justify-center font-bold text-xl", hasEditPermission ? "border-amber-500 text-amber-500" : "border-[var(--color-primary)]")}>{group.type === 'project' ? 'P' : 'S'}</div>
                <div>
                  <GlitchText text={group.name} as="h2" className={clsx("text-2xl font-black uppercase tracking-tighter", hasEditPermission && "text-amber-400")} />
                  <p className="text-xs text-[var(--color-text-secondary)] font-mono uppercase mt-1">CLUSTER_ID: {group.id.padStart(4, '0')} // STATUS: {group.status}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <section className="mb-10 p-5 bg-black/40 border border-[var(--color-primary)]/20 rounded-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className={clsx("w-2 h-2 rounded-full animate-pulse", statusColors[group.status].split(' ')[1].replace('border-', 'bg-'))} />
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase font-mono">Sync_Progress</span>
                    <span className="text-xs font-bold text-[var(--color-primary)]">{group.progress}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${group.progress}%` }} className={clsx("h-full", group.progress === 100 ? "bg-emerald-500" : "bg-[var(--color-primary)]")} />
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Cluster_Operations</h3>
                <div className="space-y-2">
                  {groupSchedules.length > 0 ? groupSchedules.map(s => (
                    <Link key={s.id} href={`/schedule/${s.id}`} className="flex items-center justify-between p-3 border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-all">
                      <span className="text-[11px] font-bold text-white uppercase">{s.title}</span>
                      <span className="text-[9px] font-mono text-[var(--color-text-secondary)]">{s.date.slice(0, 10)}</span>
                    </Link>
                  )) : <p className="text-[10px] text-gray-600 font-mono italic">NO_OPERATIONS_SCHEDULED</p>}
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4 font-bold">// Assigned_Nodes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groupMembers.map(m => (
                    <Link key={m.id} href={`/members?id=${m.id}`} className="flex items-center gap-3 p-2 border border-[var(--color-primary)]/10 bg-black/20 hover:border-[var(--color-primary)]/40 transition-all">
                      <div className="w-8 h-8 rounded-full border border-[var(--color-primary)]/20 overflow-hidden shrink-0">
                        {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/10 text-[10px] font-bold">{m.name[0]}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white uppercase truncate">{m.name}</p>
                        <p className="text-[8px] text-[var(--color-text-secondary)] font-mono uppercase truncate">{m.position}</p>
                      </div>
                    </Link>
                  ))}
                  {hasEditPermission && <button onClick={() => setIsAddingMember(true)} className="flex items-center justify-center p-2 border border-dashed border-amber-500/20 text-amber-500/40 hover:border-amber-500 hover:text-amber-500 transition-all text-[9px] font-mono">+ ASSIGN_NODE</button>}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
      
      {isAddingMember && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-black)] border border-amber-500/40 p-6 w-full max-w-sm rounded-sm">
            <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4 font-mono">// SELECT_NODE_TO_ASSIGN</h4>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
              {allMembers.filter(m => !group.memberIds.includes(m.id)).map(m => (
                <button key={m.id} onClick={() => handleAddMember(m.id)} className="w-full text-left p-2 text-xs text-amber-50 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all font-mono">{m.name} ({m.department})</button>
              ))}
            </div>
            <button onClick={() => setIsAddingMember(false)} className="w-full mt-4 py-2 text-[9px] font-mono text-red-400 hover:text-white transition-colors uppercase">[ABORT]</button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
