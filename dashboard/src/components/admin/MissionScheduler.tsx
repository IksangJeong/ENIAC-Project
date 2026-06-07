"use client";

import { useEffect, useState } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useGroupStore } from "@/stores/groupStore";
import { useAuthStore } from "@/stores/authStore";
import { Schedule, ScheduleType, ScheduleStatus, SchedulePriority } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function MissionScheduler() {
  const { user, loadMembers, members } = useAuthStore();
  const { groups, loadGroups } = useGroupStore();
  const { schedules, loadSchedules, addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();

  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ScheduleType>("seminar");
  const [status, setStatus] = useState<ScheduleStatus>("upcoming");
  const [priority, setPriority] = useState<SchedulePriority>("normal");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [isOfficial, setIsOfficial] = useState(false);

  useEffect(() => {
    loadSchedules();
    loadGroups();
    loadMembers();
  }, [loadSchedules, loadGroups, loadMembers]);

  const activeMembers = members.filter((m) => m.isApproved);
  const isRoot = user?.clearance === "root";

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingSchedule(null);
    setTitle("");
    setType("seminar");
    setStatus("upcoming");
    setPriority("normal");
    
    // Default to current time in local format for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDate(now.toISOString().slice(0, 16));
    setEndDate("");
    
    setLocation("");
    setDescription("");
    setGroupId("");
    setSelectedParticipantIds([]);
    setIsOfficial(false);
  };

  const handleOpenEdit = (sched: Schedule) => {
    setEditingSchedule(sched);
    setIsCreating(false);
    setTitle(sched.title);
    setType(sched.type);
    setStatus(sched.status);
    setPriority(sched.priority);
    
    // Format Date ISO strings into datetime-local compatible strings
    const formatDateStr = (isoStr?: string) => {
      if (!isoStr) return "";
      try {
        const d = new Date(isoStr);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
      } catch {
        return "";
      }
    };
    
    setDate(formatDateStr(sched.date));
    setEndDate(formatDateStr(sched.endDate));
    setLocation(sched.location || "");
    setDescription(sched.description || "");
    setGroupId(sched.groupId || "");
    setSelectedParticipantIds(sched.participantIds || []);
    setIsOfficial(sched.isOfficial || false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      alert("Title and start date are required.");
      return;
    }
    setLoading(true);

    try {
      const newSchedule: Schedule = {
        id: "s-" + Math.random().toString(36).substring(2, 9),
        title,
        type,
        status,
        priority,
        date: new Date(date).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        location,
        description,
        groupId: groupId || undefined,
        participantIds: selectedParticipantIds,
        participants: selectedParticipantIds.length || undefined,
        isOfficial,
      };

      await addSchedule(newSchedule);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to deploy schedule.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;
    setLoading(true);

    try {
      const updates: Partial<Schedule> = {
        title,
        type,
        status,
        priority,
        date: new Date(date).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        location,
        description,
        groupId: groupId || undefined,
        participantIds: selectedParticipantIds,
        participants: selectedParticipantIds.length || undefined,
        isOfficial,
      };

      await updateSchedule(editingSchedule.id, updates);
      setEditingSchedule(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update schedule.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event from the mission timeline?")) return;
    setLoading(true);
    try {
      await deleteSchedule(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  const toggleParticipant = (memberId: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const getGroupName = (id?: string) => {
    if (!id) return "None";
    return groups.find((g) => g.id === id)?.name || "Unknown Group";
  };

  const getPriorityColor = (p: SchedulePriority) => {
    switch (p) {
      case "critical":
        return "text-red-500 border-red-500/20 bg-red-500/5";
      case "high":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "normal":
      default:
        return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
    }
  };

  const getEventBadge = (t: ScheduleType) => {
    const styles = {
      seminar: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
      event: "border-purple-500/30 text-purple-400 bg-purple-500/5",
      study: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      meeting: "border-amber-500/30 text-amber-400 bg-amber-500/5",
    };
    return styles[t] || "border-neutral-500/30 text-neutral-400 bg-neutral-500/5";
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
            [MISSION_SCHEDULER_OPERATIONS]
          </h2>
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 uppercase">// SYNCHRONIZE OFFICIAL TIMELINES AND ENIAC CALENDAR EVENTS</p>
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
          [DEPLOY_NEW_MISSION]
        </button>
      </div>

      {/* Timeline view */}
      <div className="space-y-4">
        {schedules
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((sched) => (
            <div
              key={sched.id}
              className={clsx(
                "border bg-black/60 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono relative overflow-hidden",
                sched.isOfficial 
                  ? isRoot ? "border-amber-500/40 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.05)]" : "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  : "border-white/5 hover:border-white/10"
              )}
            >
              <div className="absolute inset-0 pointer-events-none scanline opacity-5" />

              {/* Basic Information */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={clsx("px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-sm", getEventBadge(sched.type))}>
                    {sched.type}
                  </span>
                  
                  <span className={clsx("px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded-sm", getPriorityColor(sched.priority))}>
                    {sched.priority}
                  </span>

                  {sched.isOfficial && (
                    <span className="px-1.5 py-0.5 border border-purple-500/30 text-purple-400 bg-purple-500/10 text-[8px] font-bold uppercase tracking-widest rounded-sm">
                      ★ OFFICIAL
                    </span>
                  )}
                  
                  {sched.groupId && (
                    <span className="text-[9px] text-cyan-400/70 border border-cyan-500/10 px-1.5 py-0.5 bg-cyan-500/5 rounded-sm">
                      Group: {getGroupName(sched.groupId)}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white uppercase">{sched.title}</h3>
                
                {sched.description && (
                  <p className="text-[10px] text-neutral-400 max-w-2xl leading-relaxed">{sched.description}</p>
                )}

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[9px] text-neutral-400">
                  <div>
                    <span className="opacity-50">SCHEDULED: </span>
                    <span className="text-neutral-200">
                      {new Date(sched.date).toLocaleString()}
                      {sched.endDate && ` - ${new Date(sched.endDate).toLocaleString()}`}
                    </span>
                  </div>
                  {sched.location && (
                    <div>
                      <span className="opacity-50">LOCATION: </span>
                      <span className="text-neutral-200">{sched.location}</span>
                    </div>
                  )}
                  <div>
                    <span className="opacity-50">PARTICIPANTS: </span>
                    <span className="text-neutral-200">{sched.participantIds?.length || 0} Nodes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 shrink-0 md:w-32 justify-end">
                <button
                  onClick={() => handleOpenEdit(sched)}
                  className="flex-1 md:flex-none py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[9px] uppercase tracking-widest text-center"
                >
                  [CONFIGURE]
                </button>
                <button
                  onClick={() => handleDelete(sched.id)}
                  className="px-3 py-1.5 border border-red-500/20 hover:border-red-500 text-red-400/80 hover:text-red-500 text-[9px] uppercase tracking-widest text-center"
                >
                  [TERMINATE]
                </button>
              </div>
            </div>
          ))}

        {schedules.length === 0 && (
          <div className="border border-dashed border-white/10 py-16 text-center opacity-30 uppercase tracking-widest text-xs">
            No active schedules or operations synchronized.
          </div>
        )}
      </div>

      {/* Creation / Editing Modal */}
      <AnimatePresence>
        {(isCreating || editingSchedule) && (
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
                {isCreating ? "⚡ DEPLOY_NEW_MISSION" : "⚙️ CONFIGURE_MISSION_PARAMETERS"}
              </h3>

              <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Mission Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter operation / seminar title"
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Mission Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ScheduleType)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="seminar" className="bg-neutral-900 text-white">SEMINAR (기술 강독)</option>
                      <option value="event" className="bg-neutral-900 text-white">EVENT (동아리 행사)</option>
                      <option value="study" className="bg-neutral-900 text-white">STUDY (팀 스터디)</option>
                      <option value="meeting" className="bg-neutral-900 text-white">MEETING (회의/소집)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="upcoming" className="bg-neutral-900 text-white">UPCOMING (대기 중)</option>
                      <option value="active" className="bg-neutral-900 text-green-400">ACTIVE (진행 중)</option>
                      <option value="completed" className="bg-neutral-900 text-white opacity-40">COMPLETED (완료)</option>
                      <option value="archived" className="bg-neutral-900 text-white opacity-30">ARCHIVED (보관됨)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as SchedulePriority)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="normal" className="bg-neutral-900 text-cyan-400">NORMAL</option>
                      <option value="high" className="bg-neutral-900 text-amber-400 font-bold">HIGH</option>
                      <option value="critical" className="bg-neutral-900 text-red-500 font-black">CRITICAL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Start Timeline</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">End Timeline (Optional)</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Location / Target Gateway</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. IT관 B101호 / Discord"
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Link to Cluster (Optional)</label>
                    <select
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      className={clsx(
                        "w-full bg-black/80 border p-2 text-white outline-none",
                        isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                      )}
                    >
                      <option value="">No Linked Group (Global Event)</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id} className="bg-neutral-900 text-white">
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Description / Log Payload</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details of the event schedule..."
                    rows={2}
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none resize-none custom-scrollbar",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                </div>

                <div className="flex items-center gap-2 py-1 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    id="isOfficialCheck"
                    checked={isOfficial}
                    onChange={() => setIsOfficial(!isOfficial)}
                    className="rounded-sm bg-neutral-900 border-neutral-700 accent-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isOfficialCheck" className="text-[10px] uppercase tracking-widest text-neutral-300 cursor-pointer">
                    ★ Set as Official Club event (Visible to all members)
                  </label>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-2">Assign Participant Nodes</label>
                  <div className="max-h-28 overflow-y-auto border border-white/5 bg-black/30 p-2 space-y-1.5 custom-scrollbar">
                    {activeMembers.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 select-none cursor-pointer py-0.5 hover:bg-white/5 rounded-sm px-1">
                        <input
                          type="checkbox"
                          checked={selectedParticipantIds.includes(m.id)}
                          onChange={() => toggleParticipant(m.id)}
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
                      setEditingSchedule(null);
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
                    {loading ? "SAVING..." : isCreating ? "[DEPLOY_EVENT]" : "[UPDATE_EVENT]"}
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
