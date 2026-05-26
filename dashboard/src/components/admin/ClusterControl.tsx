"use client";

import { useEffect, useState } from "react";
import { useGroupStore } from "@/stores/groupStore";
import { useAuthStore } from "@/stores/authStore";
import { Group, GroupType, GroupStatus, Member } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function ClusterControl() {
  const { user, loadMembers, members } = useAuthStore();
  const { groups, loadGroups, addGroup, updateGroup, deleteGroup } = useGroupStore();

  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Form Fields for Create / Edit
  const [name, setName] = useState("");
  const [type, setType] = useState<GroupType>("project");
  const [status, setStatus] = useState<GroupStatus>("processing");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState(0);
  const [leaderId, setLeaderId] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [techStackInput, setTechStackInput] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  useEffect(() => {
    loadGroups();
    loadMembers();
  }, [loadGroups, loadMembers]);

  const activeMembers = members.filter((m) => m.isApproved);
  const isRoot = user?.clearance === "root";

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingGroup(null);
    setName("");
    setType("project");
    setStatus("booting");
    setDescription("");
    setGoal("");
    setProgress(0);
    setLeaderId(activeMembers[0]?.id || "");
    setSelectedMemberIds([]);
    setTechStackInput("");
    setRepoUrl("");
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setIsCreating(false);
    setName(group.name);
    setType(group.type);
    setStatus(group.status);
    setDescription(group.description);
    setGoal(group.goal || "");
    setProgress(group.progress);
    setLeaderId(group.leaderId);
    setSelectedMemberIds(group.memberIds || []);
    setTechStackInput(group.techStack.join(", "));
    setRepoUrl(group.repoUrl || "");
  };

  const handleCreateCluster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leaderId) {
      alert("Name and Leader are required fields.");
      return;
    }
    setLoading(true);

    try {
      const techStack = techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const newGroup: Group = {
        id: "g-" + Math.random().toString(36).substring(2, 9),
        name,
        type,
        status,
        description,
        goal,
        progress,
        leaderId,
        memberIds: Array.from(new Set([leaderId, ...selectedMemberIds])),
        techStack,
        repoUrl,
        createdAt: new Date().toISOString().split("T")[0],
      };

      await addGroup(newGroup);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create sub-cluster.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCluster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;
    setLoading(true);

    try {
      const techStack = techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updates: Partial<Group> = {
        name,
        type,
        status,
        description,
        goal,
        progress,
        leaderId,
        memberIds: Array.from(new Set([leaderId, ...selectedMemberIds])),
        techStack,
        repoUrl,
      };

      await updateGroup(editingGroup.id, updates);
      setEditingGroup(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update sub-cluster.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCluster = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this cluster? This action is permanent.")) return;
    setLoading(true);
    try {
      await deleteGroup(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete sub-cluster.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const getLeaderName = (id: string) => {
    return activeMembers.find((m) => m.id === id)?.name || "Unknown Leader";
  };

  const getStatusColor = (s: GroupStatus) => {
    switch (s) {
      case "booting":
        return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      case "processing":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "stabilized":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "halted":
        return "text-red-500 border-red-500/20 bg-red-500/5";
      default:
        return "text-neutral-400 border-neutral-500/20 bg-neutral-500/5";
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header */}
      <div className={clsx(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4",
        isRoot ? "border-amber-500/20" : "border-cyan-500/20"
      )}>
        <div>
          <h2 className={clsx("text-base font-bold uppercase tracking-widest", isRoot ? "text-amber-400" : "text-cyan-400")}>
            [CLUSTER_CONTROL_PANEL]
          </h2>
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 uppercase">// INITIALIZE AND CONFIGURE PROJECT / STUDY GROUPS</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className={clsx(
            "px-4 py-2 border font-mono text-[9px] uppercase tracking-widest font-bold transition-all",
            isRoot
              ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 active:scale-95 cursor-pointer"
              : "border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 active:scale-95 cursor-pointer"
          )}
        >
          [INITIALIZE_NEW_CLUSTER]
        </button>
      </div>

      {/* Grid of Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className={clsx(
              "border bg-black/60 p-5 rounded-sm flex flex-col justify-between font-mono relative overflow-hidden",
              isRoot ? "border-amber-500/20 hover:border-amber-500/40" : "border-cyan-500/20 hover:border-cyan-500/40"
            )}
          >
            <div className="absolute inset-0 pointer-events-none scanline opacity-5" />
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={clsx("px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-sm", getStatusColor(group.status))}>
                  {group.status}
                </span>
                <span className="text-[8px] opacity-40">// CREATED: {group.createdAt}</span>
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{group.name}</h3>
              <p className="text-[10px] text-neutral-400 mb-4 line-clamp-2">{group.description}</p>

              {/* Stats */}
              <div className="space-y-2 border-t border-white/5 pt-3 mb-4">
                <div className="flex justify-between text-[10px]">
                  <span className="opacity-50">LEADER:</span>
                  <span className="text-white font-bold">{getLeaderName(group.leaderId)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="opacity-50">MEMBERS:</span>
                  <span className="text-white">{group.memberIds?.length || 0} Nodes Assigned</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="opacity-50">STACK:</span>
                  <span className="text-neutral-300 max-w-[70%] truncate text-right">{group.techStack.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Progress bar and buttons */}
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center text-[9px] mb-1">
                  <span className="opacity-50 uppercase tracking-widest">Progress Metrics</span>
                  <span className={clsx("font-bold", isRoot ? "text-amber-400" : "text-cyan-400")}>{group.progress}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={clsx("h-full transition-all duration-500", isRoot ? "bg-amber-500" : "bg-cyan-500")}
                    style={{ width: `${group.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(group)}
                  className="flex-1 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[9px] uppercase tracking-widest text-center"
                >
                  [CONFIGURE]
                </button>
                <button
                  onClick={() => handleDeleteCluster(group.id)}
                  className="px-3 py-1.5 border border-red-500/20 hover:border-red-500 text-red-400/80 hover:text-red-500 text-[9px] uppercase tracking-widest text-center"
                >
                  [TERMINATE]
                </button>
              </div>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full border border-dashed border-white/10 py-16 text-center opacity-30 uppercase tracking-widest text-xs">
            No Active Clusters Initialized.
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      <AnimatePresence>
        {(isCreating || editingGroup) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={clsx(
                "border bg-[var(--color-bg-dark)] max-w-lg w-full p-6 font-mono rounded-sm shadow-2xl relative overflow-hidden my-8",
                isRoot ? "border-amber-500/30" : "border-cyan-500/30"
              )}
            >
              <div className="absolute inset-0 pointer-events-none scanline opacity-5" />
              
              <h3 className={clsx("text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4", isRoot ? "text-amber-400" : "text-cyan-400")}>
                {isCreating ? "⚡ INITIALIZE_NEW_CLUSTER" : "⚙️ CONFIGURE_CLUSTER_PARAMETERS"}
              </h3>

              <form onSubmit={isCreating ? handleCreateCluster : handleUpdateCluster} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Cluster Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as GroupType)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="project" className="bg-neutral-900 text-white">PROJECT (실무 개발)</option>
                      <option value="study" className="bg-neutral-900 text-white">STUDY (학술 탐구)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Operational Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as GroupStatus)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="booting" className="bg-neutral-900 text-cyan-400">BOOTING (초기 준비)</option>
                      <option value="processing" className="bg-neutral-900 text-amber-400">PROCESSING (개발/진행 중)</option>
                      <option value="stabilized" className="bg-neutral-900 text-emerald-400">STABILIZED (완료/유지보수)</option>
                      <option value="halted" className="bg-neutral-900 text-red-500">HALTED (일시 정지)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Cluster Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Operational Goal</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter key objective (e.g. CLI tool creation)"
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe cluster functions and scopes..."
                    rows={2}
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none resize-none custom-scrollbar",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, TypeScript, Docker (comma separated)"
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Team Leader (PM)</label>
                    <select
                      value={leaderId}
                      onChange={(e) => setLeaderId(e.target.value)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                      required
                    >
                      <option value="" disabled>Select Leader</option>
                      {activeMembers.map((m) => (
                        <option key={m.id} value={m.id} className="bg-neutral-900 text-white">
                          {m.name} (@{m.username || "guest"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Progress Rate ({progress}%)</label>
                    <div className="flex items-center gap-3 h-10">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className={clsx(
                          "w-full accent-cyan-500 cursor-pointer h-1.5 rounded-lg bg-neutral-800",
                          isRoot ? "accent-amber-500" : "accent-cyan-500"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-2">Assign Team Members Nodes</label>
                  <div className="max-h-32 overflow-y-auto border border-white/5 bg-black/30 p-2 space-y-1.5 custom-scrollbar">
                    {activeMembers.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 select-none cursor-pointer py-0.5 hover:bg-white/5 rounded-sm px-1">
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(m.id)}
                          onChange={() => toggleMemberSelection(m.id)}
                          className="rounded-sm bg-neutral-900 border-neutral-700 accent-cyan-500 focus:ring-0"
                        />
                        <span className="text-[10px] text-neutral-300">
                          {m.name} <span className="opacity-45 text-[8px]">({m.department} / @{m.username || "guest"})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingGroup(null);
                    }}
                    disabled={loading}
                    className="flex-1 py-2 text-center border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-[10px] uppercase tracking-widest transition-all"
                  >
                    [CANCEL]
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                      "flex-1 py-2 text-center text-[10px] uppercase tracking-widest text-black font-bold transition-all",
                      isRoot ? "bg-amber-500 hover:bg-amber-400" : "bg-cyan-500 hover:bg-cyan-400"
                    )}
                  >
                    {loading ? "INITIALIZING..." : isCreating ? "[CREATE_CLUSTER]" : "[UPDATE_CLUSTER]"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
