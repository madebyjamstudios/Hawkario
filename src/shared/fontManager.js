/**
 * Font Manager - Bundled fonts for timer display
 * All fonts are bundled locally for offline use
 */

// Curated timer fonts bundled locally
export const BUILT_IN_FONTS = [
  { family: 'Inter', weights: [400, 600, 700], description: 'Modern & Clean' },
  { family: 'Roboto', weights: [400, 700], description: 'Versatile' },
  { family: 'JetBrains Mono', weights: [400, 600], description: 'Monospace' },
  { family: 'Oswald', weights: [400, 700], description: 'Bold Condensed' },
  { family: 'Bebas Neue', weights: [400], description: 'Classic Display' },
  { family: 'Orbitron', weights: [400, 700], description: 'Futuristic' },
  { family: 'Teko', weights: [400, 600], description: 'Modern Condensed' },
  { family: 'Share Tech Mono', weights: [400], description: 'Digital' }
];

// Weight labels for UI display
export const WEIGHT_LABELS = {
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black'
};

/**
 * Get available weights for a font family
 * @param {string} family - Font family name
 * @returns {Array<number>} Available weights
 */
export function getAvailableWeights(family) {
  const font = BUILT_IN_FONTS.find(f => f.family === family);
  return font ? font.weights : [400, 700];
}

/**
 * Check if a font family is a built-in font
 * @param {string} family - Font family name
 * @returns {boolean}
 */
export function isBuiltInFont(family) {
  return BUILT_IN_FONTS.some(f => f.family === family);
}

/**
 * Get font description for UI display
 * @param {string} family - Font family name
 * @returns {string} Font description
 */
export function getFontDescription(family) {
  const font = BUILT_IN_FONTS.find(f => f.family === family);
  return font ? font.description : '';
}

/**
 * Verify that all bundled fonts loaded successfully
 * Uses FontFace API to check each font family and weight
 * @returns {Promise<{success: boolean, loaded: Array, failed: Array}>}
 */
export async function verifyFonts() {
  await document.fonts.ready;

  const loaded = [];
  const failed = [];

  for (const font of BUILT_IN_FONTS) {
    for (const weight of font.weights) {
      const fontSpec = `${weight} 12px "${font.family}"`;
      const isLoaded = document.fonts.check(fontSpec);

      if (isLoaded) {
        loaded.push({ family: font.family, weight });
      } else {
        failed.push({ family: font.family, weight });
      }
    }
  }

  // Log results
  const allSuccess = failed.length === 0;
  console.group('[FontManager] Font Verification');
  console.log(`Status: ${allSuccess ? 'All fonts loaded' : 'Some fonts failed'}`);
  console.log(`Loaded: ${loaded.length}/${loaded.length + failed.length}`);

  if (failed.length > 0) {
    console.warn('Failed fonts:', failed.map(f => `${f.family} ${f.weight}`).join(', '));
    console.log('Fallback: System fonts will be used');
  }
  console.groupEnd();

  return { success: allSuccess, loaded, failed };
}
