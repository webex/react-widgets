import { Observable, ReplaySubject } from 'rxjs';
import { IVoicemailAdapter, IWebexVoicemail } from '@webex-int/adapter-interfaces';
export declare class VoicemailJSONAdapter implements IVoicemailAdapter {
    datasource: IWebexVoicemail[] | undefined;
    observables$: ReplaySubject<IWebexVoicemail[]>;
    constructor(ds?: IWebexVoicemail[] | undefined);
    refresh(): void;
    getAll(): Observable<IWebexVoicemail[]>;
    deleteVoicemail(ID: string): void;
    markVoicemailRead(ID: string): void;
}
//# sourceMappingURL=VoicemailJSONAdapter.d.ts.map