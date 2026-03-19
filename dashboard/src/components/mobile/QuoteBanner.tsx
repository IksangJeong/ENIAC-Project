'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Quote } from '@/types';

interface QuoteBannerProps {
  quote?: Quote;
  className?: string;
  onTap?: () => void;
}

export function QuoteBanner({ quote, className, onTap }: QuoteBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-collapse after 5 seconds
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  if (!quote) return null;

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    onTap?.();
  };

  // Truncate quote for collapsed view
  const quoteText = quote.quote;
  const truncatedQuote =
    quoteText.length > 60
      ? quoteText.substring(0, 60) + '...'
      : quoteText;

  return (
    <motion.button
      className={clsx('quote-banner w-full text-left cursor-pointer', className)}
      onClick={handleTap}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="pl-4 pr-2">{quoteText}</p>
            <p className="quote-banner-author">— {quote.author}</p>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2"
          >
            <p className="pl-4 truncate flex-1 text-[10px]">{truncatedQuote}</p>
            <span className="text-[8px] uppercase tracking-wider opacity-50 whitespace-nowrap">
              — {quote.author}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap hint */}
      {!isExpanded && quoteText.length > 60 && (
        <motion.span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          TAP
        </motion.span>
      )}
    </motion.button>
  );
}

export default QuoteBanner;
