import { Observable } from 'rxjs';

export interface IWebexVoicemail {
  id: string;
  name: string;
  address: string;
  unread: boolean;
  date: string;
  audioSrc: string;
  duration: number;
}

export enum RESPONSE_STATUS {
  STATUSCODE = 200,
  SUCCESS = 'SUCCESS',
}

export enum VOICEMAIL_LIMIT {
  OFFSET = 0,
  OFFSET_LIMIT = 25,
}
export interface IDuration {
  $: string;
}

export interface IName {
  $: string;
}

export interface IUserId {
  $: string;
}

export interface IAddress {
  $: string;
}

export interface ICallingPartyInfo {
  name: IName;
  userId: IUserId;
  address: IAddress;
}

export interface ITime {
  $: string;
}

export interface IMessageId {
  $: string;
}

export interface IVoiceMailList {
  duration: IDuration;
  callingPartyInfo: ICallingPartyInfo;
  time: ITime;
  messageId: IMessageId;
  read: string;
}

export interface IVoiceMailData {
  voicemailList: IVoiceMailList[];
}

export interface IVoiceMailResponse {
  statusCode: number;
  data: IVoiceMailData;
  message: string;
}

export interface IVoiceMailDeleteData {}

export interface IVoiceMailDeleteResponse {
  statusCode: number;
  data: IVoiceMailDeleteData;
  message: string;
}

export interface IVoicemailAdapter {
  refresh(): void;

  getAll(): Observable<IWebexVoicemail[]>;

  deleteVoicemail(ID: string): void;

  markVoicemailRead(ID: string): void;
}
