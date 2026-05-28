import { useState, useEffect, useCallback } from 'react';
import { logger } from '../lib/logger';

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
 * Safely read a boolean preference from localStorage.
 * A missing, corrupt, or non-boolean stored value falls back to the
 * provided default without discarding the user's other preferences.
 */
const loadBooleanPref = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const parsed = JSON.parse(stored);
    return typeof parsed === 'boolean' ? parsed : fallback;
  } catch (error) {
    logger.warn(`Invalid stored value for ${key}, using default`, error);
    return fallback;
  }
};

/**
 * Load saved preferences from localStorage
 * Falls back to defaults for missing/invalid values, per-field so one
 * corrupt value cannot reset every other preference.
 */
const loadPreferences = () => {
  try {
    const fontSize = localStorage.getItem(STORAGE_KEYS.fontSize);

    return {
      fontSize: ['small', 'medium', 'large'].includes(fontSize)
        ? fontSize
        : DEFAULT_PREFS.fontSize,
      autoScroll: loadBooleanPref(STORAGE_KEYS.autoScroll, DEFAULT_PREFS.autoScroll),
      highlightActive: loadBooleanPref(STORAGE_KEYS.highlightActive, DEFAULT_PREFS.highlightActive),
      highContrast: loadBooleanPref(STORAGE_KEYS.highContrast, DEFAULT_PREFS.highContrast),
    };
  } catch (error) {
    logger.error('Error loading transcript preferences:', error);
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
      logger.warn(`Unknown transcript preference key: ${key}`);
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
      logger.error('Error saving transcript preference:', error);
    }
  }, []);

  return { prefs, updatePref };
}
