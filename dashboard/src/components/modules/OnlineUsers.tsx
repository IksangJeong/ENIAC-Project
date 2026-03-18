"use client";

import { Panel, StatusIndicator, CrowdLevel } from "@/components/ui";
import { motion } from "framer-motion";
import type { User, CrowdLevel as CrowdLevelType } from "@/types";

interface OnlineUsersProps {
  users: User[];
  crowdLevel: CrowdLevelType;
  delay?: number;
}

export function OnlineUsers({ users, crowdLevel, delay = 0 }: OnlineUsersProps) {
  const onlineUsers = users.filter((u) => u.status === "online");
  const offlineUsers = users.filter((u) => u.status === "offline");

  return (
    <Panel
      title="MEMBERS"
      subtitle={`${onlineUsers.length} ONLINE`}
      delay={delay}
      className="h-full"
    >
      <div className="space-y-4">
        {/* Crowd Level */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-accent-dim)]">
          <span className="text-[10px] uppercase tracking-wider opacity-50">
            CROWD LEVEL
          </span>
          <CrowdLevel level={crowdLevel} />
        </div>

        {/* Online Count */}
        <div className="flex items-center justify-center py-4">
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: delay + 0.2 }}
          >
            <div className="text-5xl font-bold glow">{onlineUsers.length}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-50 mt-1">
              MEMBERS ONLINE
            </div>
          </motion.div>
        </div>

        {/* User List */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {onlineUsers.slice(0, 5).map((user, index) => (
            <motion.div
              key={user.id}
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 * index }}
            >
              <StatusIndicator status="online" size="sm" pulse />
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full border border-[var(--color-accent-glow)]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-[10px]">
                  {user.name[0]}
                </div>
              )}
              <span className="truncate">{user.name}</span>
            </motion.div>
          ))}
          {onlineUsers.length > 5 && (
            <div className="text-[10px] text-center opacity-50 pt-1">
              + {onlineUsers.length - 5} MORE
            </div>
          )}
        </div>

        {/* Offline Stats */}
        <div className="pt-3 border-t border-[var(--color-accent-dim)]">
          <div className="flex items-center justify-between text-xs opacity-50">
            <span>OFFLINE</span>
            <span>{offlineUsers.length}</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
