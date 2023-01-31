import { ICallHistoryAdapter } from './ICallHistoryAdapter';
import { ISearchContactsAdapter } from './ISearchContactsAdapter';
export declare abstract class IAdapterAggregator {
    callHistoryAdapter?: ICallHistoryAdapter;
    speedDialsAdapter?: unknown;
    searchContactsAdapter?: ISearchContactsAdapter;
}
//# sourceMappingURL=IAdapterAggregator.d.ts.map