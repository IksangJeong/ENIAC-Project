"use client";

import { motion } from "framer-motion";
import { TopNavbar } from "./TopNavbar";
import { Footer } from "./Footer";
import clsx from "clsx";

export type PageType = "dashboard" | "members" | "schedule" | "github" | "algorithm";

interface PageLayoutProps {
  children: React.ReactNode;
  activePage: PageType;
  isConnected?: boolean;
  showBootAnimation?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  activePage,
  isConnected = true,
  className,
}: PageLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-black)]">
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none scanline z-50" />

      {/* Top Navigation - Fixed Height */}
      <TopNavbar isConnected={isConnected} activePage={activePage} />

      {/* Main Content - Flexible, No Overflow */}
      <main
        className={clsx(
          "flex-1",
          "overflow-y-auto lg:overflow-hidden",
          "px-4 md:px-6 lg:px-8",
          "py-4 md:py-6",
          className
        )}
      >
        <motion.div
          className="lg:h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer - Fixed Height */}
      <Footer />
    </div>
  );
}
