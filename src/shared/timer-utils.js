/**
 * Ninja Timer - Timer Utilities
 * Shared time parsing and formatting functions
 */

// ============ HH:MM:SS Duration Utilities ============

/**
 * Format time values to HH:MM:SS or HHH:MM:SS string
 * @param {number} h - Hours (0-999)
 * @param {number} m - Minutes (0-59)
 * @param {number} s - Seconds (0-59)
 * @returns {string} Formatted time string
 */
export function formatTimeValue(h, m, s) {
  const hh = Math.min(999, Math.max(0, h));
  const mm = Math.min(59, Math.max(0, m));
  const ss = Math.min(59, Math.max(0, s));
  // Pad hours to 2 digits minimum, but allow 3 for 100+ hours
  const hhStr = hh >= 100 ? String(hh) : String(hh).padStart(2, '0');
  return `${hhStr}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/**
 * Parse HH:MM:SS string to time values
 * @param {string} val - Time string in HH:MM:SS format
 * @returns {{ h: number, m: number, s: number }} Parsed time values
 */
export function parseTimeValue(val) {
  const parts = (val || '00:00:00').split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const s = parseInt(parts[2], 10) || 0;
  return { h, m, s };
}

/**
 * Smart parse informal duration strings
 * Supports: "530" -> 5:30, "90" -> 1:30, "13000" -> 1:30:00, "5:30" -> 5:30, etc.
 * @param {string} val - Duration string in various formats
 * @returns {{ h: number, m: number, s: number } | null} Parsed time or null if not parseable
 */
export function parseSmartDuration(val) {
  if (!val) return null;
  const str = val.trim();

  // Already formatted as HH:MM:SS or H:MM:SS
  if (/^\d{1,3}:\d{1,2}:\d{1,2}$/.test(str)) {
    const parts = str.split(':');
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const ss = parseInt(parts[2], 10);
    // Validate and normalize (e.g., 1:99:99 -> 2:40:39)
    const totalSec = Math.min(hh * 3600 + mm * 60 + ss, 999 * 3600 + 59 * 60 + 59);
    return { h: Math.floor(totalSec / 3600), m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60 };
  }

  // Formatted as MM:SS or M:SS
  if (/^\d{1,2}:\d{1,2}$/.test(str)) {
    const parts = str.split(':');
    const mm = parseInt(parts[0], 10);
    const ss = parseInt(parts[1], 10);
    // Validate and normalize (e.g., 99:99 -> 1:40:39)
    const totalSec = Math.min(mm * 60 + ss, 999 * 3600 + 59 * 60 + 59);
    return { h: Math.floor(totalSec / 3600), m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60 };
  }

  // Just digits - smart parse based on length
  // Cap at 999:59:59 to prevent unreasonable values
  const MAX_SECONDS = 999 * 3600 + 59 * 60 + 59;
  if (/^\d+$/.test(str)) {
    const num = str;
    if (num.length <= 2) {
      // 1-2 digits: treat as seconds (e.g., "30" -> 0:00:30)
      const totalSec = Math.min(parseInt(num, 10), MAX_SECONDS);
      return { h: Math.floor(totalSec / 3600), m: Math.floor((totalSec % 3600) / 60), s: totalSec % 60 };
    } else if (num.length <= 4) {
      // 3-4 digits: treat as MMSS (e.g., "530" -> 0:05:30, "1230" -> 0:12:30)
      const ss = parseInt(num.slice(-2), 10);
      const mm = parseInt(num.slice(0, -2), 10);
      // Handle overflow (e.g., "90" as seconds)
      const totalSec = Math.min(mm * 60 + ss, MAX_SECONDS);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return { h, m, s };
    } else {
      // 5-6 digits: treat as HHMMSS (e.g., "13000" -> 1:30:00, "123456" -> 12:34:56)
      const ss = parseInt(num.slice(-2), 10);
      const mm = parseInt(num.slice(-4, -2), 10);
      const hh = parseInt(num.slice(0, -4), 10) || 0;
      // Validate and convert to total seconds to handle overflow (e.g., 99 seconds -> 1:39)
      const totalSec = Math.min(hh * 3600 + mm * 60 + ss, MAX_SECONDS);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return { h, m, s };
    }
  }

  return null;
}

/**
 * Convert HH:MM:SS string to total seconds
 * @param {string} val - Time string
 * @returns {number} Total seconds
 */
export function timeValueToSeconds(val) {
  const { h, m, s } = parseTimeValue(val);
  return h * 3600 + m * 60 + s;
}

/**
 * Convert total seconds to HH:MM:SS string
 * @param {number} totalSeconds - Total seconds
 * @returns {string} Formatted time string
 */
export function secondsToTimeValue(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return formatTimeValue(h, m, s);
}

// ============ MM:SS Warning Time Utilities ============

/**
 * Format warning time to MM:SS string
 * @param {number} m - Minutes (0-99)
 * @param {number} s - Seconds (0-59)
 * @returns {string} Formatted MM:SS string
 */
export function formatMSValue(m, s) {
  const pad = n => String(Math.max(0, n)).padStart(2, '0');
  const mm = Math.min(99, Math.max(0, m));
  const ss = Math.min(59, Math.max(0, s));
  return `${pad(mm)}:${pad(ss)}`;
}

/**
 * Parse MM:SS string to time values
 * @param {string} val - Time string in MM:SS format
 * @returns {{ m: number, s: number }} Parsed time values
 */
export function parseMSValue(val) {
  const parts = (val || '00:00').split(':');
  const m = parseInt(parts[0], 10) || 0;
  const s = parseInt(parts[1], 10) || 0;
  return { m, s };
}

/**
 * Convert MM:SS string to total seconds
 * @param {string} val - Time string in MM:SS format
 * @returns {number} Total seconds
 */
export function msValueToSeconds(val) {
  const { m, s } = parseMSValue(val);
  return m * 60 + s;
}

/**
 * Convert total seconds to MM:SS string
 * @param {number} totalSeconds - Total seconds
 * @returns {string} Formatted MM:SS string
 */
export function secondsToMSValue(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return formatMSValue(m, s);
}

// ============ Time Input Initialization ============

/**
 * Initialize a unified HH:MM:SS time input with section-based navigation
 * Sections: HH (0-1), MM (3-4), SS (6-7), colons at 2 and 5
 * @param {HTMLInputElement} input - The input element to initialize
 */
export function initTimeInput(input) {
  if (!input) return;

  // Get section from cursor position
  const getSection = (pos) => {
    if (pos <= 2) return 'hours';
    if (pos <= 5) return 'minutes';
    return 'seconds';
  };

  // Get section digit boundaries (start inclusive, end exclusive for selection)
  const getSectionRange = (section) => {
    switch (section) {
      case 'hours': return [0, 2];
      case 'minutes': return [3, 5];
      case 'seconds': return [6, 8];
    }
  };

  // Handle click - adjust cursor if on colon
  input.addEventListener('click', () => {
    setTimeout(() => {
      const pos = input.selectionStart;
      if (pos === 2 || pos === 5) {
        input.setSelectionRange(pos + 1, pos + 1);
      }
    }, 0);
  });

  // Handle keyboard navigation and input
  input.addEventListener('keydown', (e) => {
    const pos = input.selectionStart;
    const selEnd = input.selectionEnd;
    const section = getSection(pos);
    const [start, end] = getSectionRange(section);
    const val = input.value;

    // Arrow keys
    if (e.key === 'ArrowLeft') {
      if (pos <= start) {
        // At left edge of section
        if (section === 'minutes') {
          e.preventDefault();
          input.setSelectionRange(2, 2); // Jump to end of hours
        } else if (section === 'seconds') {
          e.preventDefault();
          input.setSelectionRange(5, 5); // Jump to end of minutes
        } else {
          // hours section: wall
          e.preventDefault();
        }
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      if (pos >= end) {
        // At right edge of section
        if (section === 'hours') {
          e.preventDefault();
          input.setSelectionRange(3, 3); // Jump to start of minutes
        } else if (section === 'minutes') {
          e.preventDefault();
          input.setSelectionRange(6, 6); // Jump to start of seconds
        } else {
          // seconds section: wall
          e.preventDefault();
        }
      }
      return;
    }

    // Tab - allow natural behavior
    if (e.key === 'Tab') return;

    // Cmd/Ctrl+A - select current section only
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      input.setSelectionRange(start, end);
      return;
    }

    // Backspace - replace current digit with 0
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (pos > start) {
        const newPos = pos - 1;
        const chars = val.split('');
        chars[newPos] = '0';
        input.value = chars.join('');
        input.setSelectionRange(newPos, newPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Delete - replace current digit with 0
    if (e.key === 'Delete') {
      e.preventDefault();
      if (pos < end) {
        const chars = val.split('');
        chars[pos] = '0';
        input.value = chars.join('');
        input.setSelectionRange(pos, pos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Digit input
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();

      // If selection spans multiple chars, replace the section
      if (selEnd > pos) {
        const chars = val.split('');
        // Clear selected section and put digit at start
        for (let i = start; i < end; i++) {
          chars[i] = '0';
        }
        chars[start] = e.key;
        input.value = chars.join('');
        input.setSelectionRange(start + 1, start + 1);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      // Insert digit at current position
      if (pos < end) {
        const chars = val.split('');
        chars[pos] = e.key;

        // Validate the section value
        const newVal = chars.join('');
        const { h, m, s } = parseTimeValue(newVal);

        // Clamp values and reformat
        input.value = formatTimeValue(h, m, s);

        // Move cursor
        let newPos = pos + 1;
        if (newPos === 2 || newPos === 5) newPos++; // Skip colon
        if (newPos > 7) newPos = 7;
        input.setSelectionRange(newPos, newPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Block all other printable characters
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
    }
  });

  // Handle double-click - select current section only
  input.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const pos = input.selectionStart;
    const section = getSection(pos);
    const [start, end] = getSectionRange(section);
    input.setSelectionRange(start, end);
  });

  // Smart paste - accepts many formats: "530", "5:30", "1:30:00", etc.
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const parsed = parseSmartDuration(text);
    if (parsed) {
      input.value = formatTimeValue(parsed.h, parsed.m, parsed.s);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Smart blur - accepts informal input and normalizes
  input.addEventListener('blur', () => {
    const parsed = parseSmartDuration(input.value);
    if (parsed) {
      input.value = formatTimeValue(parsed.h, parsed.m, parsed.s);
    } else {
      // Fallback to strict parsing
      const { h, m, s } = parseTimeValue(input.value);
      input.value = formatTimeValue(h, m, s);
    }
  });
}

/**
 * Initialize a MM:SS time input with section-based navigation
 * Sections: MM (0-1), SS (3-4), colon at 2
 * @param {HTMLInputElement} input - The input element to initialize
 */
export function initTimeInputMS(input) {
  if (!input) return;

  // Get section from cursor position
  const getSection = (pos) => {
    if (pos <= 2) return 'minutes';
    return 'seconds';
  };

  // Get section digit boundaries
  const getSectionRange = (section) => {
    switch (section) {
      case 'minutes': return [0, 2];
      case 'seconds': return [3, 5];
    }
  };

  // Handle click - adjust cursor if on colon
  input.addEventListener('click', () => {
    setTimeout(() => {
      const pos = input.selectionStart;
      if (pos === 2) {
        input.setSelectionRange(pos + 1, pos + 1);
      }
    }, 0);
  });

  // Handle keyboard navigation and input
  input.addEventListener('keydown', (e) => {
    const pos = input.selectionStart;
    const selEnd = input.selectionEnd;
    const section = getSection(pos);
    const [start, end] = getSectionRange(section);
    const val = input.value;

    // Arrow keys
    if (e.key === 'ArrowLeft') {
      if (pos <= start) {
        if (section === 'seconds') {
          e.preventDefault();
          input.setSelectionRange(2, 2); // Jump to end of minutes
        } else {
          e.preventDefault(); // Wall at minutes
        }
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      if (pos >= end) {
        if (section === 'minutes') {
          e.preventDefault();
          input.setSelectionRange(3, 3); // Jump to start of seconds
        } else {
          e.preventDefault(); // Wall at seconds
        }
      }
      return;
    }

    // Tab - allow natural behavior
    if (e.key === 'Tab') return;

    // Cmd/Ctrl+A - select current section only
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      input.setSelectionRange(start, end);
      return;
    }

    // Backspace - replace current digit with 0
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (pos > start) {
        const newPos = pos - 1;
        const chars = val.split('');
        chars[newPos] = '0';
        input.value = chars.join('');
        input.setSelectionRange(newPos, newPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Delete - replace current digit with 0
    if (e.key === 'Delete') {
      e.preventDefault();
      if (pos < end) {
        const chars = val.split('');
        chars[pos] = '0';
        input.value = chars.join('');
        input.setSelectionRange(pos, pos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Digit input
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();

      // If selection spans multiple chars, replace the section
      if (selEnd > pos) {
        const chars = val.split('');
        for (let i = start; i < end; i++) {
          chars[i] = '0';
        }
        chars[start] = e.key;
        input.value = chars.join('');
        input.setSelectionRange(start + 1, start + 1);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      // Insert digit at current position
      if (pos < end) {
        const chars = val.split('');
        chars[pos] = e.key;

        // Validate and reformat
        const newVal = chars.join('');
        const { m, s } = parseMSValue(newVal);
        input.value = formatMSValue(m, s);

        // Move cursor
        let newPos = pos + 1;
        if (newPos === 2) newPos++; // Skip colon
        if (newPos > 4) newPos = 4;
        input.setSelectionRange(newPos, newPos);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }

    // Block all other printable characters
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
    }
  });

  // Handle double-click - select current section only
  input.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const pos = input.selectionStart;
    const section = getSection(pos);
    const [start, end] = getSectionRange(section);
    input.setSelectionRange(start, end);
  });

  // Prevent invalid paste, try to parse time from paste
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const match = text.match(/(\d{1,2}):(\d{1,2})/);
    if (match) {
      const m = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      input.value = formatMSValue(m, s);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Ensure value is always valid format on blur
  input.addEventListener('blur', () => {
    const { m, s } = parseMSValue(input.value);
    input.value = formatMSValue(m, s);
  });
}
