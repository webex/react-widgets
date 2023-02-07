import { Observable, ReplaySubject } from 'rxjs';
import { IVoicemailAdapter, IWebexVoicemail, IVoiceMailResponse } from '@webex-int/adapter-interfaces';
export declare class WebexVoicemailAdapter implements IVoicemailAdapter {
    observables$: ReplaySubject<IWebexVoicemail[]>;
    parseVoicemailData(response: IVoiceMailResponse): IWebexVoicemail[];
    refresh(): void;
    getAll(): Observable<IWebexVoicemail[]>;
    deleteVoicemail(ID: string): void;
    markVoicemailRead(ID: string): void;
}
//# sourceMappingURL=WebexVoicemailAdapter.d.ts.map