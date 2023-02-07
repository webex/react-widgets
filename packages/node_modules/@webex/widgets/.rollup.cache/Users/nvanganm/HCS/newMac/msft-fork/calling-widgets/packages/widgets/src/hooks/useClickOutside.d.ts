import { MutableRefObject } from 'react';
/**
 * Listens for clicks outside the ref element and calls a callback when it occurs.
 * Additionally, has optional parameter on whether to listen for escape presses.
 *
 * @param {Function} onClickOutside callback that is called when an outside click has occurred
 * @param {boolean} includeEscape if callback should be called on escape press
 * @returns {[MutableRefObject]} ref to assign to the node to listen to
 */
export declare function useClickOutside<T extends HTMLElement>(onClickOutside: () => void, includeEscape?: boolean): [MutableRefObject<T | null>];
//# sourceMappingURL=useClickOutside.d.ts.map