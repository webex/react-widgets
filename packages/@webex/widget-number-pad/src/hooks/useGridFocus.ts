import React, { useCallback, useEffect, useState } from 'react';
import { useKeyboard } from '@react-aria/interactions';

export const useGridFocus = <T extends HTMLElement>(
  childrenRef: React.MutableRefObject<T[]>
) => {
  const [focused, setFocused] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (focused !== undefined && childrenRef?.current[focused]) {
      childrenRef.current[focused].focus();
    }
  }, [focused, childrenRef]);

  const updateFocusedState = useCallback(
    (prevState: number | undefined, offset: number) => {
      if (prevState === undefined) {
        return undefined;
      }
      return (
        (childrenRef.current.length + prevState + offset) %
        childrenRef.current.length
      );
    },
    [childrenRef]
  );

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocused((prevState) => updateFocusedState(prevState, -3));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocused((prevState) => updateFocusedState(prevState, -1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocused((prevState) => updateFocusedState(prevState, 3));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocused((prevState) => updateFocusedState(prevState, 1));
          break;
        default:
          break;
      }
    },
  });

  return { focused, setFocused, keyboardProps };
};
