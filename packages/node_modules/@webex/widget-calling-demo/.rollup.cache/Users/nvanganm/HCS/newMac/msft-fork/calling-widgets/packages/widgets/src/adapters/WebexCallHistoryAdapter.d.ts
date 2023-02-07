import { Observable, ReplaySubject } from 'rxjs';
import { ICallHistoryAdapter, ICallHistoryRecord, IWebexCallHistoryResponse } from '@webex-int/adapter-interfaces';
/**
 * @description MS Teams Call History adapter handles making calls to backend
 * and formatting it for display on the client.
 */
export declare class WebexCallHistoryAdapter implements ICallHistoryAdapter {
    observables$: {
        [key: string]: ReplaySubject<ICallHistoryRecord[]>;
    };
    parseServerResponse(response: IWebexCallHistoryResponse): ICallHistoryRecord[];
    /**
     * I handle updating the subscribed observable.
     * @param {string} ID The ID for the getAll method which updates the observable with new data.
     */
    refresh(ID: string): void;
    getAll(ID: string): Observable<ICallHistoryRecord[]>;
}
//# sourceMappingURL=WebexCallHistoryAdapter.d.ts.map