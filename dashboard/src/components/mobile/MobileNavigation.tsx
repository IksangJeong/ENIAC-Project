'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { hapticTabSelect } from '@/lib/haptics';

export type TabId = 'status' | 'members' | 'commits' | 'schedule' | 'challenge';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface MobileNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hasNotification?: Partial<Record<TabId, boolean>>;
  className?: string;
}

// SVG Icons for each tab
const ServerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="6" rx="1" />
    <rect x="2" y="11" width="20" height="6" rx="1" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="14" r="1" fill="currentColor" />
    <line x1="10" y1="6" x2="18" y2="6" />
    <line x1="10" y1="14" x2="18" y2="14" />
    <path d="M6 19 L12 22 L18 19" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M21 21v-1.5a3 3 0 0 0-2-2.83" />
  </svg>
);

const GitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M12 8v4" />
    <path d="M12 12c0 2-2 4-6 6" />
    <path d="M12 12c0 2 2 4 6 6" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="3" fill="currentColor" />
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" strokeOpacity="0.5" />
  </svg>
);

const TABS: Tab[] = [
  { id: 'status', label: 'STATUS', icon: <ServerIcon /> },
  { id: 'members', label: 'MEMBERS', icon: <UsersIcon /> },
  { id: 'commits', label: 'COMMITS', icon: <GitIcon /> },
  { id: 'schedule', label: 'EVENTS', icon: <CalendarIcon /> },
  { id: 'challenge', label: 'CODE', icon: <CodeIcon /> },
];

export function MobileNavigation({
  activeTab,
  onTabChange,
  hasNotification = {},
  className,
}: MobileNavigationProps) {
  return (
    <nav className={clsx('mobile-nav', className)}>
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasNotif = hasNotification[tab.id];

          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                hapticTabSelect();
                onTabChange(tab.id);
              }}
              className={clsx(
                'mobile-nav-item relative flex-1',
                isActive && 'active'
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {/* Icon */}
              <motion.div
                className="mobile-nav-icon"
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                {tab.icon}
              </motion.div>

              {/* Label */}
              <motion.span
                className="mobile-nav-label"
                animate={{
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.15 }}
              >
                {tab.label}
              </motion.span>

              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-[var(--color-primary)]"
                  layoutId="activeTab"
                  style={{
                    boxShadow: '0 0 8px var(--color-primary), 0 0 12px var(--color-primary)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {/* Notification dot */}
              {hasNotif && !isActive && (
                <motion.div
                  className="absolute top-1 right-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-error)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    boxShadow: '0 0 4px var(--color-error)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Top border glow effect */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
          opacity: 0.5,
        }}
      />
    </nav>
  );
}

export default MobileNavigation;
