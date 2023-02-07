import { IAdapterContext } from '../../contexts/AdapterContext';
import { WebexCallHistoryAdapter } from './WebexCallHistoryAdapter';
import { WebexVoicemailAdapter } from './WebexVoicemailAdapter';

export const WebexSDKAdapter: IAdapterContext = {
  callHistoryAdapter: new WebexCallHistoryAdapter(),
  voicemailAdapter: new WebexVoicemailAdapter(),
};
