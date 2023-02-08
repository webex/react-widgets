import { CallHistoryJSONAdapter } from './CallHistoryJSONAdapter';
import { IAdapterContext } from '../../contexts/AdapterContext';
import { SearchContactsJSONAdapter } from './SearchContactsJSONAdapter';
import { MakeCallJSONAdapter } from './MakeCallJSONAdapter';
import { SpeedDialsJSONAdapter } from './SpeedDialsJSONAdapter';
import { VoicemailJSONAdapter } from './VoicemailJSONAdapter';
export declare class SDKJSONAdapter implements IAdapterContext {
    name: string;
    callHistoryAdapter: CallHistoryJSONAdapter;
    searchContactsAdapter: SearchContactsJSONAdapter;
    makeCallAdapter: MakeCallJSONAdapter;
    speedDialsAdapter: SpeedDialsJSONAdapter;
    voicemailAdapter: VoicemailJSONAdapter;
    constructor(o: any);
}
//# sourceMappingURL=SDKJSONAdapter.d.ts.map