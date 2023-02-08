import React from 'react';
import { ICallHistoryItemProps } from '../components/CallHistory';
import './WebexCallHistory.styles.scss';
export declare type IWebexCallHistoryProps = {
    userID: string;
    noHistoryMessage?: string | undefined;
    style?: React.CSSProperties;
    onPress?: (item: ICallHistoryItemProps) => void;
    extraCallHistoryItemProps?: ICallHistoryItemProps;
};
export interface IWebexCallHistoryHandle {
    refreshCallHistory: () => void;
    getLastUpdated: () => Date | undefined;
}
/**
 * @description The summary of this component.
 * @param {IWebexCallHistoryProps} obj - An object of props.
 * @param {string} obj.userID The ID of the current user
 * @param {string} obj.headerText The label for the header
 * @param {string} obj.noHistoryMessage The message when call history is empty
 * @param {Function} obj.onPress Handle when item is pressed
 * @param {Function} obj.onAudioCallPress Handle when audio call button is pressed
 * @param {Function} obj.onVideoCallPress Handle when video call button is pressed
 * @param {React.CSSProperties} obj.style Custom style for overriding this component's CSS
 * @returns {React.Component} WebexCallHistory component
 */
export declare const WebexCallHistory: React.ForwardRefExoticComponent<IWebexCallHistoryProps & React.RefAttributes<IWebexCallHistoryHandle>>;
//# sourceMappingURL=WebexCallHistory.d.ts.map