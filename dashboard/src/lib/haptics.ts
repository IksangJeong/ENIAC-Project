/**
 * Haptic Feedback Utility
 * Provides vibration patterns for various UI interactions on mobile devices.
 */

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

// Vibration patterns in milliseconds [vibrate, pause, vibrate, pause, ...]
const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  selection: 10,
  success: [10, 50, 10],
  warning: [20, 30, 20],
  error: [30, 50, 30, 50, 30],
};

/**
 * Check if the Vibration API is supported
 */
export function isHapticSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 * @param type - The type of haptic feedback to trigger
 * @returns boolean indicating if haptic was triggered
 */
export function triggerHaptic(type: HapticType = 'selection'): boolean {
  if (!isHapticSupported()) {
    return false;
  }

  try {
    const pattern = HAPTIC_PATTERNS[type];
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): boolean {
  if (!isHapticSupported()) {
    return false;
  }

  try {
    return navigator.vibrate(0);
  } catch {
    return false;
  }
}

/**
 * Trigger haptic for tab selection
 */
export function hapticTabSelect(): boolean {
  return triggerHaptic('selection');
}

/**
 * Trigger haptic for successful action
 */
export function hapticSuccess(): boolean {
  return triggerHaptic('success');
}

/**
 * Trigger haptic for warning
 */
export function hapticWarning(): boolean {
  return triggerHaptic('warning');
}

/**
 * Trigger haptic for error
 */
export function hapticError(): boolean {
  return triggerHaptic('error');
}

/**
 * Trigger haptic for pull-to-refresh threshold reached
 */
export function hapticPullRefresh(): boolean {
  return triggerHaptic('medium');
}

export default {
  trigger: triggerHaptic,
  stop: stopHaptic,
  isSupported: isHapticSupported,
  tabSelect: hapticTabSelect,
  success: hapticSuccess,
  warning: hapticWarning,
  error: hapticError,
  pullRefresh: hapticPullRefresh,
};
