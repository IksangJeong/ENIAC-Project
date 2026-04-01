"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { GlitchText } from "@/components/ui";
import { MemberCard } from "./MemberCard";
import { DEPARTMENTS, POSITION_SUGGESTIONS, DepartmentId } from "@/lib/constants";
import { Member } from "@/types";
import clsx from "clsx";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "Backend" as DepartmentId,
    statusMessage: "",
    bio: "",
    skills: "",
    github: "",
    website: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 깃허브 로그인 여부 확인 및 추론된 ID
  const inferredGithubId = user?.socialLinks?.github || user?.username;
  const isGithubUser = !!user?.username && user.username !== user.name;

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        position: user.position || "",
        department: (user.department as DepartmentId) || "Backend",
        statusMessage: user.statusMessage || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        github: user.socialLinks?.github || user.username || "",
        website: user.socialLinks?.website || "",
      });
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 저장 시 깃허브 링크가 비어있으면 username으로 자동 채움
    const finalGithub = formData.github || user?.username || "";
    
    updateUser({
      name: formData.name,
      position: formData.position,
      department: formData.department,
      statusMessage: formData.statusMessage,
      bio: formData.bio,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      socialLinks: {
        github: finalGithub,
        website: formData.website,
      }
    });
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!user) return null;

  const previewMember: Member = {
    ...user,
    name: formData.name || user.name,
    position: formData.position || "Position Not Set",
    department: formData.department,
    statusMessage: formData.statusMessage,
    bio: formData.bio,
    skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
    socialLinks: {
      github: formData.github || user.username,
      website: formData.website,
    },
    status: "online",
    joinDate: user.joinDate || new Date().toISOString().split('T')[0]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-bg-black)]/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl h-[90vh] bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 shadow-2xl flex flex-col rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-primary)]/20 flex justify-between items-center bg-[var(--color-primary)]/5">
              <div>
                <GlitchText text="NODE_IDENTITY_CONFIGURATION" as="h2" className="text-xl font-black uppercase tracking-widest" />
                <p className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mt-1">
                  // ID: {user.username} // IDENTITY_SYNC_ACTIVE
                </p>
              </div>
              <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-[1.5] overflow-y-auto p-8 custom-scrollbar space-y-10 border-r border-[var(--color-primary)]/10">
                
                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 01_NODE_CLASS
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => setFormData({ ...formData, department: dept.id, position: "" })}
                        className={clsx(
                          "p-3 border rounded text-left transition-all group relative overflow-hidden",
                          formData.department === dept.id 
                            ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]" 
                            : "bg-black/40 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40"
                        )}
                      >
                        <div className="text-lg mb-1">{dept.icon}</div>
                        <div className={clsx(
                          "text-[10px] font-bold uppercase tracking-widest",
                          formData.department === dept.id ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
                        )}>
                          {dept.id}
                        </div>
                        <div className="text-[8px] text-[var(--color-text-secondary)]/60 uppercase">{dept.label}</div>
                        {formData.department === dept.id && (
                          <motion.div layoutId="active-dept" className="absolute inset-0 border-2 border-[var(--color-primary)] pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 02_NODE_SPECIALIZATION
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="e.g. Lead Developer"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-3 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none transition-all font-mono"
                    />
                    <div className="flex flex-wrap gap-2">
                      {POSITION_SUGGESTIONS[formData.department].map(pos => (
                        <button
                          key={pos}
                          onClick={() => setFormData({ ...formData, position: pos })}
                          className="px-2 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded text-[9px] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] transition-all uppercase"
                        >
                          + {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 03_IDENTITY_PARAMETERS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">사용자 성명</label>
                      <input
                        type="text"
                        placeholder="예: 홍길동"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Status_Message</label>
                      <input
                        type="text"
                        placeholder="예: 프로젝트 아키텍처 설계 중..."
                        value={formData.statusMessage}
                        onChange={(e) => setFormData({...formData, statusMessage: e.target.value})}
                        className="w-full bg-[var(--color-bg-black)] border border-emerald-500/20 rounded px-4 py-2 text-xs text-emerald-400 focus:border-emerald-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Biography_Data</label>
                    <textarea
                      rows={3}
                      placeholder="자신을 소개하는 내용을 입력하세요..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-3 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Skill_Modules (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Node.js..."
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 04_NETWORK_ACCESS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-[var(--color-primary)] uppercase font-mono tracking-widest flex items-center gap-2">
                        Github ID/Link
                        {isGithubUser && (
                          <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            AUTO_RESOLVED
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Github ID or URL"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className={clsx(
                          "w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:border-[var(--color-primary)] focus:outline-none transition-all font-mono"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-[var(--color-primary)] uppercase font-mono tracking-widest">Personal_Website</label>
                      <input
                        type="text"
                        placeholder="https://portfolio.com"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:border-[var(--color-primary)] focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex-1 bg-black/40 p-8 flex flex-col items-center justify-center gap-6 border-l border-[var(--color-primary)]/10">
                <div className="w-full max-w-sm space-y-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.4em]">Node_Preview</h4>
                    <p className="text-[8px] text-[var(--color-text-secondary)] uppercase font-mono">// Real-time identity visualization</p>
                  </div>
                  <MemberCard member={previewMember} />
                  <div className="mt-8 p-4 border border-[var(--color-primary)]/10 rounded bg-[var(--color-primary)]/5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[var(--color-text-secondary)]">DATA_INTEGRITY:</span>
                      <span className="text-emerald-400">VERIFIED</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[var(--color-text-secondary)]">GITHUB_SYNC:</span>
                      <span className="text-[var(--color-primary)]">{inferredGithubId || "NOT_FOUND"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-primary)]/20 flex justify-end gap-4 bg-black/40">
              <button
                onClick={onClose}
                className="px-6 py-2 text-[10px] font-mono text-[var(--color-text-secondary)] uppercase hover:text-[var(--color-text-primary)] transition-all"
              >
                [DISCARD_CHANGES]
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || showSuccess}
                className={clsx(
                  "px-10 py-2 text-[10px] font-mono uppercase transition-all relative overflow-hidden",
                  showSuccess 
                    ? "bg-emerald-500 text-white" 
                    : "bg-[var(--color-primary)] text-black hover:glow active:scale-95"
                )}
              >
                {isSaving ? "SYNCHRONIZING..." : showSuccess ? "SUCCESSFULLY_SYNCED" : "[COMMIT_TO_SYSTEM]"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
