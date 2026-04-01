"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { GroupCard, GroupDetailModal, GroupCreateModal } from "@/components/dashboard";
import { useGroupStore } from "@/stores/groupStore";
import { useAuthStore } from "@/stores/authStore";
import { Group } from "@/types";
import clsx from "clsx";

function GroupsPageContent() {
  const { groups } = useGroupStore();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const targetGroupId = searchParams.get("id");
  
  const [filter, setFilter] = useState<"all" | "project" | "study">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 딥링크 처리: URL에 id가 있으면 해당 그룹 모달 오픈
  useEffect(() => {
    if (targetGroupId) {
      const group = groups.find(g => g.id === targetGroupId);
      if (group) {
        setSelectedGroup(group);
        setIsDetailModalOpen(true);
      }
    }
  }, [targetGroupId, groups]);

  const filteredGroups = groups.filter(group => {
    const matchesFilter = filter === "all" || group.type === filter;
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          group.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDetailModalOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <PageLayout activePage="groups">
      <div className="h-full flex flex-col gap-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-primary)]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tighter uppercase mb-1 flex items-center gap-3">
              Sub_Clusters
              {isAdmin && (
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-[10px] font-mono text-amber-500 border border-amber-500/50 px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-black transition-all hidden sm:block"
                >
                  + INITIALIZE_NEW_CLUSTER
                </button>
              )}
            </h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] font-mono">
              // ACTIVE_PROJECTS_AND_STUDY_GROUPS
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex border border-[var(--color-primary)]/30 rounded overflow-hidden">
              {["all", "project", "study"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={clsx(
                    "px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                    filter === f ? "bg-[var(--color-primary)] text-black font-bold" : "bg-[var(--color-bg-black)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative group">
              <input
                type="text"
                placeholder="SEARCH_BY_NAME_OR_TECH..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 rounded px-4 py-2 text-[10px] font-mono text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:glow-sm transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">🔍</div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden group/scroll">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none opacity-60" />
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar overflow-x-hidden">
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 pb-32">
                <AnimatePresence mode="popLayout">
                  {filteredGroups.map((group, index) => (
                    <motion.div key={group.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                      <GroupCard group={group} onClick={() => handleGroupClick(group)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (

              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[var(--color-primary)]/10 rounded-lg">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="text-center">
                  <p className="text-[var(--color-text-secondary)] font-mono uppercase tracking-[0.2em] mb-4">No matching clusters found</p>
                  <button onClick={() => { setSearchTerm(""); setFilter("all"); }} className="px-4 py-2 border border-[var(--color-primary)] text-[10px] font-mono hover:bg-[var(--color-primary)]/10 transition-all">RESET_FILTERS()</button>
                </motion.div>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between py-4 border-t border-[var(--color-primary)]/10 text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="text-[var(--color-primary)] opacity-50">TOTAL_CLUSTERS:</span> {groups.length}</span>
            <span className="flex items-center gap-2"><span className="text-[var(--color-primary)] opacity-50">VISIBLE_CLUSTERS:</span> {filteredGroups.length}</span>
          </div>
          <div className="flex items-center gap-6 text-[8px]"><span className="flex items-center gap-1.5 opacity-60">{">"} CLUSTER_MONITORING_ACTIVE</span></div>
        </div>
      </div>

      <GroupDetailModal group={selectedGroup} isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedGroup(null); }} />
      <GroupCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </PageLayout>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={
      <PageLayout activePage="groups">
        <div className="h-full flex items-center justify-center">
          <div className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-[0.3em]">
            // INITIALIZING_CLUSTER_INTERFACE...
          </div>
        </div>
      </PageLayout>
    }>
      <GroupsPageContent />
    </Suspense>
  );
}
