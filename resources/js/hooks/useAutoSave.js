import { useEffect, useRef, useCallback } from 'react';
import { CONSTANTS } from '../constants';

export function useAutoSave(data, saveFunction, delay = CONSTANTS.AUTO_SAVE_DELAY) {
  const timeoutRef = useRef();
  const isFirstRender = useRef(true);
  const lastSavedData = useRef(data);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const hasChanged = JSON.stringify(data) !== JSON.stringify(lastSavedData.current);
      
      if (hasChanged && !isFirstRender.current) {
        saveFunction(data);
        lastSavedData.current = data;
      }
    }, delay);
  }, [data, saveFunction, delay]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    debouncedSave();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const hasChanged = JSON.stringify(data) !== JSON.stringify(lastSavedData.current);
    if (hasChanged) {
      saveFunction(data);
      lastSavedData.current = data;
    }
  }, [data, saveFunction]);

  return { saveNow };
}

export default useAutoSave;