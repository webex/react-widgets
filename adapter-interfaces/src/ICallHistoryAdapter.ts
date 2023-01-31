import { Observable } from 'rxjs';

export enum DispositionTypes {
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  INITIATED = 'INITIATED',
}

export enum DirectionTypes {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export type SessionTypes = 'SPARK' | 'BROADWORKS';

export interface ISDKCallHistoryRecord {
  id: string;
  url?: string;
  sessionId?: string;
  sessionType?: SessionTypes;
  startTime?: string;
  endTime?: string;
  durationSecs?: number;
  durationSeconds?: number;
  joinedDurationSeconds?: number;
  participantCount?: number;
  direction: DirectionTypes;
  disposition: DispositionTypes;
  self?: {
    id: string;
    name: string;
    phoneNumber?: string;
    incomingCallProtocols?: unknown[];
  };
  other: {
    id: string;
    name: string;
    phoneNumber?: string;
    isPrivate?: boolean;
    callbackAddress: string;
  };
  links: {
    callbackAddress: string;
    conversationUrl: string;
    locusUrl?: string;
  };
  isSelected?: boolean;
  isDeleted?: boolean;
  isPMR?: boolean;
  correlationIds?: unknown[];
}

export type ICallHistoryRecords = {
  lastUpdated?: string;
  items?: Record<string, ICallHistoryRecord>;
};

export interface ICallHistoryRecord {
  id: string;
  name: string;
  direction?: DirectionTypes;
  disposition?: DispositionTypes;
  startTime?: string;
  endTime?: string;
  sessionType?: string;
  phoneNumber?: string;
  callbackAddress?: string;
  isSelected?: boolean;
}

export interface ICallHistoryAdapter {
  refresh(ID?: string): void;

  getAll(ID?: string): Observable<ICallHistoryRecord[]>;

  getOne?(ID?: string): Observable<ICallHistoryRecord>;
}

export enum SORT {
  ASC = 'ASC',
  DESC = 'DESC',
  DEFAULT = 'DESC',
}

export enum SORT_BY {
  END_TIME = 'endTime',
  DEFAULT = 'endTime',
  START_TIME = 'startTime',
}

export enum DATE {
  WEEK = 7,
  MONTH = 30,
  DEFAULT = 7,
}

export enum LIMIT {
  DEFAULT = 20,
}

export interface ICallbackInfo {
  callbackAddress: string;
  callbackType: string;
}

export interface ISelf {
  id: string;
  name: string;
  incomingCallProtocols: any[];
  callbackInfo: ICallbackInfo;
}

export interface IOther {
  phoneNumber: string;
  id: string;
  name: string;
  isPrivate: boolean;
  callbackAddress: string;
}

export interface ILinks {
  locusUrl: string;
  callbackAddress: string;
}

export interface IUserSession {
  id: string;
  durationSecs: number;
  self: ISelf;
  url: string;
  sessionId: string;
  sessionType: string;
  startTime: string;
  endTime: string;
  direction: string;
  disposition: string;
  other: IOther;
  durationSeconds: number;
  joinedDurationSeconds: number;
  participantCount: number;
  links: ILinks;
  isDeleted: boolean;
  isPMR: boolean;
  correlationIds: string[];
}

export interface IUserSessionData {
  userSessions: IUserSession[];
}

export interface IWebexCallHistoryResponse {
  statusCode: number;
  data: IUserSessionData;
  message: string;
}
