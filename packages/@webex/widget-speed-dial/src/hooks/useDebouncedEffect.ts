import { useEffect } from 'react';

export const useDebouncedEffect = (
  debouncedEffect: () => void,
  deps: unknown[],
  delay: number,
  immediateEffect?: () => void
) => {
  useEffect(() => {
    if (immediateEffect) {
      immediateEffect();
    }
    const handler = setTimeout(() => debouncedEffect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};
