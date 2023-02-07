import { Observable, ReplaySubject } from 'rxjs';
import { ICallHistoryAdapter, ICallHistoryRecord } from '@webex-int/adapter-interfaces';
/**
 * `CallHistoryJSONAdapter` is an implementation of the `CallHistoryAdapter` interface.
 * This implementation utilizes a JSON object as its source of call history data.
 *
 */
export declare class CallHistoryJSONAdapter implements ICallHistoryAdapter {
    name: string;
    data: {};
    sdk: {};
    datasource: {
        [k: string]: unknown;
    };
    observables$: {
        [key: string]: ReplaySubject<ICallHistoryRecord[]>;
    };
    constructor(ds?: {});
    refresh(ID: string): void;
    getAll(ID: string): Observable<ICallHistoryRecord[]>;
    getOne(ID?: string): Observable<ICallHistoryRecord>;
}
//# sourceMappingURL=CallHistoryJSONAdapter.d.ts.map