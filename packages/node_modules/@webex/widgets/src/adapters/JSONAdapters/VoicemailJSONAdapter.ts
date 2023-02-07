import { Observable, ReplaySubject } from 'rxjs';
import {
  IVoicemailAdapter,
  IWebexVoicemail,
} from '@webex-int/adapter-interfaces';

export class VoicemailJSONAdapter implements IVoicemailAdapter {
  datasource: IWebexVoicemail[] | undefined = [];

  observables$: ReplaySubject<IWebexVoicemail[]>;

  constructor(ds: IWebexVoicemail[] | undefined = undefined) {
    this.datasource = ds;
    this.observables$ = new ReplaySubject<IWebexVoicemail[]>();
  }

  refresh() {
    console.log(`refreshing voicemails`);
    this.observables$.next(this.datasource as IWebexVoicemail[]);
  }

  getAll(): Observable<IWebexVoicemail[]> {
    if (!this.datasource) {
      this.observables$.error(new Error('Could not find voicemails'));
    }
    this.observables$.next(this.datasource as IWebexVoicemail[]);
    return this.observables$;
  }

  deleteVoicemail(ID: string): void {
    console.log(`deleting voicemail with ID: ${ID}`);
  }

  markVoicemailRead(ID: string): void {
    console.log(`marking voicemail as read with ID: ${ID}`);
  }
}
