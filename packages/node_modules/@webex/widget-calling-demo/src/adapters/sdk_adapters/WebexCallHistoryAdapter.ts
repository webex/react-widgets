import { Observable, from, ReplaySubject } from 'rxjs';
import {
  DirectionTypes,
  DispositionTypes,
  ICallHistoryAdapter,
  ICallHistoryRecord,
  IWebexCallHistoryResponse,
} from '@webex-int/adapter-interfaces';
import { listRecentCallEvents } from '../../services/WebexCallHistoryService';

/**
 * @description MS Teams Call History adapter handles making calls to backend
 * and formatting it for display on the client.
 */
export class WebexCallHistoryAdapter implements ICallHistoryAdapter {
  observables$: { [key: string]: ReplaySubject<ICallHistoryRecord[]> } = {};

  parseServerResponse(
    response: IWebexCallHistoryResponse
  ): ICallHistoryRecord[] {
    let output: ICallHistoryRecord[] = [];

    output = response?.data?.userSessions?.map((value) => {
      const { id, direction, disposition, startTime, endTime, sessionType } =
        value;
      const record: ICallHistoryRecord = {
        id,
        direction: direction as DirectionTypes,
        disposition: disposition as DispositionTypes,
        startTime,
        endTime,
        sessionType,
        callbackAddress: value.self?.callbackInfo?.callbackAddress,
        name: value.other?.name ? value.other?.name : value.other?.phoneNumber,
      };
      return record;
    });
    return output;
  }

  /**
   * I handle updating the subscribed observable.
   * @param {string} ID The ID for the getAll method which updates the observable with new data.
   */
  refresh(ID: string) {
    const data$ = from(listRecentCallEvents());
    data$.subscribe((data) => {
      if (data) {
        this.observables$[ID].next(this.parseServerResponse(data));
        // this.observables$[ID].complete();
      } else {
        this.observables$[ID].error(
          new Error(`Could not find call history for ID "${ID}"`)
        );
      }
    });
  }

  getAll(ID: string): Observable<ICallHistoryRecord[]> {
    if (!(ID in this.observables$)) {
      this.observables$[ID] = new ReplaySubject<ICallHistoryRecord[]>();
      this.refresh(ID);
    }
    return this.observables$[ID];
  }
}
