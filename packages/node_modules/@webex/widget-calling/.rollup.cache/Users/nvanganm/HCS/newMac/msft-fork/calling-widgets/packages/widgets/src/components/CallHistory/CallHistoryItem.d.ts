/// <reference types="react" />
import './CallHistoryItem.styles.scss';
import { ICallHistoryItemProps } from './CallHistoryItem.types';
/**
 * @description CallHistoryItem renders a individual call history item.
 * @param {object} param An object parameter
 * @param {string} param.id The id of the item
 * @param {number} param.itemIndex The index of the item
 * @param {string} param.name The name of the item
 * @param {string} param.startTime The startTime of the item
 * @param {string} param.endTime The endTime of the item
 * @param {string} param.phoneNumber The phone number of the item
 * @param {string} param.disposition The disposition of the item
 * @param {string} param.direction The direction of the item
 * @param {string} param.callbackAddress The address of the item call address
 * @param {string} param.missedCallText The text for the missed call label
 * @param {boolean} param.isSelected The selected state of the item
 * @param {Function} param.onPress Handle when item is pressed
 * @param {Function} param.onVideoCallPress Handle when item video call button is pressed
 * @param param.audioCallLabel
 * @param param.videoCallLabel
 * @param {Function} param.onAudioCallPress Handle when item audio call button is pressed
 * @returns {React.Component} A CallHistoryItem for rendering
 */
export declare const CallHistoryItem: ({ id, name, itemIndex, startTime, endTime, phoneNumber, callbackAddress, onPress, direction, disposition, isSelected, missedCallText, audioCallLabel, videoCallLabel, }: ICallHistoryItemProps) => JSX.Element;
//# sourceMappingURL=CallHistoryItem.d.ts.map