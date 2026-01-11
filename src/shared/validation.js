/**
 * Ninja Timer - Input Validation
 * Validates and sanitizes user input
 */

/**
 * Validate timer configuration object
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validated configuration with defaults for invalid values
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    return null;
  }

  return {
    mode: validateMode(config.mode),
    durationSec: validateDuration(config.durationSec),
    format: validateFormat(config.format),
    style: validateStyle(config.style),
    sound: validateSound(config.sound)
  };
}

/**
 * Validate timer mode
 */
export function validateMode(mode) {
  const validModes = ['countdown', 'countup', 'tod', 'countdown-tod', 'countup-tod', 'hidden'];
  return validModes.includes(mode) ? mode : 'countdown';
}

/**
 * Validate duration in seconds
 */
export function validateDuration(duration) {
  const num = Number(duration);
  if (isNaN(num) || num < 0) return 1200;
  return Math.min(num, 359999); // Max ~100 hours
}

/**
 * Validate time format
 */
export function validateFormat(format) {
  const validFormats = ['H:MM:SS', 'MM:SS', 'SS'];
  return validFormats.includes(format) ? format : 'MM:SS';
}

/**
 * Validate style object
 */
export function validateStyle(style) {
  if (!style || typeof style !== 'object') {
    return getDefaultStyle();
  }

  return {
    color: validateHexColor(style.color, '#ffffff'),
    strokeWidth: validateNumber(style.strokeWidth, 2, 0, 20),
    strokeColor: validateHexColor(style.strokeColor, '#000000'),
    shadowSize: validateNumber(style.shadowSize, 10, 0, 50),
    bgColor: validateHexColor(style.bgColor, '#000000')
  };
}

/**
 * Validate warning settings
 */
export function validateWarning(warn) {
  if (!warn || typeof warn !== 'object') {
    return getDefaultWarning();
  }

  return {
    enabled: Boolean(warn.enabled),
    seconds: validateNumber(warn.seconds, 120, 0, 359999),
    colorEnabled: Boolean(warn.colorEnabled),
    color: validateHexColor(warn.color, '#E64A19'),
    flashEnabled: Boolean(warn.flashEnabled),
    flashRateMs: validateNumber(warn.flashRateMs, 500, 100, 2000),
    soundEnabled: Boolean(warn.soundEnabled)
  };
}

/**
 * Validate sound settings
 */
export function validateSound(sound) {
  if (!sound || typeof sound !== 'object') {
    return getDefaultSound();
  }

  return {
    endEnabled: Boolean(sound.endEnabled),
    volume: validateNumber(sound.volume, 0.7, 0, 1)
  };
}

// Helper validators

function validateString(value, defaultValue) {
  return typeof value === 'string' && value.trim() ? value.trim() : defaultValue;
}

function validateNumber(value, defaultValue, min, max) {
  const num = Number(value);
  if (isNaN(num)) return defaultValue;
  return Math.max(min, Math.min(max, num));
}

function validateHexColor(value, defaultValue) {
  if (typeof value !== 'string') return defaultValue;
  const hex = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    // Expand shorthand
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return defaultValue;
}

function validateFontWeight(value) {
  const validWeights = ['400', '500', '600', '700', '800'];
  const str = String(value);
  return validWeights.includes(str) ? str : '600';
}

function validateAlign(value) {
  const validAligns = ['left', 'center', 'right'];
  return validAligns.includes(value) ? value : 'center';
}

function validateBgMode(value) {
  const validModes = ['transparent', 'solid'];
  return validModes.includes(value) ? value : 'transparent';
}

// Default value getters

function getDefaultStyle() {
  return {
    color: '#ffffff',
    strokeWidth: 2,
    strokeColor: '#000000',
    shadowSize: 10,
    bgColor: '#000000'
  };
}

function getDefaultWarning() {
  return {
    enabled: true,
    seconds: 120,
    colorEnabled: true,
    color: '#E64A19',
    flashEnabled: false,
    flashRateMs: 500,
    soundEnabled: false
  };
}

function getDefaultSound() {
  return {
    endEnabled: false,
    volume: 0.7
  };
}

/**
 * Validate preset object
 */
export function validatePreset(preset) {
  if (!preset || typeof preset !== 'object') return null;

  const name = validateString(preset.name, 'Unnamed Preset');
  const config = validateConfig(preset.config);

  if (!config) return null;

  return {
    name,
    config,
    linkedToNext: Boolean(preset.linkedToNext)
  };
}

/**
 * Validate array of presets
 */
export function validatePresets(presets) {
  if (!Array.isArray(presets)) return [];

  return presets
    .map(p => validatePreset(p))
    .filter(p => p !== null);
}

/**
 * Safe JSON parse with validation
 */
export function safeJSONParse(str, validator = null) {
  try {
    const data = JSON.parse(str);
    return validator ? validator(data) : data;
  } catch {
    return null;
  }
}
