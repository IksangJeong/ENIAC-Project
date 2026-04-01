"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { MemberCard, MemberDetailModal } from "@/components/dashboard";
import { mockMembers } from "@/lib/mockData";
import { useAuthStore } from "@/stores/authStore";
import { DEPARTMENTS } from "@/lib/constants";
import { Member } from "@/types";
import clsx from "clsx";

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user: currentUser } = useAuthStore();

  // 1. 데이터 병합 및 깃허브 링크 자동 완성 로직
  const allMembers = useMemo(() => {
    let list = [...mockMembers];
    
    if (currentUser) {
      const existingIndex = list.findIndex(m => m.id === currentUser.id);
      
      // 깃허브 링크가 없으면 username으로 추론
      const githubId = currentUser.socialLinks?.github || currentUser.username;
      
      const myNode: Member = {
        id: currentUser.id,
        name: currentUser.name || "Unknown Member",
        username: currentUser.username || "guest",
        avatar: currentUser.avatar || "",
        status: "online",
        statusMessage: currentUser.statusMessage || "Active in cluster",
        role: currentUser.role || "member",
        position: currentUser.position || "Club Member",
        department: currentUser.department || "Management",
        bio: currentUser.bio || "No biography available.",
        skills: currentUser.skills || [],
        socialLinks: {
          ...currentUser.socialLinks,
          github: githubId // 추론된 깃허브 ID 할당
        },
        joinDate: currentUser.joinDate || new Date().toISOString().split('T')[0]
      };

      if (existingIndex !== -1) {
        list[existingIndex] = myNode;
      } else {
        list = [myNode, ...list];
      }
    }
    
    return list;
  }, [currentUser]);

  const filterDepartments = ["All", ...DEPARTMENTS.map(d => d.id)];

  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === "All" || member.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <PageLayout activePage="members">
      <div className="h-full flex flex-col gap-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-primary)]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tighter uppercase mb-1">
              Club Members
            </h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] font-mono">
              // ENIAC_DIRECTORY: SCANNING_ACTIVE_NODES... {allMembers.length} ENTRIES FOUND
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="SEARCH_BY_NAME_OR_STACK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={clsx(
                  "w-full sm:w-64 bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 rounded px-4 py-2",
                  "text-[10px] font-mono text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50",
                  "focus:outline-none focus:border-[var(--color-primary)] focus:glow-sm transition-all"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                🔍
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className={clsx(
                  "appearance-none bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 rounded px-4 pr-10 py-2",
                  "text-[10px] font-mono text-[var(--color-text-primary)] uppercase tracking-widest cursor-pointer",
                  "focus:outline-none focus:border-[var(--color-primary)] transition-all"
                )}
              >
                {filterDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-primary)] opacity-50">
                ▼
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden group/scroll">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none opacity-60" />
          
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar overflow-x-visible">
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-20">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <MemberCard 
                      member={member} 
                      onClick={() => handleMemberClick(member)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[var(--color-primary)]/10 rounded-lg">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="text-center">
                  <p className="text-[var(--color-text-secondary)] font-mono uppercase tracking-[0.2em] mb-4">No matching node found in directory</p>
                  <button 
                    onClick={() => { setSearchTerm(""); setSelectedDept("All"); }}
                    className="px-4 py-2 border border-[var(--color-primary)] text-[10px] font-mono hover:bg-[var(--color-primary)]/10 transition-all"
                  >
                    RESET_QUERY()
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--color-bg-black)] to-transparent z-10 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between py-4 border-t border-[var(--color-primary)]/10 text-[9px] font-mono text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] opacity-50">TOTAL_NODES:</span> {allMembers.length}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--color-primary)] opacity-50">VISIBLE_NODES:</span> {filteredMembers.length}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[8px]">
            <span className="flex items-center gap-1.5 opacity-60">
              {">"} SYSTEM_DIRECTORY_READY_
            </span>
          </div>
        </div>
      </div>

      <MemberDetailModal 
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageLayout>
  );
}
