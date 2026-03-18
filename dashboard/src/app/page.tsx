"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header, Ticker, DashboardGrid, LeftColumn, CenterColumn, RightColumn, announcementsToTickerItems } from "@/components/layout";
import {
  ServerStatus,
  OnlineUsers,
  QuoteOfDay,
  CommitRanking,
  Schedule,
  AlgorithmChallenge,
} from "@/components/modules";
import {
  mockServerStatus,
  mockUsers,
  mockCrowdLevel,
  mockCommitRankings,
  mockSchedules,
  mockQuote,
  mockChallenges,
  mockAnnouncements,
  getRandomServerStatus,
} from "@/lib/mockData";
import type { ServerStatus as ServerStatusType } from "@/types";

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [serverStatus, setServerStatus] = useState<ServerStatusType>(mockServerStatus);

  // Simulate real-time server status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServerStatus(getRandomServerStatus());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate connection status
  useEffect(() => {
    // Random disconnection simulation (for demo)
    const checkConnection = () => {
      // 95% chance of being connected
      setIsConnected(Math.random() > 0.05);
    };
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = announcementsToTickerItems(mockAnnouncements);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none scanline z-50" />

      {/* Header */}
      <Header isConnected={isConnected} />

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-hidden">
        <DashboardGrid>
          {/* Left Column */}
          <LeftColumn>
            <ServerStatus data={serverStatus} delay={0.1} />
            <OnlineUsers
              users={mockUsers}
              crowdLevel={mockCrowdLevel}
              delay={0.2}
            />
          </LeftColumn>

          {/* Center Column */}
          <CenterColumn>
            <QuoteOfDay quote={mockQuote} delay={0.15} />
            <div className="flex-1">
              <Schedule schedules={mockSchedules} delay={0.25} />
            </div>
          </CenterColumn>

          {/* Right Column */}
          <RightColumn>
            <CommitRanking rankings={mockCommitRankings} delay={0.2} />
            <AlgorithmChallenge challenges={mockChallenges} delay={0.3} />
          </RightColumn>
        </DashboardGrid>
      </main>

      {/* Bottom Ticker */}
      <Ticker items={tickerItems} speed={25} />

      {/* Boot Animation Overlay */}
      <BootAnimation />
    </div>
  );
}

// Boot Animation Component
function BootAnimation() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"logo" | "loading" | "done">("logo");

  useEffect(() => {
    // Logo phase
    const logoTimer = setTimeout(() => {
      setPhase("loading");
    }, 1500);

    // Loading phase
    const loadingTimer = setTimeout(() => {
      setPhase("done");
    }, 3000);

    // Hide animation
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[var(--color-bg-black)] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "done" ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {phase === "logo" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.h1
              className="text-6xl font-bold tracking-widest glow"
              animate={{
                textShadow: [
                  "0 0 10px var(--color-primary)",
                  "0 0 30px var(--color-primary)",
                  "0 0 10px var(--color-primary)",
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ENIAC
            </motion.h1>
            <motion.p
              className="text-sm tracking-[0.5em] mt-2 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3 }}
            >
              DASHBOARD
            </motion.p>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-sm tracking-wider opacity-70">
              INITIALIZING SYSTEM...
            </div>
            <div className="w-48 h-1 bg-[var(--color-accent-dim)] mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-primary)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
              />
            </div>
            <div className="text-[10px] tracking-wider opacity-30">
              LOADING MODULES...
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
