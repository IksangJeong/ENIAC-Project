"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Announcement } from "@/types";

interface TickerProps {
  items: TickerItem[];
  speed?: number;
  className?: string;
}

interface TickerItem {
  id: string;
  text: string;
  type?: "normal" | "important" | "urgent";
  icon?: string;
}

export function Ticker({ items, speed = 30, className }: TickerProps) {
  if (items.length === 0) {
    return null;
  }

  // Double the items for seamless loop
  const tickerContent = [...items, ...items];

  const typeStyles = {
    normal: "text-[var(--color-primary)]",
    important: "text-[var(--color-warning)]",
    urgent: "text-[var(--color-error)]",
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        "border-t border-[var(--color-accent-glow)]",
        "bg-[var(--color-bg-black)] bg-opacity-90",
        "py-2",
        className
      )}
    >
      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--color-bg-black)] to-transparent z-10" />

      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--color-bg-black)] to-transparent z-10" />

      {/* Ticker Label */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 bg-[var(--color-primary)] rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-[10px] uppercase tracking-wider opacity-70">
          NOTICE
        </span>
      </div>

      {/* Scrolling Content */}
      <motion.div
        className="flex whitespace-nowrap pl-24"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: items.length * speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {tickerContent.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center mx-8"
          >
            {item.type === "urgent" && (
              <motion.span
                className="mr-2 text-[var(--color-error)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                !!
              </motion.span>
            )}
            {item.type === "important" && (
              <span className="mr-2 text-[var(--color-warning)]">!</span>
            )}
            <span
              className={clsx(
                "text-xs tracking-wider",
                typeStyles[item.type || "normal"]
              )}
            >
              {item.text}
            </span>
            <span className="mx-4 text-[var(--color-accent-glow)]">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Convert announcements to ticker items
export function announcementsToTickerItems(
  announcements: Announcement[]
): TickerItem[] {
  return announcements.map((a) => ({
    id: a.id,
    text: a.title,
    type:
      a.priority === "urgent"
        ? "urgent"
        : a.priority === "important"
        ? "important"
        : "normal",
  }));
}
