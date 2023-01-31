import { Observable } from 'rxjs';
export interface ISpeedDialRecord {
    /** The id for reference */
    id: string;
    /** The display name */
    displayName: string;
    /** The status to display Online/Offline */
    status?: string;
    /** The number to display */
    number?: string;
    /** The call type (audio/video) */
    callType?: string;
    /** The phone number to display */
    phone?: string;
    /** The phone number type (work,mobile,mail) */
    phoneType?: string;
    /** Callback address to pass to call action */
    currentCallAddress?: string;
    mail?: string;
    mobilePhone?: string;
    businessPhones?: string[];
    surname?: string;
    givenName?: string;
    photo?: string;
}
export interface ISpeedDialsAdapter {
    refresh?(ID?: string): void;
    getAll(ID?: string): Observable<ISpeedDialRecord[]>;
    getOne(ID?: string): Observable<ISpeedDialRecord>;
    getContacts?(query?: string): Observable<ISpeedDialRecord[]>;
    add?(speedDial: ISpeedDialRecord): void;
    update?(speedDial: ISpeedDialRecord): void;
    remove?(speedDial: ISpeedDialRecord): void;
}
//# sourceMappingURL=ISpeedDialsAdapter.d.ts.map