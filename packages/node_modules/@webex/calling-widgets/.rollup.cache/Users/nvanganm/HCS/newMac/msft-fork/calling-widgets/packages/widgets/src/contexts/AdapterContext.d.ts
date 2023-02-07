import { ICallHistoryAdapter, IMakeCallAdapter, ISearchContactsAdapter, ISpeedDialsAdapter, IVoicemailAdapter } from '@webex-int/adapter-interfaces';
import React from 'react';
export interface IAdapterContext {
    user?: unknown;
    callHistoryAdapter?: ICallHistoryAdapter;
    searchContactsAdapter?: ISearchContactsAdapter;
    makeCallAdapter?: IMakeCallAdapter;
    speedDialsAdapter?: ISpeedDialsAdapter;
    voicemailAdapter?: IVoicemailAdapter;
}
export declare const AdapterContext: React.Context<IAdapterContext>;
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
export declare const AdapterProvider: ({ adapter, children }: IAdapterProvider) => JSX.Element;
//# sourceMappingURL=AdapterContext.d.ts.map