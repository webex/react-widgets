import React from 'react';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
import './WebexSpeedDials.styles.scss';
import { ISpeedDialEvents } from '../components/SpeedDials/SpeedDials.types';
export interface IWebexSpeedDialsProps extends ISpeedDialEvents {
    userID: string;
    contacts?: ISpeedDialRecord[];
    onSortEnd?: (items?: ISpeedDialRecord[]) => void;
}
export interface IWebexSpeedDialsHandle {
    refreshSpeedDials?: () => void;
    showAddSpeedDial: () => void;
}
/**
 * @description The summary of this component.
 * @param {IWebexSpeedDialsProps} param An object of IWebexSpeedDialsProps
 * @param {string} param.userID The current user ID
 * @param {Function} param.onPress Handler to call speed dial item is pressed.
 * @param {Function} param.onSortEnd Handler to call when sorting ends
 * @param {Function} param.onEditPress Function to call when edit action is pressed.
 * @param {Function} param.onRemovePress Function to call when remove action is pressed.
 * @param {Function} param.onVideoCallPress Function to call when video call button pressed.
 * @param {Function} param.onAudioCallPress Function to call when audio call button pressed.
 * @returns {React.Component} WebexSpeedDials component
 */
export declare const WebexSpeedDials: React.ForwardRefExoticComponent<IWebexSpeedDialsProps & React.RefAttributes<IWebexSpeedDialsHandle>>;
//# sourceMappingURL=WebexSpeedDials.d.ts.map