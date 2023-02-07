import {
  ICallHistoryAdapter,
  IMakeCallAdapter,
  ISearchContactsAdapter,
  ISpeedDialsAdapter,
  IVoicemailAdapter,
} from '@webex-int/adapter-interfaces';
import React, { createContext } from 'react';

export interface IAdapterContext {
  user?: unknown;
  callHistoryAdapter?: ICallHistoryAdapter;
  searchContactsAdapter?: ISearchContactsAdapter;
  makeCallAdapter?: IMakeCallAdapter;
  speedDialsAdapter?: ISpeedDialsAdapter;
  voicemailAdapter?: IVoicemailAdapter;
}

export const AdapterContext = createContext<IAdapterContext>({});

export interface IAdapterProvider {
  adapter: IAdapterContext;
  children: React.ReactNode;
}

/**
 *
 * @param root0
 * @param root0.adapter
 * @param root0.children
 */
export const AdapterProvider = ({ adapter, children }: IAdapterProvider) => {
  return (
    <AdapterContext.Provider value={adapter}>
      {children}
    </AdapterContext.Provider>
  );
};
