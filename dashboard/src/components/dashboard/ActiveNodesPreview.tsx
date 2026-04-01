"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { User } from "@/types";

interface ActiveNodesPreviewProps {
  users: User[];
  delay?: number;
  className?: string;
}

const mockActivities = [
  "Compiling API_v2",
  "Reviewing PR #142",
  "Debugging auth flow",
  "Writing tests",
];

export function ActiveNodesPreview({ users, delay = 0, className }: ActiveNodesPreviewProps) {
  const onlineUsers = users.filter((u) => u.status === "online");
  const top3 = users.slice(0, 3);

  return (
    <motion.div
      className={clsx(
        "h-full flex flex-col",
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)]",
        "p-3 rounded-sm panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Active Nodes
        </h3>
        <span className="text-[11px] font-mono bg-[var(--color-primary)] text-[var(--color-bg-black)] px-1.5 py-0.5">
          {onlineUsers.length} ONLINE
        </span>
      </div>

      {/* User List */}
      <div className="flex-1 space-y-2 min-h-0">
        {top3.map((user, index) => (
          <motion.div
            key={user.id}
            className={clsx(
              "flex items-center gap-2",
              user.status === "offline" && "opacity-50"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 * index }}
          >
            {/* Avatar with Status */}
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)] flex items-center justify-center text-[11px]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  user.name[0]
                )}
              </div>
              <div
                className={clsx(
                  "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--color-bg-dark)]",
                  user.status === "online"
                    ? "bg-[var(--color-primary)] shadow-[0_0_6px_var(--color-accent-glow)]"
                    : "bg-[var(--color-text-secondary)]/30"
                )}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                {user.status === "online"
                  ? mockActivities[index % mockActivities.length]
                  : "Offline"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/members"
        className={clsx(
          "mt-2 py-1.5 text-center",
          "text-[11px] uppercase tracking-widest",
          "border border-[var(--color-primary)]/20",
          "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-black)]",
          "transition-all duration-300"
        )}
      >
        See All Members →
      </Link>
    </motion.div>
  );
}
