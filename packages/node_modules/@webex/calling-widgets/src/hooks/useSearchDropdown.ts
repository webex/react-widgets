import { MutableRefObject, useEffect, useState } from 'react';
import { useClickOutside } from './useClickOutside';

/**
 * Handles the state for a searchbar's dropdown.  It will search when the minimum number of characters are entered,
 * then will hide if a user presses 'escape' or clicks outside the region.  Re-typing in the box re-enables the input
 *
 * @param {string} input input string
 * @param {number} minInputLength minimum length of input string to start searching
 * @returns {[MutableRefObject, boolean]} array containing ref to assign to the root node and boolean on whether to show the dropdown
 */
export function useSearchDropdown<T extends HTMLElement>(
  input: string,
  minInputLength: number
): [MutableRefObject<T | null>, boolean] {
  const [isOpen, setIsOpen] = useState(false);
  const [ref] = useClickOutside<T>(() => setIsOpen(false), true);

  useEffect(() => {
    setIsOpen(input.length >= minInputLength && !/\d/.test(input));
  }, [input, minInputLength]);

  return [ref, isOpen];
}
