"use client";

import { Panel, StatusIndicator, ProgressBar } from "@/components/ui";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { AlgorithmChallenge as ChallengeType } from "@/types";

interface AlgorithmChallengeProps {
  challenges: ChallengeType[];
  delay?: number;
}

export function AlgorithmChallenge({
  challenges,
  delay = 0,
}: AlgorithmChallengeProps) {
  const activeChallenge = challenges.find((c) => c.status === "in_progress");
  const completedCount = challenges.filter(
    (c) => c.status === "completed"
  ).length;

  return (
    <Panel
      title="ALGORITHM CHALLENGE"
      subtitle="LIVE"
      delay={delay}
      className="h-full"
    >
      {activeChallenge ? (
        <ActiveChallengeView challenge={activeChallenge} delay={delay} />
      ) : (
        <NoChallengeView completedCount={completedCount} delay={delay} />
      )}
    </Panel>
  );
}

function ActiveChallengeView({
  challenge,
  delay,
}: {
  challenge: ChallengeType;
  delay: number;
}) {
  const solvedCount = challenge.participants.filter((p) => p.solved).length;
  const totalCount = challenge.participants.length;
  const progress = (solvedCount / totalCount) * 100;

  const difficultyConfig = {
    easy: { color: "var(--color-success)", label: "EASY" },
    medium: { color: "var(--color-warning)", label: "MEDIUM" },
    hard: { color: "var(--color-error)", label: "HARD" },
  };

  const config = difficultyConfig[challenge.difficulty];

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-[var(--color-error)]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-error)]">
          LIVE NOW
        </span>
      </motion.div>

      {/* Problem Title */}
      <div>
        <h3 className="text-lg font-medium mb-1">{challenge.problemTitle}</h3>
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-0.5 border"
          style={{ borderColor: config.color, color: config.color }}
        >
          {config.label}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="opacity-50">SOLVED</span>
          <span>
            {solvedCount} / {totalCount}
          </span>
        </div>
        <ProgressBar
          value={progress}
          showValue={false}
          variant="success"
          size="md"
        />
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider opacity-50">
          PARTICIPANTS
        </span>
        <div className="grid grid-cols-2 gap-2">
          {challenge.participants.slice(0, 6).map((participant, index) => (
            <motion.div
              key={participant.userId}
              className={clsx(
                "flex items-center gap-2 p-1.5 border",
                participant.solved
                  ? "border-[var(--color-success)] bg-[var(--color-success)] bg-opacity-10"
                  : "border-[var(--color-accent-dim)]"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1 * index }}
            >
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.username}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-[9px]">
                  {participant.username[0]}
                </div>
              )}
              <span className="text-xs truncate flex-1">
                {participant.username}
              </span>
              {participant.solved && (
                <span className="text-[var(--color-success)] text-xs">✓</span>
              )}
            </motion.div>
          ))}
        </div>
        {challenge.participants.length > 6 && (
          <div className="text-[10px] text-center opacity-50">
            + {challenge.participants.length - 6} MORE
          </div>
        )}
      </div>
    </div>
  );
}

function NoChallengeView({
  completedCount,
  delay,
}: {
  completedCount: number;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="text-4xl mb-4 opacity-30"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚔️
      </motion.div>
      <div className="text-sm opacity-70 text-center">
        NO ACTIVE CHALLENGE
      </div>
      <div className="text-[10px] uppercase tracking-wider opacity-30 mt-2">
        {completedCount} CHALLENGES COMPLETED TODAY
      </div>

      {/* Decorative Line */}
      <motion.div
        className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent mt-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.3 }}
      />
    </motion.div>
  );
}
