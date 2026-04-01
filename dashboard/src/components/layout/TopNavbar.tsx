"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchText, ConnectionStatus } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { signOut } from "next-auth/react";
import clsx from "clsx";

interface NavLink {
  id: string;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "members", label: "Members", href: "/members" },
  { id: "groups", label: "Groups", href: "/groups" },
  { id: "schedule", label: "Schedule", href: "/schedule" },
  { id: "github", label: "Github", href: "/github" },
  { id: "algorithm", label: "Algorithm", href: "/algorithm" },
];

interface TopNavbarProps {
  isConnected?: boolean;
  activePage?: string;
  className?: string;
}

export function TopNavbar({
  isConnected = true,
  activePage,
  className,
}: TopNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setProfileSettingsOpen } = useAuthStore();

  // Determine active page from pathname or prop
  const currentPage = activePage || navLinks.find(link => link.href === pathname)?.id || "dashboard";

  const handleLogout = async () => {
    // 1. NextAuth 세션 종료 (GitHub 등)
    await signOut({ redirect: false });
    
    // 2. 자체 로그아웃 API 호출
    await fetch('/api/auth/logout', { method: 'POST' });
    
    // 3. Zustand 및 LocalStorage 클리어
    logout();
    
    // 4. 로그인 페이지로 이동
    router.push('/auth/login');
  };

  return (
    <motion.nav
      className={clsx(
        "flex-shrink-0 z-40 w-full h-14",
        "bg-[var(--color-bg-black)]/90 backdrop-blur-md",
        "border-b border-[var(--color-primary)]/20",
        "px-4 md:px-6 lg:px-8",
        "shadow-[0_1px_20px_rgba(170,207,209,0.05)]",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-7 h-7 border border-[var(--color-primary)] flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 5px var(--color-accent-glow)",
                "0 0 15px var(--color-accent-glow)",
                "0 0 5px var(--color-accent-glow)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-bold">E</span>
          </motion.div>
          <GlitchText
            text="ENIAC"
            as="span"
            className="text-base md:text-lg font-bold tracking-[0.2em] uppercase"
            glitchOnHover
            glitchInterval={15000}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={clsx(
                "text-[11px] xl:text-sm uppercase tracking-widest transition-all duration-300",
                "hover:text-[var(--color-primary)] hover:glow",
                currentPage === link.id
                  ? "text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-1 glow"
                  : "text-[var(--color-text-secondary)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Connection Status */}
          <ConnectionStatus isConnected={isConnected} />

          {/* User Info (Desktop) */}
          <div className="hidden md:flex items-center gap-2 pl-3 lg:pl-5 border-l border-[var(--color-primary)]/20">
            <button 
              onClick={() => setProfileSettingsOpen(true)}
              className="text-right hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-end gap-1">
                {user?.role === "admin" && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]"
                    title="System Administrator"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                    </svg>
                  </motion.span>
                )}
                <p className={clsx(
                  "text-[11px] font-bold uppercase tracking-tight",
                  user?.role === "admin" ? "text-amber-400" : "text-[var(--color-text-primary)]"
                )}>
                  {user?.name || 'Guest'}
                </p>
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">
                {user?.role === "admin" ? "Level 4 Admin" : user?.username || 'Unknown'}
              </p>
            </button>
            <motion.div 
              onClick={() => setProfileSettingsOpen(true)}
              className={clsx(
                "w-7 h-7 rounded-full border overflow-hidden relative cursor-pointer",
                user?.role === "admin" 
                  ? "border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                  : "border-[var(--color-primary)]/30"
              )}
              animate={user?.role === "admin" ? {
                borderColor: ["rgba(245,158,11,0.5)", "rgba(245,158,11,0.8)", "rgba(245,158,11,0.5)"],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className={clsx(
                  "w-full h-full flex items-center justify-center",
                  user?.role === "admin" ? "bg-amber-500/20" : "bg-[var(--color-primary)]/20"
                )}>
                  <span className={clsx(
                    "text-[11px]",
                    user?.role === "admin" ? "text-amber-400" : "text-[var(--color-primary)]"
                  )}>
                    {user?.name?.[0] || 'U'}
                  </span>
                </div>
              )}
              {/* Admin scanline effect */}
              {user?.role === "admin" && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent pointer-events-none"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              className="w-5 h-4 flex flex-col justify-between"
              animate={mobileMenuOpen ? "open" : "closed"}
            >
              <motion.span
                className="w-full h-[2px] bg-[var(--color-primary)]"
                variants={{
                  open: { rotate: 45, y: 7 },
                  closed: { rotate: 0, y: 0 },
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-full h-[2px] bg-[var(--color-primary)]"
                variants={{
                  open: { opacity: 0 },
                  closed: { opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-full h-[2px] bg-[var(--color-primary)]"
                variants={{
                  open: { rotate: -45, y: -7 },
                  closed: { rotate: 0, y: 0 },
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute left-0 right-0 top-14 bg-[var(--color-bg-black)]/95 backdrop-blur-md border-b border-[var(--color-primary)]/20"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "text-sm uppercase tracking-widest py-3 px-4 transition-all",
                    "border-l-2",
                    currentPage === link.id
                      ? "text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      : "text-[var(--color-text-secondary)] border-transparent hover:border-[var(--color-primary)]/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* Profile Settings for Mobile */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileSettingsOpen(true);
                }}
                className="text-sm uppercase tracking-widest py-3 px-4 text-[var(--color-primary)] border-l-2 border-transparent hover:border-[var(--color-primary)]/50 text-left transition-all"
              >
                Node Settings
              </button>
              {/* Logout for Mobile */}
              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-sm uppercase tracking-widest py-3 px-4 text-red-400/80 hover:text-red-400 border-l-2 border-transparent hover:border-red-400/50 text-left transition-all"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
