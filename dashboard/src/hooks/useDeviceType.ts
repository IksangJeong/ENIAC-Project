'use client';

import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceTypeConfig {
  mobileMax: number;
  tabletMax: number;
}

const DEFAULT_CONFIG: DeviceTypeConfig = {
  mobileMax: 767,  // < 768px = mobile
  tabletMax: 1023, // 768px - 1023px = tablet, >= 1024px = desktop
};

/**
 * Hook to detect the current device type based on viewport width.
 * Handles SSR by defaulting to 'desktop' on server.
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: >= 1024px
 */
export function useDeviceType(config: DeviceTypeConfig = DEFAULT_CONFIG): DeviceType {
  // Default to desktop for SSR
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isClient, setIsClient] = useState(false);

  const getDeviceType = useCallback((): DeviceType => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;

    if (width <= config.mobileMax) {
      return 'mobile';
    } else if (width <= config.tabletMax) {
      return 'tablet';
    }
    return 'desktop';
  }, [config.mobileMax, config.tabletMax]);

  useEffect(() => {
    setIsClient(true);

    // Set initial value on mount
    setDeviceType(getDeviceType());

    // Debounced resize handler for performance
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDeviceType(getDeviceType());
      }, 100); // 100ms debounce
    };

    window.addEventListener('resize', handleResize);

    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [getDeviceType]);

  return deviceType;
}

/**
 * Hook to check if the current device is mobile or tablet (touch-friendly)
 */
export function useIsMobileOrTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'mobile' || deviceType === 'tablet';
}

/**
 * Hook to check if the current device is mobile only
 */
export function useIsMobile(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'mobile';
}

/**
 * Hook to check if the current device is desktop
 */
export function useIsDesktop(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'desktop';
}

export default useDeviceType;
