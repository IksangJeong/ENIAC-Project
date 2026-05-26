"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { MemberCard, MemberDetailModal } from "@/components/dashboard";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/auth";
import { DEPARTMENTS } from "@/lib/constants";
import { Member } from "@/types";
import clsx from "clsx";

function MembersPageContent() {
  const searchParams = useSearchParams();
  const targetMemberId = searchParams.get("id");
  const { user, getAllMembers, loadMembers, loading, members } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch members directory on mount
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // 중앙 집중화된 멤버 리스트 사용 (user 상태 변화에 반응하도록 의존성 추가)
  const allMembers = useMemo(() => getAllMembers(), [user, getAllMembers, members]);

  // 딥링크 처리
  useEffect(() => {
    if (targetMemberId && allMembers.length > 0) {
      const member = allMembers.find(m => m.id === targetMemberId);
      if (member) {
        setSelectedMember(member);
        setIsModalOpen(true);
      }
    }
  }, [targetMemberId, allMembers]);

  const filteredMembers = useMemo(() => {
    return allMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDept = selectedDept === "All" || member.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [allMembers, searchTerm, selectedDept]);

  if (loading && allMembers.length === 0) {
    return (
      <PageLayout activePage="members">
        <div className="h-full flex items-center justify-center">
          <div className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-[0.3em]">
            // SCANNING_MEMBER_DATABASE...
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout activePage="members">
      <div className="h-full flex flex-col gap-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-primary)]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tighter uppercase mb-1">Club Members</h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] font-mono">
              // ENIAC_DIRECTORY: {allMembers.length} NODES_ONLINE
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="SEARCH_NODE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 rounded px-4 py-2 text-[10px] font-mono text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:glow-sm transition-all"
            />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 rounded px-4 py-2 text-[10px] font-mono text-[var(--color-text-primary)] uppercase cursor-pointer focus:border-[var(--color-primary)] transition-all"
            >
              <option value="All">ALL_DEPARTMENTS</option>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden group/scroll">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none opacity-60" />
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 pb-32">
              {filteredMembers.map((member, index) => (
                <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                  <MemberCard member={member} onClick={() => { setSelectedMember(member); setIsModalOpen(true); }} />
                </motion.div>
              ))}
            </div>
            {filteredMembers.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[var(--color-primary)]/10 rounded-lg">
                <p className="text-[var(--color-text-secondary)] font-mono uppercase tracking-[0.2em]">No matching node found</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <MemberDetailModal member={selectedMember} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedMember(null); }} />
    </PageLayout>
  );
}

export default function MembersPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <PageLayout activePage="members">
          <div className="h-full flex items-center justify-center">
            <div className="text-[var(--color-primary)] font-mono animate-pulse uppercase tracking-[0.3em]">
              // SCANNING_MEMBER_DATABASE...
            </div>
          </div>
        </PageLayout>
      }>
        <MembersPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
