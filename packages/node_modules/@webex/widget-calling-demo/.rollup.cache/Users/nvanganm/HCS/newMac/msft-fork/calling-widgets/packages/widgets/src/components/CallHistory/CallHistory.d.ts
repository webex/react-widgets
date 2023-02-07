import React from 'react';
import { ICallHistoryItemProps } from './CallHistoryItem.types';
import './CallHistory.styles.scss';
export declare type CallHistoryProps = {
    items: ICallHistoryItemProps[];
    style?: React.CSSProperties;
    onPress?: (item: ICallHistoryItemProps) => void;
    selectedItem?: ICallHistoryItemProps;
    extraCallHistoryItemProps?: ICallHistoryItemProps;
};
/**
 * @description CallHistory component renders an array of call history items.
 * @param {CallHistoryProps} obj - An object of CallHistoryProps
 * @param {Array} obj.items An array of CallHistoryItems
 * @param {Function} obj.onPress Handle when item is pressed
 * @param {ICallHistoryItemProps} obj.selectedItem The selected call history item
 * @param {Function} obj.onAudioCallPress Handle when audio call button is pressed
 * @param {Function} obj.onVideoCallPress Handle when video call button is pressed
 * @param {React.CSSProperties} obj.style Custom style for overriding this component's CSS
 * @returns {React.Component} CallHistory component
 */
export declare const CallHistory: ({ items, style, onPress, selectedItem, extraCallHistoryItemProps, }: CallHistoryProps) => JSX.Element;
//# sourceMappingURL=CallHistory.d.ts.map