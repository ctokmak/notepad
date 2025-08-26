import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Build shortcut string
      const parts = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.shiftKey) parts.push('shift');
      if (event.altKey) parts.push('alt');
      
      const key = event.key.toLowerCase();
      if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
        parts.push(key);
      }
      
      const shortcut = parts.join('+');
      
      // Handle special keys
      const specialKeys = {
        'delete': 'Delete',
        'backspace': 'Backspace',
        'enter': 'Enter',
        'escape': 'Escape',
        'tab': 'Tab',
        ' ': 'Space'
      };
      
      const finalShortcut = specialKeys[key] || shortcut;
      
      // Find and execute matching shortcut
      const handler = shortcuts[finalShortcut];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

export default useKeyboardShortcuts;