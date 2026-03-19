'use client';

import { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import clsx from 'clsx';
import { MobileHeader } from './MobileHeader';
import { MobileNavigation, TabId } from './MobileNavigation';
import { QuoteBanner } from './QuoteBanner';
import { Quote } from '@/types';

interface MobileLayoutProps {
  // Module components passed from parent
  serverStatusModule: ReactNode;
  onlineUsersModule: ReactNode;
  commitRankingModule: ReactNode;
  scheduleModule: ReactNode;
  algorithmChallengeModule: ReactNode;
  // Data for mobile-specific features
  quote?: Quote;
  isConnected?: boolean;
  className?: string;
}

// Animation variants for tab content
const contentVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn' as const,
    },
  }),
};

export function MobileLayout({
  serverStatusModule,
  onlineUsersModule,
  commitRankingModule,
  scheduleModule,
  algorithmChallengeModule,
  quote,
  isConnected = true,
  className,
}: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('status');
  const [direction, setDirection] = useState(0);

  // Tab order for determining animation direction
  const tabOrder: TabId[] = ['status', 'members', 'commits', 'schedule', 'challenge'];

  const handleTabChange = useCallback(
    (newTab: TabId) => {
      const currentIndex = tabOrder.indexOf(activeTab);
      const newIndex = tabOrder.indexOf(newTab);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setActiveTab(newTab);
    },
    [activeTab, tabOrder]
  );

  // Map tab IDs to their content
  const getTabContent = (tab: TabId): ReactNode => {
    switch (tab) {
      case 'status':
        return (
          <div className="space-y-3">
            {/* Quote banner on status tab */}
            {quote && <QuoteBanner quote={quote} />}
            {serverStatusModule}
          </div>
        );
      case 'members':
        return onlineUsersModule;
      case 'commits':
        return commitRankingModule;
      case 'schedule':
        return scheduleModule;
      case 'challenge':
        return algorithmChallengeModule;
      default:
        return null;
    }
  };

  // Get tab title for header (optional, for context)
  const getTabTitle = (tab: TabId): string => {
    const titles: Record<TabId, string> = {
      status: 'System Status',
      members: 'Online Members',
      commits: 'Commit Ranking',
      schedule: 'Events & Schedule',
      challenge: 'Algorithm Challenge',
    };
    return titles[tab];
  };

  return (
    <div
      className={clsx(
        'flex flex-col h-screen bg-[var(--color-bg-black)]',
        className
      )}
    >
      {/* Scanline overlay for cyberpunk effect */}
      <div className="fixed inset-0 z-50 pointer-events-none scanline" />

      {/* Mobile Header */}
      <MobileHeader isConnected={isConnected} />

      {/* Content Area */}
      <main className="mobile-content flex-1 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {getTabContent(activeTab)}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default MobileLayout;
