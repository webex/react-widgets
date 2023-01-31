// eslint-disable-next-line import/no-extraneous-dependencies
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  ISpeedDialRecord,
  ISpeedDialsAdapter,
} from '@webex-int/adapter-interfaces';

export interface SpeedDialsJSONAdapterDatasource {
  contacts: ISpeedDialRecord[];
  speedDials: ISpeedDialRecord[];
}

const dataSourceMap: Map<string, ISpeedDialRecord> = new Map();

export class SpeedDialsJSONAdapter implements ISpeedDialsAdapter {
  datasource: { [k: string]: ISpeedDialRecord[] } = {};

  observables$: { [key: string]: ReplaySubject<ISpeedDialRecord[]> } = {};

  speeddialObservable$: { [key: string]: BehaviorSubject<ISpeedDialRecord> } =
    {};

  constructor(ds = {}) {
    this.datasource = ds;
  }

  add(speedDial: ISpeedDialRecord) {
    console.log('add', speedDial);
  }

  update(speedDial: ISpeedDialRecord) {
    console.log('update', speedDial);
  }

  remove(speedDial: ISpeedDialRecord) {
    console.log('remove', speedDial);
  }

  refresh(ID: string) {
    console.log('refresh', ID, this);

    const data = this.datasource[`${ID}-speedDials`];
    if (data) {
      data.forEach((item) => {
        dataSourceMap.set(item.id, item);
      });
      this.observables$[ID].next(data as ISpeedDialRecord[]);
    } else {
      this.observables$[ID].error(
        new Error(`Could not find speed dials for ID "${ID}"`)
      );
    }
  }

  getAll(ID: string): Observable<ISpeedDialRecord[]> {
    if (!(ID in this.observables$)) {
      this.observables$[ID] = new ReplaySubject<ISpeedDialRecord[]>();
      this.refresh(ID);
    }
    return this.observables$[ID];
  }

  getContacts(ID: string): Observable<ISpeedDialRecord[]> {
    const cid = `${ID}-contacts`;
    if (!(ID in this.observables$)) {
      this.observables$[cid] = new ReplaySubject<ISpeedDialRecord[]>();

      const data = this.datasource[cid];
      if (data) {
        this.observables$[cid].next(data as ISpeedDialRecord[]);
      } else {
        this.observables$[cid].error(
          new Error(`Could not find contacts for ID "${cid}"`)
        );
      }
    }
    return this.observables$[cid];
  }

  getOne(ID: string): Observable<ISpeedDialRecord> {
    if (!(ID in this.speeddialObservable$)) {
      const data = dataSourceMap.get(ID);
      if (data) {
        this.speeddialObservable$[ID] = new BehaviorSubject<ISpeedDialRecord>(
          data
        );
      }
    }
    return this.speeddialObservable$[ID];
  }
}
