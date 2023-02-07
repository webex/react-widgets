import { useCallback, useContext } from 'react';
import { AdapterContext } from '../contexts/AdapterContext';

export const useMakeCall = () => {
  const ctx = useContext(AdapterContext);

  const makeCall = useCallback(
    (address: string, isVideo?: boolean) => {
      return ctx?.makeCallAdapter?.makeCall(address, !!isVideo);
    },
    [ctx?.makeCallAdapter?.makeCall]
  );

  return [makeCall];
};
