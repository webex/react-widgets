import { useCallback, useContext, useEffect, useState } from 'react';
import { ICallHistoryRecord } from '@webex-int/adapter-interfaces';

import { AdapterContext } from '../contexts/AdapterContext';

/**
 * Custom hook that returns call history data of the given ID.
 *
 * @param {string} userID  ID for user which to return data.
 * @returns {object} Returns {callHistory, lastUpdated} values
 */
export default function useCallHistory(userID?: string) {
  const [callHistory, setCallHistory] = useState<ICallHistoryRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(true);
  const ctx = useContext(AdapterContext);

  const onError = (error: unknown) => {
    console.error('error', error);
    setLoading(false);
  };

  const onUpdate = useCallback((data: ICallHistoryRecord[]) => {
    setLastUpdated(new Date(Date.now()));
    setCallHistory(data);
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    if (ctx?.callHistoryAdapter?.refresh) {
      ctx?.callHistoryAdapter?.refresh(userID);
    }
  }, [userID, ctx?.callHistoryAdapter]);

  useEffect(() => {
    const subscription = ctx?.callHistoryAdapter
      ?.getAll(userID)
      .subscribe({ next: onUpdate, error: onError });

    return () => {
      subscription?.unsubscribe();
    };
  }, [ctx?.callHistoryAdapter, onUpdate, userID]);

  return {
    lastUpdated,
    callHistory,
    refresh,
    loading,
  } as const;
}
