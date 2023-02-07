import { Observable, ReplaySubject } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import {
  ICallHistoryAdapter,
  ICallHistoryRecord,
} from  '@webex-int/adapter-interfaces';
// import {RoomsAdapter} from '@webex/component-adapter-interfaces';
import {
  createCallHistoryItems,
  randomIntFromInterval,
} from '../../test-utils';

/**
 * `CallHistoryJSONAdapter` is an implementation of the `CallHistoryAdapter` interface.
 * This implementation utilizes a JSON object as its source of call history data.
 *
 */
export class CallHistoryJSONAdapter implements ICallHistoryAdapter {
  name = 'callHistoryJSON';

  data = {};

  sdk = {};

  datasource: { [k: string]: unknown } = {};

  observables$: { [key: string]: ReplaySubject<ICallHistoryRecord[]> } = {};

  constructor(ds = {}) {
    this.datasource = ds;
  }

  refresh(ID: string) {
    const data = createCallHistoryItems({
      count: faker.datatype.number({ min: 5, max: 25 }),
    });
    this.observables$[ID].next(data);
  }

  getAll(ID: string): Observable<ICallHistoryRecord[]> {
    if (!(ID in this.observables$)) {
      this.observables$[ID] = new ReplaySubject<ICallHistoryRecord[]>();

      const data = this.datasource[`${ID}-callHistory`];
      if (data) {
        this.observables$[ID].next(data as ICallHistoryRecord[]);
      } else {
        this.observables$[ID].error(
          new Error(`Could not find call history for ID "${ID}"`)
        );
      }
    }
    return this.observables$[ID];
  }

  getOne(ID?: string): Observable<ICallHistoryRecord> {
    return new Observable<ICallHistoryRecord>((observer) => {
      if (ID && this.datasource[ID]) {
        setTimeout(() => {
          observer.next(this.datasource[ID] as ICallHistoryRecord);
          observer.complete();
        }, randomIntFromInterval(50, 300));
      } else {
        observer.error(
          new Error(`Could not find call history item with ID "${ID}"`)
        );
      }
    });
  }
}
