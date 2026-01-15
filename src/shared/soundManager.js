/**
 * Sound Manager - Built-in sounds and utilities for custom sound support
 */

// Built-in sounds (synthesized via Web Audio API)
export const BUILT_IN_SOUNDS = [
  { value: 'none', label: 'None' },
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'alert', label: 'Alert' },
  { value: 'gong', label: 'Gong' },
  { value: 'soft', label: 'Soft' }
];

/**
 * Check if a sound type is a built-in sound
 * @param {string} soundType - Sound type value
 * @returns {boolean}
 */
export function isBuiltInSound(soundType) {
  return BUILT_IN_SOUNDS.some(s => s.value === soundType);
}

/**
 * Check if a sound type is a custom sound
 * @param {string} soundType - Sound type value
 * @returns {boolean}
 */
export function isCustomSound(soundType) {
  return soundType && soundType.startsWith('custom:');
}

/**
 * Extract custom sound ID from sound type
 * @param {string} soundType - Sound type value (e.g., 'custom:sound-abc123')
 * @returns {string|null} Sound ID or null if not a custom sound
 */
export function getCustomSoundId(soundType) {
  if (!isCustomSound(soundType)) return null;
  return soundType.replace('custom:', '');
}

/**
 * Create a custom sound type from ID
 * @param {string} soundId - Sound ID
 * @returns {string} Sound type (e.g., 'custom:sound-abc123')
 */
export function createCustomSoundType(soundId) {
  return `custom:${soundId}`;
}

/**
 * Generate a unique sound ID
 * @returns {string}
 */
export function generateSoundId() {
  return `sound-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get audio format from file extension
 * @param {string} fileName - Sound file name
 * @returns {string} Audio format (mp3, wav, ogg)
 */
export function getAudioFormat(fileName) {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'mp3': return 'mp3';
    case 'wav': return 'wav';
    case 'ogg': return 'ogg';
    case 'webm': return 'webm';
    case 'm4a': return 'm4a';
    default: return 'mp3';
  }
}

/**
 * Get MIME type for audio format
 * @param {string} format - Audio format
 * @returns {string} MIME type
 */
export function getAudioMimeType(format) {
  switch (format) {
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'ogg': return 'audio/ogg';
    case 'webm': return 'audio/webm';
    case 'm4a': return 'audio/mp4';
    default: return 'audio/mpeg';
  }
}

/**
 * Extract sound name from file name
 * @param {string} fileName - Sound file name
 * @returns {string} Human-readable name
 */
export function extractSoundName(fileName) {
  // Remove extension
  let name = fileName.replace(/\.(mp3|wav|ogg|webm|m4a)$/i, '');

  // Replace separators with spaces and title case
  name = name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return name.trim();
}
