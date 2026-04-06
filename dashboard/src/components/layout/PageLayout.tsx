"use client";

import { motion } from "framer-motion";
import { TopNavbar } from "./TopNavbar";
import { Footer } from "./Footer";
import { ProfileSettingsModal } from "@/components/dashboard";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";

export type PageType = "dashboard" | "members" | "schedule" | "github" | "algorithm" | "groups";

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
  const { isProfileSettingsOpen, setProfileSettingsOpen } = useAuthStore();

  return (
    // h-[100dvh] ensures it works correctly on mobile and desktop browsers
    <div className="h-[100dvh] w-full flex flex-col bg-[var(--color-bg-black)] overflow-hidden relative font-mono selection:bg-[var(--color-primary)] selection:text-black">
      
      {/* 1. System Overlays */}
      <div className="fixed inset-0 pointer-events-none scanline z-[60] opacity-10" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] z-[55] bg-[url('https://res.cloudinary.com/djne76asw/image/upload/v1624442144/noise_vv6vsm.png')]" />

      {/* 2. Header (Fixed Height: 3.5rem / 56px) */}
      <TopNavbar isConnected={isConnected} activePage={activePage} />

      {/* 3. Main Content Area (Scrollable internally) */}
      <main
        className={clsx(
          "flex-1 w-full relative",
          "overflow-y-auto overflow-x-hidden custom-scrollbar",
          "px-2 sm:px-4 md:px-6 lg:px-8", // Fluid horizontal padding
          "py-4 sm:py-6", // Adaptive vertical padding
          className
        )}
      >
        <motion.div
          className="max-w-[1600px] mx-auto min-h-full pb-16" // Centered wide container with bottom safety space
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* 4. Footer (Fixed at Bottom) */}
      <Footer />

      {/* 5. Global Modals */}
      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setProfileSettingsOpen(false)} 
      />
    </div>
  );
}
