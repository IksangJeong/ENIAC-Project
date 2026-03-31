'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Clock } from '../ui/Clock';
import { ConnectionStatus } from '../ui/StatusIndicator';

interface MobileHeaderProps {
  isConnected?: boolean;
  className?: string;
}

export function MobileHeader({ isConnected = true, className }: MobileHeaderProps) {
  return (
    <motion.header
      className={clsx(
        'mobile-header flex items-center justify-between px-3',
        className
      )}
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-2">
        <div className="relative">
          {/* Logo Hexagon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 40 40"
            className="fill-none stroke-current"
          >
            <polygon
              points="20,2 38,11 38,29 20,38 2,29 2,11"
              strokeWidth="1.5"
              className="stroke-[var(--color-primary)]"
            />
            <text
              x="20"
              y="24"
              textAnchor="middle"
              className="fill-[var(--color-primary)] text-[12px] font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              E
            </text>
          </svg>
          {/* Glow effect */}
          <div className="absolute inset-0 blur-sm opacity-30">
            <svg
              width="28"
              height="28"
              viewBox="0 0 40 40"
              className="fill-none stroke-current"
            >
              <polygon
                points="20,2 38,11 38,29 20,38 2,29 2,11"
                strokeWidth="2"
                className="stroke-[var(--color-primary)]"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <span
            className="text-xs font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ENIAC
          </span>
          <span className="text-[8px] uppercase tracking-widest opacity-50">
            Dashboard
          </span>
        </div>
      </div>

      {/* Center - Connection Status */}
      <ConnectionStatus isConnected={isConnected} className="hidden sm:flex" />

      {/* Right - Clock */}
      <div className="flex items-center gap-3">
        <div className="sm:hidden">
          {/* Mobile: Small connection dot only */}
          <div
            className={clsx(
              'w-2 h-2 rounded-full',
              isConnected
                ? 'bg-[var(--color-success)] shadow-[0_0_6px_var(--color-success)]'
                : 'bg-[var(--color-error)] shadow-[0_0_6px_var(--color-error)]'
            )}
          />
        </div>
        <Clock size="sm" showSeconds={false} />
      </div>
    </motion.header>
  );
}

export default MobileHeader;
