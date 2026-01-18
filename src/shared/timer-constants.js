/**
 * Ninja Timer - Timer Constants
 * Shared constants for timer settings UI
 *
 * Note: BUILT_IN_FONTS is in fontManager.js
 * Note: BUILT_IN_SOUNDS is in soundManager.js
 */

// Theme background colors (must match CSS variables)
export const THEME_BACKGROUNDS = {
  light: '#faf9f6',  // Warm cream
  dark: '#0a0a0a'    // Near black
};

// Default timer configuration
export const DEFAULT_TIMER_CONFIG = {
  mode: 'countdown',
  durationSec: 600,
  format: 'MM:SS',
  allowOvertime: true,
  startMode: 'manual',
  targetTime: null,
  style: {
    fontFamily: 'Inter',
    fontWeight: 700,
    color: '#ffffff',
    strokeWidth: 0,
    strokeColor: '#000000',
    shadowSize: 0,
    shadowColor: '#000000',
    bgColor: '#000000'
  },
  sound: {
    endType: 'none',
    volume: 0.7
  },
  warnYellowSec: 60,
  warnOrangeSec: 15
};

// Font weight labels for display
export const FONT_WEIGHT_OPTIONS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
];

// Timer modes
export const TIMER_MODES = [
  { value: 'countdown', label: 'Countdown' },
  { value: 'countup', label: 'Count Up' },
  { value: 'tod', label: 'Time of Day' },
  { value: 'countdown-tod', label: 'C/D + ToD' },
  { value: 'countup-tod', label: 'C/U + ToD' }
];

// Start modes
export const START_MODES = [
  { value: 'manual', label: 'Manual' },
  { value: 'endBy', label: 'End By Time' },
  { value: 'startAt', label: 'Start At Time' }
];

// Time format options
export const FORMAT_OPTIONS = [
  { value: 'HH:MM:SS', label: 'HH:MM:SS' },
  { value: 'MM:SS', label: 'MM:SS' }
];
