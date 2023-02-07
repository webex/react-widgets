import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

/**
 * Listens for clicks outside the ref element and calls a callback when it occurs.
 * Additionally, has optional parameter on whether to listen for escape presses.
 *
 * @param {Function} onClickOutside callback that is called when an outside click has occurred
 * @param {boolean} includeEscape if callback should be called on escape press
 * @returns {[MutableRefObject]} ref to assign to the node to listen to
 */
export function useClickOutside<T extends HTMLElement>(
  onClickOutside: () => void,
  includeEscape = false
): [MutableRefObject<T | null>] {
  const ref = useRef<T>(null);

  const handleClickOutside = useCallback(
    (event: Event) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }
      onClickOutside();
    },
    [ref, onClickOutside]
  );

  const handleHideDropdown = useCallback(
    (event: KeyboardEvent) => {
      if (includeEscape && event.key === 'Escape') {
        onClickOutside();
      }
    },
    [onClickOutside, includeEscape]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleHideDropdown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleHideDropdown);
    };
  }, [ref, handleClickOutside, handleHideDropdown]);

  return [ref];
}
