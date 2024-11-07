import { useEffect, useState } from 'react';

const DEFAULT_SHORTCUTS = {
  fastForward: 'g',
  autoFireA: 'q',
  autoFireB: 'p',
  uploadSave: '',
  quickReload: '',
  quickLoad: '',
  quickSave: ''
};

const SHORTCUTS_KEY = 'custom_shortcuts';

// Load shortcuts from local storage
export const loadShortcuts = () => {
  const savedShortcuts = localStorage.getItem(SHORTCUTS_KEY);
  return savedShortcuts ? JSON.parse(savedShortcuts) : DEFAULT_SHORTCUTS;
};

// Save shortcuts to local storage
export const saveShortcuts = (newShortcuts: Record<string, string>) => {
  localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(newShortcuts));
  // Dispatch an event to notify that shortcuts have changed
  window.dispatchEvent(new CustomEvent('shortcutsUpdated', { detail: newShortcuts }));
};

// Reset to default shortcuts
export const resetShortcuts = () => {
  saveShortcuts(DEFAULT_SHORTCUTS);
};

// Hook to get the shortcuts and update when they change
export const useShortcuts = () => {
  const [shortcuts, setShortcuts] = useState(loadShortcuts());

  useEffect(() => {
    const handleShortcutsUpdate = (event: CustomEvent) => {
      setShortcuts(event.detail);
    };

    window.addEventListener('shortcutsUpdated', handleShortcutsUpdate as EventListener);

    return () => {
      window.removeEventListener('shortcutsUpdated', handleShortcutsUpdate as EventListener);
    };
  }, []);

  return shortcuts;
};