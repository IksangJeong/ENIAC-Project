"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  glitchOnHover?: boolean;
  glitchOnMount?: boolean;
  glitchInterval?: number; // Auto glitch every X ms
}

export function GlitchText({
  text,
  className,
  as: Component = "span",
  glitchOnHover = false,
  glitchOnMount = true,
  glitchInterval,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (glitchOnMount) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  }, [glitchOnMount]);

  useEffect(() => {
    if (glitchInterval) {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }, glitchInterval);
      return () => clearInterval(interval);
    }
  }, [glitchInterval]);

  const handleHover = () => {
    if (glitchOnHover && !isGlitching) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  };

  return (
    <Component
      className={clsx(
        "relative inline-block",
        isGlitching && "glitch",
        glitchOnHover && "cursor-pointer",
        className
      )}
      onMouseEnter={handleHover}
    >
      {text}
    </Component>
  );
}

// Typing effect component
interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypingText({
  text,
  className,
  speed = 50,
  delay = 0,
  showCursor = true,
  onComplete,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <motion.span
      className={clsx("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      {showCursor && !isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-[var(--color-primary)] ml-1 animate-pulse" />
      )}
    </motion.span>
  );
}

// Scramble text effect
interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function ScrambleText({
  text,
  className,
  duration = 1000,
  delay = 0,
}: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayedText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, duration / (text.length * 3));

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, duration, delay]);

  return (
    <span className={clsx("font-mono", className)}>
      {displayedText}
    </span>
  );
}
