import { useCallback } from 'react';
// import { AdapterContext } from '../contexts/AdapterContext';
import Logger from "../utils/Logger";
export const useMakeCall = (webexCrosslaunchtoken: string) => {
  //const ctx = useContext(AdapterContext);

  const makeCall = useCallback(
    (address: string, isVideo?: boolean) => {
      return makeCrossLaunchCall(address, !!isVideo, webexCrosslaunchtoken);
    },
    [makeCrossLaunchCall]
  );

  return [makeCall];
};


export async function makeCrossLaunchCall(address: string, isAudio = false, webexCrosslaunchtoken: string) {
  address = address.replace(/ /g, "");
  const url = `webextel://${address}`;
  //const crossLaunchCallToken = await getCrossLaunchToken();
  const callUrl = new URL(url);

  // TODO: add check for mobile and if audio calls are enabled
  callUrl.searchParams.append('jws', webexCrosslaunchtoken);
  callUrl.searchParams.append('isAudio', String(!isAudio));
  Logger.info(
    `Making ${isAudio ? 'audio' : 'video'} call to address ${address}`
  );
  window.open(callUrl.href);
}