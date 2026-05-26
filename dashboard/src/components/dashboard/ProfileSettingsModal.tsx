"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { useGroupStore } from "@/stores/groupStore";
import { GlitchText } from "@/components/ui";
import { MemberCard } from "./MemberCard";
import { DEPARTMENTS, POSITION_SUGGESTIONS, DepartmentId } from "@/lib/constants";
import { Member } from "@/types";
import Link from "next/link";
import clsx from "clsx";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, updateUser } = useAuthStore();
  const { groups, loadGroups } = useGroupStore();
  
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

  // Fetch groups on mount/open
  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen, loadGroups]);

  // 내가 속한 그룹 필터링
  const myGroups = useMemo(() => {
    if (!user) return [];
    return groups.filter(g => g.memberIds.includes(user.id));
  }, [user, groups]);

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
    
    updateUser({
      name: formData.name,
      position: formData.position,
      department: formData.department,
      statusMessage: formData.statusMessage,
      bio: formData.bio,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      socialLinks: {
        github: formData.github || user?.username || "",
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
            className="relative w-full max-w-6xl h-[90vh] bg-[var(--color-bg-black)] border border-[var(--color-primary)]/30 shadow-2xl flex flex-col rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-[var(--color-primary)]/20 flex justify-between items-center bg-[var(--color-primary)]/5">
              <div>
                <GlitchText text="NODE_IDENTITY_CONFIGURATION" as="h2" className="text-xl font-black uppercase tracking-widest" />
                <p className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mt-1">
                  // Modifying Identity Parameters for Node: {user.username}
                </p>
              </div>
              <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Form */}
              <div className="flex-[1.2] overflow-y-auto p-8 custom-scrollbar space-y-10 border-r border-[var(--color-primary)]/10">
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
                          formData.department === dept.id ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]" : "bg-black/40 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40"
                        )}
                      >
                        <div className="text-lg mb-1">{dept.icon}</div>
                        <div className={clsx("text-[10px] font-bold uppercase tracking-widest", formData.department === dept.id ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]")}>{dept.id}</div>
                        <div className="text-[8px] text-[var(--color-text-secondary)]/60 uppercase">{dept.label}</div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 02_IDENTITY_DATA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">User_Alias</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-white focus:border-[var(--color-primary)]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Status_Msg</label>
                      <input type="text" value={formData.statusMessage} onChange={(e) => setFormData({...formData, statusMessage: e.target.value})} className="w-full bg-[var(--color-bg-black)] border border-emerald-500/20 rounded px-4 py-2 text-xs text-emerald-400 focus:border-emerald-500 font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Biography</label>
                    <textarea 
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-white focus:border-[var(--color-primary)] resize-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Skill_Modules (Comma separated)</label>
                    <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-white focus:border-[var(--color-primary)]" />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" /> 03_SOCIAL_CHANNELS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">GitHub_ID</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-primary)]/40 font-mono">@</span>
                        <input 
                          type="text" 
                          value={formData.github} 
                          onChange={(e) => setFormData({...formData, github: e.target.value})} 
                          placeholder="username"
                          className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded pl-7 pr-4 py-2 text-xs text-white focus:border-[var(--color-primary)]" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-[var(--color-text-secondary)] uppercase font-mono">Personal_Site</label>
                      <input 
                        type="url" 
                        value={formData.website} 
                        onChange={(e) => setFormData({...formData, website: e.target.value})} 
                        placeholder="https://example.com"
                        className="w-full bg-[var(--color-bg-black)] border border-[var(--color-primary)]/20 rounded px-4 py-2 text-xs text-white focus:border-[var(--color-primary)]" 
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right: Preview & Clusters */}
              <div className="flex-1 bg-black/40 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-10 border-l border-[var(--color-primary)]/10">
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.4em] text-center">Node_Preview</h4>
                  <MemberCard member={previewMember} />
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.4em]">Active_Clusters_Membership</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {myGroups.map(group => (
                      <Link 
                        key={group.id} 
                        href={`/groups?id=${group.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/40 transition-all group/glink"
                      >
                        <div className="flex items-center gap-3">
                          <span className={clsx("w-1 h-1 rounded-full", group.status === 'processing' ? "bg-cyan-400 animate-pulse" : "bg-emerald-500")} />
                          <span className="text-[11px] font-bold text-white group-hover/glink:text-[var(--color-primary)] transition-colors uppercase">{group.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-[var(--color-primary)]/40">&gt; NAVIGATE</span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-primary)]/20 flex justify-between items-center bg-black/40">
              <div>
                {(user.clearance === "root" || user.clearance === "officer" || user.role === "admin") && (
                  <Link 
                    href="/admin" 
                    onClick={onClose}
                    className="px-4 py-2 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-[10px] font-mono uppercase tracking-wider transition-all"
                  >
                    [ADMIN_PANEL]
                  </Link>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={onClose} className="px-6 py-2 text-[10px] font-mono text-[var(--color-text-secondary)] uppercase hover:text-white transition-all">[DISCARD]</button>
                <button onClick={handleSave} disabled={isSaving || showSuccess} className={clsx("px-10 py-2 text-[10px] font-mono uppercase transition-all", showSuccess ? "bg-emerald-500 text-white" : "bg-[var(--color-primary)] text-black hover:glow")}>
                  {isSaving ? "SYNCING..." : showSuccess ? "SUCCESS" : "[COMMIT_SYNC]"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
