"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ClockProps {
  format?: "24h" | "12h";
  showSeconds?: boolean;
  showDate?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Clock({
  format = "24h",
  showSeconds = true,
  showDate = false,
  size = "md",
  className,
}: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours =
    format === "24h"
      ? time.getHours()
      : time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = format === "12h" ? (time.getHours() >= 12 ? "PM" : "AM") : "";

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const dateString = time.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  return (
    <div className={clsx("flex flex-col items-center", className)}>
      <div className={clsx("font-mono tracking-wider", sizeClasses[size])}>
        <span className="inline-block w-[1.2em] text-center">
          {formatNumber(hours)[0]}
        </span>
        <span className="inline-block w-[1.2em] text-center">
          {formatNumber(hours)[1]}
        </span>
        <motion.span
          className="inline-block mx-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>
        <span className="inline-block w-[1.2em] text-center">
          {formatNumber(minutes)[0]}
        </span>
        <span className="inline-block w-[1.2em] text-center">
          {formatNumber(minutes)[1]}
        </span>
        {showSeconds && (
          <>
            <motion.span
              className="inline-block mx-1"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            <span className="inline-block w-[1.2em] text-center opacity-70">
              {formatNumber(seconds)[0]}
            </span>
            <span className="inline-block w-[1.2em] text-center opacity-70">
              {formatNumber(seconds)[1]}
            </span>
          </>
        )}
        {ampm && (
          <span className="ml-2 text-[0.5em] opacity-70">{ampm}</span>
        )}
      </div>
      {showDate && (
        <div className="text-[10px] uppercase tracking-wider opacity-50 mt-1">
          {dateString}
        </div>
      )}
    </div>
  );
}
