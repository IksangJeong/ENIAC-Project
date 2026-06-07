"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchText } from "@/components/ui";
import { useGroupStore } from "@/stores/groupStore";
import { useAuthStore } from "@/stores/authStore";
import { Group, GroupType } from "@/types";
import clsx from "clsx";

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GroupCreateModal({ isOpen, onClose }: GroupCreateModalProps) {
  const { addGroup } = useGroupStore();
  const { members, loadMembers } = useAuthStore();
  
  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, loadMembers]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "study" as GroupType,
    description: "",
    goal: "",
    leaderId: "",
    techStack: "",
    repoUrl: "",
    docUrl: "",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.leaderId) {
      alert("ERROR: Cluster Name and Leader ID are required.");
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

    const newGroup: Group = {
      id: `g_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      status: "booting", // 새 그룹은 기본적으로 booting 상태
      description: formData.description,
      goal: formData.goal,
      progress: 0,
      leaderId: formData.leaderId,
      memberIds: [formData.leaderId], // 리더는 자동으로 멤버로 포함
      techStack: formData.techStack.split(",").map(s => s.trim()).filter(Boolean),
      repoUrl: formData.repoUrl,
      docUrl: formData.docUrl,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addGroup(newGroup);
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      // 폼 초기화
      setFormData({
        name: "", type: "study", description: "", goal: "", leaderId: "", techStack: "", repoUrl: "", docUrl: "",
      });
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-bg-black)]/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--color-bg-black)] border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col rounded-sm overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none scanline opacity-20" />

            {/* Header */}
            <div className="p-5 border-b border-amber-500/20 bg-amber-500/10 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-amber-500 animate-pulse" />
                <div>
                  <GlitchText text="INITIALIZE_NEW_CLUSTER" as="h2" className="text-lg font-black text-amber-400 uppercase tracking-widest" />
                  <p className="text-[9px] text-amber-500/60 font-mono uppercase mt-0.5">
                    // SYSTEM_ROOT_ACCESS: Deploying new operation node
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-amber-500/60 hover:text-amber-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-amber-500/80 uppercase">Cluster_Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="예: 클라우드 스터디 1기"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-amber-500/80 uppercase">Cluster_Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as GroupType})}
                    className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="study">STUDY (학습 그룹)</option>
                    <option value="project">PROJECT (개발 프로젝트)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-amber-500/80 uppercase">Assign_Leader (Node Commander) <span className="text-red-400">*</span></label>
                <select
                  value={formData.leaderId}
                  onChange={(e) => setFormData({...formData, leaderId: e.target.value})}
                  className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- SELECT_MEMBER --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.department} - {m.position})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-amber-500/80 uppercase">Operation_Description</label>
                <input
                  type="text"
                  placeholder="예: 클라우드 인프라 설계 및 구축 스터디"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-amber-500/80 uppercase">Final_Goal</label>
                <input
                  type="text"
                  placeholder="예: AWS 자격증 취득 및 소형 프로젝트 배포"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-amber-500/80 uppercase">Tech_Mesh (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="예: AWS, Docker, Kubernetes, Linux"
                  value={formData.techStack}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                  className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-amber-500/80 uppercase">Repository_URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                    className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-amber-500/80 uppercase">Documentation_URL</label>
                  <input
                    type="text"
                    placeholder="https://notion.so/..."
                    value={formData.docUrl}
                    onChange={(e) => setFormData({...formData, docUrl: e.target.value})}
                    className="w-full bg-black/50 border border-amber-500/30 rounded-sm px-3 py-2 text-xs text-amber-50 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-amber-500/20 bg-black/60 flex justify-end gap-3 relative z-10">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[10px] font-mono text-amber-500/60 uppercase hover:text-amber-400 transition-all"
              >
                [CANCEL_DEPLOY]
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing || showSuccess}
                className={clsx(
                  "px-6 py-2 text-[10px] font-mono uppercase transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] flex items-center gap-2 rounded-sm",
                  showSuccess 
                    ? "bg-emerald-500 text-white shadow-emerald-500/50" 
                    : "bg-amber-500 text-black hover:bg-amber-400 active:scale-95"
                )}
              >
                {isProcessing ? "BOOTING_CLUSTER..." : showSuccess ? "DEPLOYMENT_SUCCESS" : "[EXECUTE_DEPLOY]"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
