"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Schedule, ScheduleType, SchedulePriority } from "@/types";
import { format } from "date-fns";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  initialData?: Schedule | null;
}

export function ScheduleModal({ isOpen, onClose, onSave, initialData }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "study" as ScheduleType,
    priority: "normal" as SchedulePriority,
    date: "",
    time: "14:00",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      const d = new Date(initialData.date);
      setFormData({
        title: initialData.title,
        type: initialData.type,
        priority: initialData.priority,
        date: format(d, "yyyy-MM-dd"),
        time: format(d, "HH:mm"),
        location: initialData.location || "",
        description: initialData.description || "",
      });
    } else if (!initialData && isOpen) {
      setFormData({
        title: "",
        type: "study",
        priority: "normal",
        date: "",
        time: "14:00",
        location: "",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullDate = `${formData.date}T${formData.time}:00`;
    
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      type: formData.type,
      status: initialData?.status || "upcoming",
      priority: formData.priority,
      date: new Date(fullDate).toISOString(),
      location: formData.location || "TBA",
      description: formData.description,
      isOfficial: true,
      participants: initialData?.participants || 0
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-[var(--color-primary)]/30 p-6 rounded-sm shadow-[0_0_50px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center justify-between mb-6 border-b border-[var(--color-primary)]/20 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                &gt; {initialData ? "RECONFIGURE_MISSION" : "DEPLOY_NEW_MISSION"}
              </h2>
              <button onClick={onClose} className="text-[var(--color-primary)] opacity-50 hover:opacity-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50">Mission_Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]/60 text-white font-mono"
                  placeholder="Enter mission name..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Category</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as ScheduleType})}
                    className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none text-[var(--color-primary)] font-mono"
                  >
                    <option value="study">STUDY</option>
                    <option value="seminar">SEMINAR</option>
                    <option value="event">EVENT</option>
                    <option value="meeting">MEETING</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as SchedulePriority})}
                    className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none text-[var(--color-primary)] font-mono"
                  >
                    <option value="normal">NORMAL</option>
                    <option value="high">HIGH</option>
                    <option value="critical">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Target_Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest opacity-50">Target_Time</label>
                  <input
                    required
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50">Sector_Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]/60 text-white font-mono"
                  placeholder="Room 302, Discord, etc..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-50">Briefing_Details</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-[var(--color-primary)]/20 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]/60 text-white font-mono resize-none"
                  placeholder="Enter mission objectives..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[var(--color-primary)] text-black font-bold py-3 mt-4 text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] transition-all"
              >
                {initialData ? "Update_Registry" : "Execute_Deployment"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
