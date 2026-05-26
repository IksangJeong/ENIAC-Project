"use client";

import { motion } from "framer-motion";
import { Group, Member } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { useMemo } from "react";
import clsx from "clsx";

interface GroupCardProps {
  group: Group;
  onClick?: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  // 그룹 상태에 따른 색상 지정
  const statusColors = {
    booting: "text-amber-400 border-amber-400 bg-amber-400/5",
    processing: "text-cyan-400 border-cyan-400 bg-cyan-400/5",
    stabilized: "text-emerald-400 border-emerald-400 bg-emerald-400/5",
    halted: "text-red-400 border-red-400 bg-red-400/5",
  };

  const statusGlow = {
    booting: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
    processing: "shadow-[0_0_10px_rgba(34,211,238,0.3)]",
    stabilized: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    halted: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
  };

  const typeColors = {
    study: "text-purple-400 border-purple-400/30 bg-purple-400/5",
    project: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  };

  const { members } = useAuthStore();

  // 그룹 멤버 데이터 매핑
  const groupMembers = useMemo(() => {
    return group.memberIds
      .map(id => members.find(m => m.id === id))
      .filter(Boolean) as Member[];
  }, [group.memberIds, members]);

  return (
    <div className="p-2 overflow-visible">
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={clsx(
          "relative p-5 rounded-lg border cursor-pointer overflow-hidden group/card",
          "bg-[var(--color-bg-black)]/40 backdrop-blur-sm",
          "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50",
          "transition-all duration-300 shadow-lg hover:shadow-[var(--color-primary)]/10"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

        <div className="flex flex-col gap-4">
          {/* Header: Type & Status */}
          <div className="flex items-center justify-between">
            <span className={clsx(
              "text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border rounded-sm font-mono",
              typeColors[group.type]
            )}>
              {group.type}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={clsx(
                "text-[8px] uppercase tracking-widest font-mono font-bold",
                statusColors[group.status].split(' ')[0]
              )}>
                {group.status}
              </span>
              <span className={clsx(
                "w-2 h-2 rounded-full border",
                statusColors[group.status],
                group.status === 'processing' && "animate-pulse",
                statusGlow[group.status]
              )} />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate group-hover/card:text-[var(--color-primary)] transition-colors mb-1 uppercase tracking-tight">
              {group.name}
            </h3>
            <p className="text-[10px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed opacity-80 h-7">
              {group.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 h-5 overflow-hidden">
            {group.techStack.length > 0 ? (
              group.techStack.map(tech => (
                <span key={tech} className="text-[9px] text-[var(--color-primary)]/80 font-mono bg-[var(--color-primary)]/10 px-1.5 rounded-sm">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-[9px] text-[var(--color-text-secondary)]/50 font-mono italic">NO_STACK_DEFINED</span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between items-center text-[8px] font-mono text-[var(--color-text-secondary)] uppercase">
              <span>Sync_Progress</span>
              <span className="text-[var(--color-primary)]">{group.progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${group.progress}%` }}
                className={clsx(
                  "absolute top-0 left-0 h-full transition-all duration-1000",
                  group.progress === 100 ? "bg-emerald-500" : "bg-[var(--color-primary)]"
                )}
              />
            </div>
          </div>

          {/* Footer: Members & Date */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--color-primary)]/10">
            <div className="flex -space-x-1.5 overflow-hidden">
              {groupMembers.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="relative w-6 h-6 rounded-full border border-[var(--color-bg-black)] overflow-hidden"
                  title={member.name}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[8px] font-bold text-[var(--color-primary)]">
                      {member.name[0]}
                    </div>
                  )}
                </div>
              ))}
              {groupMembers.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-800 border border-[var(--color-bg-black)] flex items-center justify-center text-[7px] font-bold text-gray-400 z-10 relative">
                  +{groupMembers.length - 4}
                </div>
              )}
            </div>
            <span className="text-[8px] font-mono text-[var(--color-text-secondary)] opacity-50 uppercase">
              INIT: {group.createdAt}
            </span>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-primary)]/0 group-hover/card:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-primary)]/0 group-hover/card:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-primary)]/0 group-hover/card:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-primary)]/0 group-hover/card:border-[var(--color-primary)]/40 transition-all" />
      </motion.div>
    </div>
  );
}
