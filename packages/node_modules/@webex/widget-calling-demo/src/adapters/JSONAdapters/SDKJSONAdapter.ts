import { CallHistoryJSONAdapter } from './CallHistoryJSONAdapter';
import { IAdapterContext } from '../../contexts/AdapterContext';
import { SearchContactsJSONAdapter } from './SearchContactsJSONAdapter';
import { MakeCallJSONAdapter } from './MakeCallJSONAdapter';

import { SpeedDialsJSONAdapter } from './SpeedDialsJSONAdapter';

import { VoicemailJSONAdapter } from './VoicemailJSONAdapter';

export class SDKJSONAdapter implements IAdapterContext {
  name = 'SDKJSONAdapter';

  callHistoryAdapter: CallHistoryJSONAdapter;

  searchContactsAdapter: SearchContactsJSONAdapter;

  makeCallAdapter: MakeCallJSONAdapter;

  speedDialsAdapter: SpeedDialsJSONAdapter;

  voicemailAdapter: VoicemailJSONAdapter;

  constructor(o: any) {
    this.callHistoryAdapter = new CallHistoryJSONAdapter(o?.callHistory);
    this.searchContactsAdapter = new SearchContactsJSONAdapter(o?.contacts);
    this.speedDialsAdapter = new SpeedDialsJSONAdapter(o?.speedDials);
    this.makeCallAdapter = new MakeCallJSONAdapter();
    this.voicemailAdapter = new VoicemailJSONAdapter(o?.voicemails);
  }
}
