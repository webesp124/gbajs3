import { useEffect } from 'react';
import { useShortcuts } from './shortcuts.ts';

type ShortcutActions = {
  [key: string]: (isKeyDown?: boolean) => void;
};

const useShortcutListener = (actions: ShortcutActions) => {
  const shortcuts = useShortcuts() as { [key: string]: string };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const action = Object.entries(shortcuts).find(([_, value]) => value.toLowerCase() === key);
      if (action) {
        const actionName = action[0];
        if (actions[actionName]) {
          actions[actionName](true); // Pass `true` to indicate key is down
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const action = Object.entries(shortcuts).find(([_, value]) => value.toLowerCase() === key);
      if (action) {
        const actionName = action[0];
        if (actions[actionName]) {
          actions[actionName](false); // Pass `false` to indicate key is up
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [actions, shortcuts]); // Re-run effect when shortcuts change
};

export default useShortcutListener;