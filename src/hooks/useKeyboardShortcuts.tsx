import { useEffect } from "react";

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField = target.matches('input, textarea, [contenteditable]');
      
      const key = e.key.toLowerCase();
      const isMod = e.metaKey || e.ctrlKey;
      
      // Ctrl/Cmd + K for search
      if (isMod && key === 'k') {
        e.preventDefault();
        handlers.search?.();
        return;
      }
      
      // Don't trigger shortcuts when typing in input fields (except for the above)
      if (isInputField) return;
      
      // Single key shortcuts
      switch (key) {
        case 'n':
          e.preventDefault();
          handlers.create?.();
          break;
        case 's':
          e.preventDefault();
          handlers.study?.();
          break;
        case '/':
          e.preventDefault();
          handlers.focusSearch?.();
          break;
        case '?':
          e.preventDefault();
          handlers.help?.();
          break;
        case 'g':
          e.preventDefault();
          handlers.goals?.();
          break;
        case 'escape':
          handlers.escape?.();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}
