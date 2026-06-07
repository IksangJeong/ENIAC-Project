"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { DEPARTMENTS, POSITION_SUGGESTIONS, DepartmentId } from "@/lib/constants";
import { Member, ClearanceType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function NodeRegistry() {
  const { user, loadMembers, members } = useAuthStore();
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "recovery">("pending");
  const [editingNode, setEditingNode] = useState<Member | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false); // true if approving, false if editing active

  // Temporary key display modal state
  const [tempKeyModal, setTempKeyModal] = useState<{ isOpen: boolean; username: string; tempKey: string } | null>(null);

  // Edit fields
  const [selectedDept, setSelectedDept] = useState<DepartmentId>("Management");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedClearance, setSelectedClearance] = useState<ClearanceType>("member");

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const isRoot = user?.clearance === "root";

  // Open modal to configure node
  const startConfigureNode = (node: Member, approveMode: boolean) => {
    setEditingNode(node);
    setIsApproving(approveMode);
    setSelectedDept(node.department || "Management");
    setSelectedPosition(node.position || "Active Node");
    setSelectedClearance(node.clearance || "member");
  };

  const handleSaveNodeConfig = async () => {
    if (!editingNode) return;
    setLoadingNodeId(editingNode.id);
    const targetNodeId = editingNode.id;
    setEditingNode(null);

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetNodeId,
          department: selectedDept,
          position: selectedPosition,
          clearance: selectedClearance,
        }),
      });

      if (!res.ok) throw new Error("Operation failed");

      // Reload members list from server to sync UI
      await loadMembers();
    } catch (err) {
      console.error(err);
      alert("Error saving node configuration: " + err);
    } finally {
      setLoadingNodeId(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (loadingNodeId) return;
    if (!confirm("Are you sure you want to reset this user's password? A temporary access key will be generated.")) return;

    setLoadingNodeId(userId);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Password reset failed");

      const data = await res.json();
      
      // Open the temporary key notification modal
      setTempKeyModal({
        isOpen: true,
        username: data.username,
        tempKey: data.tempPassword,
      });

      // Reload members list from server to sync UI
      await loadMembers();
    } catch (err) {
      console.error(err);
      alert("Error resetting password: " + err);
    } finally {
      setLoadingNodeId(null);
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (loadingNodeId) return;
    if (!confirm("Are you sure you want to deactivate this node? This will remove access.")) return;
    
    setLoadingNodeId(userId);

    try {
      const res = await fetch("/api/admin/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Deactivation failed");
      
      // Reload members list from server to sync UI
      await loadMembers();
    } catch (err) {
      console.error(err);
      alert("Error deactivating user: " + err);
    } finally {
      setLoadingNodeId(null);
    }
  };

  const pendingNodes = members.filter((m) => !m.isApproved);
  const activeNodes = members.filter((m) => m.isApproved);
  const recoveryNodes = members.filter((m) => m.resetRequested);

  return (
    <div className="space-y-6">
      {/* Sub Header & Switcher */}
      <div className={clsx(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4",
        isRoot ? "border-amber-500/20" : "border-cyan-500/20"
      )}>
        <div>
          <h2 className={clsx("text-base font-bold uppercase tracking-widest", isRoot ? "text-amber-400" : "text-cyan-400")}>
            [NODE_REGISTRY_OPERATIONS]
          </h2>
          <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 uppercase">// MANAGE USER CREDENTIALS & DIRECTORY STATUS</p>
        </div>
        
        <div className={clsx("flex border rounded overflow-hidden", isRoot ? "border-amber-500/30" : "border-cyan-500/30")}>
          <button
            onClick={() => setActiveTab("pending")}
            className={clsx(
              "px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all",
              activeTab === "pending"
                ? isRoot
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-cyan-500 text-black font-bold"
                : "bg-black text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            )}
          >
            PENDING_APPROVALS ({pendingNodes.length})
          </button>
          <button
            onClick={() => setActiveTab("recovery")}
            className={clsx(
              "px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all border-l border-r border-white/5",
              activeTab === "recovery"
                ? isRoot
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-cyan-500 text-black font-bold"
                : "bg-black text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            )}
          >
            RECOVERY_SIGNALS ({recoveryNodes.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={clsx(
              "px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all",
              activeTab === "active"
                ? isRoot
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-cyan-500 text-black font-bold"
                : "bg-black text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            )}
          >
            ACTIVE_DIRECTORIES ({activeNodes.length})
          </button>
        </div>
      </div>

      {/* Main Grid/Table */}
      <div className={clsx(
        "border bg-black/60 rounded-sm overflow-hidden min-h-[300px] flex flex-col relative",
        isRoot ? "border-amber-500/20" : "border-cyan-500/20"
      )}>
        <div className="absolute inset-0 pointer-events-none scanline opacity-5" />

        {activeTab === "pending" ? (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={clsx(
                  "border-b text-[9px] uppercase font-bold tracking-wider",
                  isRoot ? "border-amber-500/20 bg-amber-500/10 text-amber-400" : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                )}>
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Alias_Name</th>
                  <th className="p-3">Identifier</th>
                  <th className="p-3">Email_Address</th>
                  <th className="p-3 text-center">Action_Key</th>
                </tr>
              </thead>
              <tbody className={isRoot ? "text-amber-500/80" : "text-cyan-400/80"}>
                <AnimatePresence mode="popLayout">
                  {pendingNodes.map((node, index) => (
                    <motion.tr
                      key={node.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={clsx(
                        "border-b transition-colors",
                        isRoot ? "border-amber-500/10 hover:bg-amber-500/5" : "border-cyan-500/10 hover:bg-cyan-500/5"
                      )}
                    >
                      <td className="p-3 font-mono opacity-50">{(index + 1).toString().padStart(2, "0")}</td>
                      <td className="p-3 font-bold text-white uppercase">{node.name}</td>
                      <td className="p-3 font-mono">@{node.username || "guest"}</td>
                      <td className="p-3 font-mono">{node.email || "NO_EMAIL"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => startConfigureNode(node, true)}
                          disabled={!!loadingNodeId}
                          className={clsx(
                            "px-4 py-1.5 border font-mono text-[8px] uppercase tracking-widest rounded-sm transition-all",
                            isRoot
                              ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 active:scale-95 cursor-pointer"
                              : "border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 active:scale-95 cursor-pointer"
                          )}
                        >
                          {loadingNodeId === node.id ? "CONFIGURING..." : "[CONFIGURE_AND_APPROVE]"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {pendingNodes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 opacity-30 font-mono text-xs tracking-widest uppercase">
                      No pending node activations in the queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "recovery" ? (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={clsx(
                  "border-b text-[9px] uppercase font-bold tracking-wider",
                  isRoot ? "border-amber-500/20 bg-amber-500/10 text-amber-400" : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                )}>
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Alias_Name</th>
                  <th className="p-3">Identifier</th>
                  <th className="p-3">Request_Time</th>
                  <th className="p-3">Recovery_Reason</th>
                  <th className="p-3 text-center">Action_Key</th>
                </tr>
              </thead>
              <tbody className={isRoot ? "text-amber-500/80" : "text-cyan-400/80"}>
                <AnimatePresence mode="popLayout">
                  {recoveryNodes.map((node, index) => (
                    <motion.tr
                      key={node.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={clsx(
                        "border-b transition-colors",
                        isRoot ? "border-amber-500/10 hover:bg-amber-500/5" : "border-cyan-500/10 hover:bg-cyan-500/5"
                      )}
                    >
                      <td className="p-3 font-mono opacity-50">{(index + 1).toString().padStart(2, "0")}</td>
                      <td className="p-3 font-bold text-white uppercase">{node.name}</td>
                      <td className="p-3 font-mono">@{node.username || "guest"}</td>
                      <td className="p-3 font-mono text-[10px]">
                        {node.resetRequestedAt ? new Date(node.resetRequestedAt).toLocaleString() : "UNKNOWN_TIME"}
                      </td>
                      <td className="p-3 text-xs max-w-xs truncate" title={node.resetRequestReason}>
                        {node.resetRequestReason || "No details provided"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleResetPassword(node.id)}
                          disabled={!!loadingNodeId}
                          className={clsx(
                            "px-4 py-1.5 border font-mono text-[8px] uppercase tracking-widest rounded-sm transition-all",
                            isRoot
                              ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 active:scale-95 cursor-pointer"
                              : "border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 active:scale-95 cursor-pointer"
                          )}
                        >
                          {loadingNodeId === node.id ? "RESETTING..." : "[GENERATE TEMP KEY]"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {recoveryNodes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 opacity-30 font-mono text-xs tracking-widest uppercase">
                      No active access recovery signals detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={clsx(
                  "border-b text-[9px] uppercase font-bold tracking-wider",
                  isRoot ? "border-amber-500/20 bg-amber-500/10 text-amber-400" : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                )}>
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Department / Position</th>
                  <th className="p-3">Clearance</th>
                  <th className="p-3">Uptime_Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={isRoot ? "text-amber-500/80" : "text-cyan-400/80"}>
                {activeNodes.map((node, index) => (
                  <tr
                    key={node.id}
                    className={clsx(
                      "border-b transition-colors",
                      isRoot ? "border-amber-500/10 hover:bg-amber-500/5" : "border-cyan-500/10 hover:bg-cyan-500/5"
                    )}
                  >
                    <td className="p-3 font-mono opacity-50">{(index + 1).toString().padStart(2, "0")}</td>
                    <td className="p-3 font-bold text-white uppercase">{node.name}</td>
                    <td className="p-3 font-mono">@{node.username || "guest"}</td>
                    <td className="p-3 uppercase font-mono text-[10px]">
                      {node.department || "UNSPECIFIED"} // {node.position || "MEMBER"}
                    </td>
                    <td className="p-3">
                      <span className={clsx(
                        "px-1.5 py-0.5 text-[8px] font-bold border uppercase tracking-wider rounded-sm",
                        node.clearance === "root" 
                          ? "border-red-500/30 text-red-500 bg-red-500/5" 
                          : node.clearance === "officer"
                            ? "border-amber-500/30 text-amber-400 bg-amber-500/5"
                            : "border-cyan-500/30 text-cyan-400 bg-cyan-500/5"
                      )}>
                        {node.clearance || "member"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={clsx(
                        "flex items-center gap-1.5 text-[8px] uppercase font-bold font-mono tracking-widest",
                        node.status === "online" ? "text-emerald-400" : "text-amber-500"
                      )}>
                        <span className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          node.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        )} />
                        {node.status || "offline"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startConfigureNode(node, false)}
                          disabled={!!loadingNodeId}
                          className={clsx(
                            "px-2 py-1 border font-mono text-[8px] uppercase tracking-widest rounded-sm transition-all",
                            isRoot
                              ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"
                              : "border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10"
                          )}
                        >
                          [REASSIGN]
                        </button>
                        
                        <button
                          onClick={() => handleResetPassword(node.id)}
                          disabled={!!loadingNodeId}
                          className={clsx(
                            "px-2 py-1 border font-mono text-[8px] uppercase tracking-widest rounded-sm transition-all",
                            isRoot
                              ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"
                              : "border-cyan-500/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10"
                          )}
                        >
                          [RESET PW]
                        </button>
                        
                        {isRoot && (
                          <button
                            onClick={() => handleDeactivate(node.id)}
                            disabled={node.id === user?.id || !!loadingNodeId}
                            className={clsx(
                              "px-2 py-1 border font-mono text-[8px] uppercase tracking-widest rounded-sm transition-all",
                              node.id === user?.id
                                ? "border-red-500/10 text-red-500/20 cursor-not-allowed"
                                : "border-red-500/40 text-red-500 hover:border-red-500 hover:bg-red-500/10"
                            )}
                          >
                            [DEACTIVATE]
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Configuration Dialog Modal */}
      <AnimatePresence>
        {editingNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={clsx(
                "border bg-[var(--color-bg-dark)] max-w-md w-full p-6 font-mono rounded-sm shadow-xl relative overflow-hidden",
                isRoot ? "border-amber-500/30" : "border-cyan-500/30"
              )}
            >
              <div className="absolute inset-0 pointer-events-none scanline opacity-5" />
              
              <h3 className={clsx("text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4", isRoot ? "text-amber-400" : "text-cyan-400")}>
                {isApproving ? "⚡ ACTIVATE_NODE_IDENTITY" : "⚙️ RECONFIGURE_NODE_CREDENTIALS"}
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Target Name</label>
                  <div className="p-2 bg-black/40 border border-white/5 text-white font-bold">{editingNode.name}</div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Node Username</label>
                  <div className="p-2 bg-black/40 border border-white/5 text-white/70">@{editingNode.username || "guest"}</div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      const newDept = e.target.value as DepartmentId;
                      setSelectedDept(newDept);
                      // Auto-update default position based on suggestions
                      if (POSITION_SUGGESTIONS[newDept]) {
                        setSelectedPosition(POSITION_SUGGESTIONS[newDept][0]);
                      }
                    }}
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id} className="bg-neutral-900 text-white">
                        {dept.icon} {dept.label} ({dept.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Position / Role Title</label>
                  <input
                    type="text"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    placeholder="Enter custom position"
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none mb-1.5",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {POSITION_SUGGESTIONS[selectedDept]?.map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setSelectedPosition(pos)}
                        className="text-[8px] bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded-sm text-neutral-300"
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Security Clearance</label>
                  <select
                    value={selectedClearance}
                    onChange={(e) => setSelectedClearance(e.target.value as ClearanceType)}
                    className={clsx(
                      "w-full bg-black/80 border p-2 text-white outline-none",
                      isRoot ? "border-amber-500/20 focus:border-amber-500" : "border-cyan-500/20 focus:border-cyan-500"
                    )}
                  >
                    <option value="member" className="bg-neutral-900 text-white">MEMBER (Standard Access)</option>
                    <option value="officer" className="bg-neutral-900 text-white">OFFICER (Operations Overseer)</option>
                    {isRoot && (
                      <option value="root" className="bg-neutral-900 text-red-500">ROOT (System Dev Admin)</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                <button
                  onClick={() => setEditingNode(null)}
                  className="flex-1 py-2 text-center border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-[10px] uppercase tracking-widest transition-all"
                >
                  [CANCEL]
                </button>
                <button
                  onClick={handleSaveNodeConfig}
                  className={clsx(
                    "flex-1 py-2 text-center text-[10px] uppercase tracking-widest text-black font-bold transition-all",
                    isRoot ? "bg-amber-500 hover:bg-amber-400" : "bg-cyan-500 hover:bg-cyan-400"
                  )}
                >
                  {isApproving ? "[ACTIVATE_NODE]" : "[UPDATE_IDENTITY]"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Temporary Password Notification Modal */}
      <AnimatePresence>
        {tempKeyModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm font-mono">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={clsx(
                "border max-w-md w-full p-6 bg-black rounded-sm shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.2)] relative overflow-hidden",
                isRoot ? "border-amber-500/30" : "border-cyan-500/30"
              )}
            >
              <div className="absolute inset-0 pointer-events-none scanline opacity-5" />
              
              <div className="flex gap-2 items-center text-xs uppercase font-bold text-emerald-400 mb-3 border-b border-emerald-500/20 pb-2">
                <span>🔑 TEMPORARY_DECRYPT_KEY_ISSUED</span>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-neutral-400 leading-relaxed uppercase">
                  A temporary decryption key has been compiled for Node <strong className="text-[var(--color-primary)]">@{tempKeyModal.username}</strong>. 
                </p>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest opacity-50 block">// ACCESS KEY VALUE</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={tempKeyModal.tempKey}
                      id="eniac-temp-key"
                      className="w-full bg-neutral-900 border border-neutral-800 p-3 text-emerald-400 font-bold font-mono tracking-widest outline-none text-center select-all rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-sm text-[10px] text-emerald-400 leading-relaxed uppercase">
                  <strong>Important:</strong> Copy this key and send it to the node member via external channels. They must use this key to login and are advised to assign a new password immediately.
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    const copyText = document.getElementById("eniac-temp-key") as HTMLInputElement;
                    if (copyText) {
                      copyText.select();
                      navigator.clipboard.writeText(copyText.value);
                    }
                  }}
                  className="flex-1 py-2 text-center border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-emerald-400 text-[10px] uppercase tracking-widest transition-all font-bold"
                >
                  [COPY KEY]
                </button>
                <button
                  onClick={() => setTempKeyModal(null)}
                  className={clsx(
                    "flex-1 py-2 text-center text-[10px] uppercase tracking-widest text-black font-bold transition-all",
                    isRoot ? "bg-amber-500 hover:bg-amber-400" : "bg-cyan-500 hover:bg-cyan-400"
                  )}
                >
                  [TERMINATE_SESSION]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
