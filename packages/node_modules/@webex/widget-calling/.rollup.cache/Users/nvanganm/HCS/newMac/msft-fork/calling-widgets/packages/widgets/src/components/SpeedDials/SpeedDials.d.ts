/// <reference types="react" />
import { ISpeedDialsProps } from './SpeedDials.types';
import './SpeedDials.styles.scss';
/**
 * @description This is the Speed Dials component
 * @param {ISpeedDialsProps} obj - An object of props.
 * @param {Array} obj.items An array of speed dial items
 * @param {Function} obj.onSortEnd Function to call when sorting ends.
 * @param {Function} obj.onEditPress Function to call when edit action is pressed.
 * @param {Function} obj.onRemovePress Function to call when remove action is pressed.
 * @param {Function} obj.onVideoCallPress Function to call when video call button pressed.
 * @param {Function} obj.onAudioCallPress Function to call when audio call button pressed.
 * @returns {React.Component} SpeedDials component
 */
export declare const SpeedDials: ({ items, onPress, onAudioCallPress, onVideoCallPress, onEditPress, onRemovePress, onSortEnd: onSortEndCb, }: ISpeedDialsProps) => JSX.Element;
//# sourceMappingURL=SpeedDials.d.ts.map