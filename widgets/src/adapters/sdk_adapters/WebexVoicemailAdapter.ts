import { Observable, from, ReplaySubject, of } from 'rxjs';
import {
  IVoicemailAdapter,
  IWebexVoicemail,
  IVoiceMailResponse,
  RESPONSE_STATUS,
} from '@webex-int/adapter-interfaces';
import { voicemails } from '../data/demoData';
import {
  getVoiceMailList,
  deleteVoiceMail,
} from '../../services/WebexVoicemailService';
import { Logger } from '@webex-int/logger';

export class WebexVoicemailAdapter implements IVoicemailAdapter {
  observables$!: ReplaySubject<IWebexVoicemail[]>;

  parseVoicemailData(response: IVoiceMailResponse): IWebexVoicemail[] {
    let output: IWebexVoicemail[] = [];
    output = response?.data?.voicemailList?.map((item) => {
      const voiceMailResponseData: IWebexVoicemail = {
        id: item.messageId.$,
        name: item.callingPartyInfo.name.$,
        address: item?.callingPartyInfo?.address.$,
        date: new Date(Number(item.time.$)).toISOString(),
        unread: item?.read ? false : true,
        audioSrc: voicemails[0].audioSrc,
        duration: Number(item.duration.$),
      };
      return voiceMailResponseData;
    });
    return output;
  }

  refresh() {
    const data$ = from(getVoiceMailList());
    data$.subscribe((data: IVoiceMailResponse) => {
      if (data.statusCode === RESPONSE_STATUS.STATUSCODE) {
        this.observables$.next(this.parseVoicemailData(data));
      } else {
        this.observables$.error(new Error(`Could not find voice mail data"`));
      }
    });
  }

  getAll(): Observable<IWebexVoicemail[]> {
    if (!this.observables$) {
      this.observables$ = new ReplaySubject<IWebexVoicemail[]>();
      this.refresh();
    }
    return this.observables$;
  }

  deleteVoicemail(ID: string) {
    const data$ = from(deleteVoiceMail(ID));
    data$.subscribe((data) => {
      if (data.message === RESPONSE_STATUS.SUCCESS) {
        this.refresh();
      } else {
        this.observables$.error(new Error(`Could not delete voice mial"`));
      }
    });
  }

  markVoicemailRead(ID: string): void {
    Logger.info(`WebexVoicemailAdapter:markVoicemailRead(): done.`);
  }
}
