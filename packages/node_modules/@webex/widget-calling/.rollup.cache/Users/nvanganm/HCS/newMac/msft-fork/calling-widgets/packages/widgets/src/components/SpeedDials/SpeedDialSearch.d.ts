/// <reference types="react" />
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
import { ISpeedDialItem } from './SpeedDials.types';
import './SpeedDialSearch.styles.scss';
declare type ISpeedDialSearchProps = {
    className?: string;
    items?: ISpeedDialRecord[];
    onSearch?: (value: string) => void;
    onAdd?: (item: ISpeedDialItem) => void;
    onPress?: (item: ISpeedDialItem) => void;
};
/**
 * Speed Dial search component.
 *
 * @param {ISpeedDialSearchProps} obj The props for the component
 * @param {number} obj.items The index of the speed dial
 * @param {string} obj.className The classname for componentn
 * @param {Function} obj.onSearch Triggered when input is searched
 * @param {Function} obj.onAdd Triggered when add button is pressed
 * @param {Function} obj.onPress Triggered when search item is pressed
 * @returns {React.Component} A Search component
 * @class
 */
export declare const SpeedDialSearch: ({ items, className, onSearch, onAdd, onPress, }: ISpeedDialSearchProps) => JSX.Element;
export {};
//# sourceMappingURL=SpeedDialSearch.d.ts.map