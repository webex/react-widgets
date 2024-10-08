import { useCallback, useContext } from 'react';
import { AdapterContext } from '../contexts/AdapterContext';

export const useMakeCall = () => {
  const ctx = useContext(AdapterContext);

  const makeCall = useCallback(
    (address: string, isVideo?: boolean) => {
      return makeCrossLaunchCall(address, !!isVideo);
    },
    [makeCrossLaunchCall]
  );

  return [makeCall];
};

export async function makeCrossLaunchCall(address: string, isAudio = false) {
  console.debug(
    `Making ${isAudio ? 'audio' : 'video'} call to address ${address}`
  );
  const url = `webextel://${address}`;
  const callUrl = new URL(url);
  callUrl.searchParams.append('jws', '');
  callUrl.searchParams.append('isAudio', String(!isAudio));
  window.open(callUrl.href);
}
