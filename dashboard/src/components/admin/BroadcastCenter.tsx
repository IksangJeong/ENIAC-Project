"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Announcement } from "@/types";
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function BroadcastCenter() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"normal" | "important" | "urgent">("normal");

  const loadAllAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAllAnnouncements();
  }, []);

  const isRoot = user?.clearance === "root";

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Broadcast Title and Message Content are required.");
      return;
    }
    setLoading(true);

    try {
      await createAnnouncement({
        title,
        content,
        priority,
        author: user?.name || "ADMIN_CONSOLE",
      });

      // Reset form
      setTitle("");
      setContent("");
      setPriority("normal");

      // Reload
      await loadAllAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Failed to deploy system broadcast.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this system broadcast? It will be removed from all feeds.")) return;
    setLoading(true);
    try {
      await deleteAnnouncement(id);
      await loadAllAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Failed to delete broadcast.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "urgent":
        return "border-red-500/30 text-red-500 bg-red-500/5";
      case "important":
        return "border-amber-500/30 text-amber-400 bg-amber-500/5";
      case "normal":
      default:
        return "border-cyan-500/30 text-cyan-400 bg-cyan-500/5";
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header */}
      <div className={clsx(
        "flex items-center justify-between border-b pb-4",
        isRoot ? "border-amber-500/20" : "border-cyan-500/20"
      )}>
        <div>
          <h2 className={clsx("text-base font-bold uppercase tracking-widest", isRoot ? "text-amber-400" : "text-cyan-400")}>
            [BROADCAST_CENTER_OPERATIONS]
          </h2>
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 uppercase">// TRANSMIT PUBLIC ALERTS & GENERAL NOTICES TO CLIENT TERMINALS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transmission Panel Form */}
        <div className={clsx(
          "lg:col-span-5 border bg-black/60 p-5 rounded-sm font-mono relative overflow-hidden h-fit",
          isRoot ? "border-amber-500/20" : "border-cyan-500/20"
        )}>
          <div className="absolute inset-0 pointer-events-none scanline opacity-5" />

          <h3 className={clsx("text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4", isRoot ? "text-amber-400" : "text-cyan-400")}>
            TRANSMISSION_CONTROLS
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Notice Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "important", "urgent"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={clsx(
                      "py-2 border uppercase tracking-widest text-[9px] font-bold transition-all text-center rounded-sm",
                      priority === p
                        ? p === "urgent"
                          ? "bg-red-500 border-red-500 text-black"
                          : p === "important"
                          ? "bg-amber-500 border-amber-500 text-black"
                          : "bg-cyan-500 border-cyan-500 text-black"
                        : "bg-black/40 border-white/5 text-neutral-400 hover:text-white"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Broadcast Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter alert title summary..."
                className={clsx(
                  "w-full bg-black/80 border p-2.5 text-white outline-none",
                  isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                )}
                required
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Notice Message Body</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write detailed instructions or information payload..."
                rows={4}
                className={clsx(
                  "w-full bg-black/80 border p-2.5 text-white outline-none resize-none custom-scrollbar",
                  isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                )}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "w-full py-3 text-center text-[10px] uppercase tracking-widest text-black font-black transition-all mt-2",
                isRoot ? "bg-amber-500 hover:bg-amber-400" : "bg-cyan-500 hover:bg-cyan-400"
              )}
            >
              {loading ? "TRANSMITTING..." : "[ENGAGE_BROADCAST_TRANSMISSION]"}
            </button>
          </form>
        </div>

        {/* Live Broadcast Feed */}
        <div className={clsx(
          "lg:col-span-7 border bg-black/80 p-5 rounded-sm flex flex-col font-mono relative min-h-[400px]",
          isRoot ? "border-amber-500/20" : "border-cyan-500/20"
        )}>
          <div className="absolute inset-0 pointer-events-none scanline opacity-5" />

          <div className="flex justify-between items-center text-[10px] uppercase mb-4 font-bold border-b pb-2">
            <span>ACTIVE BROADCASTS ARCHIVE</span>
            <span className={clsx("animate-pulse", isRoot ? "text-amber-500" : "text-cyan-400")}>● LIVE_STATUS</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {announcements.map((ann) => (
                <motion.div
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={clsx(
                    "border p-4 rounded-sm relative flex flex-col justify-between gap-3 bg-black/40",
                    getPriorityStyle(ann.priority)
                  )}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[8px] opacity-50 uppercase">// SOURCE: {ann.author || "ROOT_DEV"}</span>
                      <span className="text-[8px] opacity-45">{new Date(ann.createdAt).toLocaleString()}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{ann.title}</h4>
                    <p className="text-[10px] text-neutral-300 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                    <span className="text-[8px] uppercase tracking-widest opacity-60">
                      Priority: {ann.priority}
                    </span>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="px-2 py-1 text-[8px] border border-red-500/30 text-red-500 hover:bg-red-500/10 uppercase tracking-widest rounded-sm"
                    >
                      [TERMINATE]
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {announcements.length === 0 && (
              <div className="h-full flex items-center justify-center py-20 text-center opacity-30 text-[10px] uppercase tracking-widest">
                No active broadcast files found in registry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
