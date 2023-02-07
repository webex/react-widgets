import React from 'react';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
import './SpeedDialItem.styles.scss';
import { ISpeedDialItem } from './SpeedDials.types';
export interface ISpeedDialProps {
    id: string;
    /** The audio call for speed dial for the item */
    isAudio?: boolean;
    /** The avatar image for the item */
    item: ISpeedDialItem;
    /** The index for reference */
    itemIndex?: number;
    /** Triggered when speed dial item is pressed */
    onPress?: (item: ISpeedDialRecord) => void;
    /** Triggered when audio call action is pressed */
    onAudioCallPress?: (item: ISpeedDialRecord) => void;
    /** Triggered when video call action is pressed */
    onVideoCallPress?: (item: ISpeedDialRecord) => void;
    /** Triggered when remove action is pressed */
    onRemovePress?: (id: string) => void;
    /** Triggered when edit action is pressed */
    onEditPress?: (item: ISpeedDialRecord) => void;
    children?: React.ReactNode;
}
/**
 * Speed Dial Item component renders individual entries.
 *
 * @param {ISpeedDialProps} obj The props for the component
 * @param {number} obj.itemIndex The index of the speed dial
 * @param {Function} obj.onVideoCallPress Handle when item video call button is pressed
 * @param {Function} obj.onAudioCallPress Handle when item audio call button is pressed
 * @param {Function} obj.onRemovePress Triggered when remove action is pressed
 * @param {Function} obj.onEditPress Triggered when edit action is pressed
 * @param {React.ReactNode} obj.children Drag handle component
 * @returns {React.Component} A CallHistoryItem for rendering
 */
export declare const SpeedDialItem: ({ id, item, isAudio, itemIndex, onPress, onAudioCallPress, onVideoCallPress, onEditPress, onRemovePress, children, }: ISpeedDialProps) => JSX.Element;
//# sourceMappingURL=SpeedDialItem.d.ts.map