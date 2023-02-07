import { ICallHistoryAdapter } from './ICallHistoryAdapter';
import { ISearchContactsAdapter } from './ISearchContactsAdapter';

export abstract class IAdapterAggregator {
  callHistoryAdapter?: ICallHistoryAdapter;

  speedDialsAdapter?: unknown;

  searchContactsAdapter?: ISearchContactsAdapter;
}
