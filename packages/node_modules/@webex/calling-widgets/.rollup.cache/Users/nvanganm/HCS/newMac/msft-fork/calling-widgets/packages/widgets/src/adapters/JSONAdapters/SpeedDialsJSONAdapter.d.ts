import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ISpeedDialRecord, ISpeedDialsAdapter } from '@webex-int/adapter-interfaces';
export interface SpeedDialsJSONAdapterDatasource {
    contacts: ISpeedDialRecord[];
    speedDials: ISpeedDialRecord[];
}
export declare class SpeedDialsJSONAdapter implements ISpeedDialsAdapter {
    datasource: {
        [k: string]: ISpeedDialRecord[];
    };
    observables$: {
        [key: string]: ReplaySubject<ISpeedDialRecord[]>;
    };
    speeddialObservable$: {
        [key: string]: BehaviorSubject<ISpeedDialRecord>;
    };
    constructor(ds?: {});
    add(speedDial: ISpeedDialRecord): void;
    update(speedDial: ISpeedDialRecord): void;
    remove(speedDial: ISpeedDialRecord): void;
    refresh(ID: string): void;
    getAll(ID: string): Observable<ISpeedDialRecord[]>;
    getContacts(ID: string): Observable<ISpeedDialRecord[]>;
    getOne(ID: string): Observable<ISpeedDialRecord>;
}
//# sourceMappingURL=SpeedDialsJSONAdapter.d.ts.map