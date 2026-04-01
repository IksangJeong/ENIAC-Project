"use client";

import { motion } from "framer-motion";
import { Member } from "@/types";
import clsx from "clsx";

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const isOnline = member.status === "online";
  const isAway = member.status === "away";

  const skillsText = member.skills?.join(", ") || "NONE";
  const todayCommits = member.metrics?.todayCommits || 0;
  
  // 커밋 수에 따른 게이지 색상 및 길이 (최대 15개 기준)
  const gaugeWidth = Math.min((todayCommits / 15) * 100, 100);
  const gaugeColor = todayCommits > 10 ? "bg-rose-500" : todayCommits > 5 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="p-2 overflow-visible">
      <motion.div
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={clsx(
          "relative p-5 rounded-lg border cursor-pointer overflow-hidden group",
          "bg-[var(--color-bg-black)]/40 backdrop-blur-sm",
          "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50",
          "transition-all duration-300 shadow-lg hover:shadow-[var(--color-primary)]/10",
          todayCommits >= 10 && "animate-pulse border-rose-500/30" // 10개 이상 커밋 시 오버클럭 효과
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start gap-4">
          <div className="relative">
            <div className={clsx(
              "w-16 h-16 rounded-full border-2 p-1 flex items-center justify-center overflow-hidden transition-colors duration-500",
              isOnline ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : 
              isAway ? "border-amber-500/50" : "border-slate-500/50"
            )}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-[var(--color-primary)]/10 flex items-center justify-center rounded-full">
                  <span className="text-xl font-bold text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    {member.name[0]}
                  </span>
                </div>
              )}
            </div>
            <div className={clsx(
              "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[var(--color-bg-black)]",
              isOnline ? "bg-emerald-500 animate-pulse" : isAway ? "bg-amber-500" : "bg-slate-500"
            )} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                {member.name}
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono tracking-widest text-[var(--color-text-secondary)] opacity-60">
                  [{member.role.toUpperCase()}]
                </span>
                {todayCommits > 0 && (
                  <span className="text-[8px] font-mono text-emerald-400 mt-0.5 animate-bounce">
                    🔥 {todayCommits}
                  </span>
                )}
              </div>
            </div>
            
            {member.statusMessage && (
              <p className="text-[9px] font-mono text-emerald-400/80 mb-2 truncate italic">
                {">"} {member.statusMessage}
              </p>
            )}
            
            <p className="text-[10px] font-bold text-[var(--color-primary)] mb-2 uppercase tracking-tighter">
              {member.position} <span className="opacity-30">|</span> {member.department}
            </p>
            
            {/* Activity Pulse Gauge */}
            <div className="mb-3 space-y-1">
              <div className="flex justify-between items-center text-[8px] font-mono text-[var(--color-text-secondary)] uppercase">
                <span>Activity_Pulse</span>
                <span>{todayCommits} COMMITS</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${gaugeWidth}%` }}
                  className={clsx("h-full transition-colors duration-500", gaugeColor)}
                />
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--color-primary)]/10">
              <p className="text-[9px] font-mono text-[var(--color-text-secondary)] leading-tight line-clamp-1 group-hover:text-[var(--color-primary)]/70 transition-colors">
                <span className="text-[var(--color-primary)]/40 mr-1">STACK:</span>
                {skillsText || "NONE"}
              </p>
            </div>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-primary)]/0 group-hover:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-primary)]/0 group-hover:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-primary)]/0 group-hover:border-[var(--color-primary)]/40 transition-all" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-primary)]/0 group-hover:border-[var(--color-primary)]/40 transition-all" />

        <div className="absolute bottom-2 right-3 text-[8px] font-mono text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-40 transition-opacity">
          SYS_JOIN_DT: {member.joinDate}
        </div>
      </motion.div>
    </div>
  );
}
