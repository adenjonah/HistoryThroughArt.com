import { useState, useEffect, useCallback } from 'react';

// Storage keys for transcript preferences
const STORAGE_KEYS = {
  fontSize: 'transcript_fontSize',
  autoScroll: 'transcript_autoScroll',
  highlightActive: 'transcript_highlightActive',
  highContrast: 'transcript_highContrast',
};

// Default preferences
const DEFAULT_PREFS = {
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  autoScroll: true,
  highlightActive: true,
  highContrast: false,
};

/**
 * Load saved preferences from localStorage
 * Falls back to defaults for missing/invalid values
 */
const loadPreferences = () => {
  try {
    const fontSize = localStorage.getItem(STORAGE_KEYS.fontSize);
    const autoScroll = localStorage.getItem(STORAGE_KEYS.autoScroll);
    const highlightActive = localStorage.getItem(STORAGE_KEYS.highlightActive);
    const highContrast = localStorage.getItem(STORAGE_KEYS.highContrast);

    return {
      fontSize: ['small', 'medium', 'large'].includes(fontSize)
        ? fontSize
        : DEFAULT_PREFS.fontSize,
      autoScroll: autoScroll !== null
        ? JSON.parse(autoScroll)
        : DEFAULT_PREFS.autoScroll,
      highlightActive: highlightActive !== null
        ? JSON.parse(highlightActive)
        : DEFAULT_PREFS.highlightActive,
      highContrast: highContrast !== null
        ? JSON.parse(highContrast)
        : DEFAULT_PREFS.highContrast,
    };
  } catch (error) {
    console.error('Error loading transcript preferences:', error);
    return DEFAULT_PREFS;
  }
};

/**
 * Hook for managing transcript display preferences with localStorage persistence
 * @returns {{ prefs: object, updatePref: (key: string, value: any) => void }}
 */
export function useTranscriptPreferences() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Load saved preferences on mount
  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  // Update a single preference and persist to localStorage
  const updatePref = useCallback((key, value) => {
    if (!STORAGE_KEYS[key]) {
      console.warn(`Unknown transcript preference key: ${key}`);
      return;
    }

    try {
      // Persist to localStorage
      const storageValue = typeof value === 'boolean'
        ? JSON.stringify(value)
        : value;
      localStorage.setItem(STORAGE_KEYS[key], storageValue);

      // Update state
      setPrefs((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error saving transcript preference:', error);
    }
  }, []);

  return { prefs, updatePref };
}
