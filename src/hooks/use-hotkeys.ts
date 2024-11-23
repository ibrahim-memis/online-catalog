import { useEffect } from 'react';
import tinykeys from 'tinykeys';

export function useHotkeys(keymap: { [key: string]: (e: KeyboardEvent) => void }) {
  useEffect(() => {
    const unsubscribe = tinykeys(window, keymap);
    return () => {
      unsubscribe();
    };
  }, [keymap]);
}