import { useCallback, useContext, useEffect, useState } from 'react';
import { IWebexVoicemail } from '@webex-int/adapter-interfaces';

import { AdapterContext } from '../contexts/AdapterContext';

/**
 * Custom hook that returns voicemail data for a given user.
 *
 * @returns {object} Returns {callHistory, lastUpdated} values
 */
export default function useVoicemails() {
  const [voicemails, setVoicemails] = useState<IWebexVoicemail[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(true);
  const ctx = useContext(AdapterContext);

  const onError = (error: unknown) => {
    console.error('error', error);
    setLoading(false);
  };

  const onUpdate = useCallback((data: IWebexVoicemail[]) => {
    setLastUpdated(new Date(Date.now()));
    setVoicemails(data);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (ctx?.voicemailAdapter?.refresh) {
      console.log('refreshing function');
      return ctx?.voicemailAdapter?.refresh();
    }
    return Promise.resolve();
  }, [ctx?.voicemailAdapter]);

  const deleteVoicemail = useCallback((voicemailId: string) => {
    ctx.voicemailAdapter?.deleteVoicemail(voicemailId);
  }, []);

  const readVoicemail = useCallback((voicemailId: string) => {
    setVoicemails((prevVoicemails) =>
      prevVoicemails.map((voicemail) => {
        if (voicemail.id === voicemailId) {
          // eslint-disable-next-line no-param-reassign
          voicemail.unread = false;
        }
        return voicemail;
      })
    );
  }, []);

  useEffect(() => {
    const subscription = ctx?.voicemailAdapter
      ?.getAll()
      .subscribe({ next: onUpdate, error: onError });

    return () => {
      subscription?.unsubscribe();
    };
  }, [ctx?.voicemailAdapter, onUpdate]);

  return {
    lastUpdated,
    voicemails,
    refresh,
    loading,
    deleteVoicemail,
    readVoicemail,
  } as const;
}
