import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
export interface ISpeedDialItem extends ISpeedDialRecord {
    type?: string;
}
export interface ISpeedDialEvents {
    /** Handle when item is pressed */
    onPress?: (item: ISpeedDialRecord) => void;
    /** Handle when item video call button is pressed */
    onVideoCallPress?: (item: ISpeedDialRecord) => void;
    /** Handle when item audio call button is pressed */
    onAudioCallPress?: (item: ISpeedDialRecord) => void;
    /** Handle when item edit button is pressed */
    onEditPress?: (item: ISpeedDialRecord) => void;
    /** Handle when item remove button is pressed */
    onRemovePress?: (id: string) => void;
}
export interface ISpeedDialsProps extends ISpeedDialEvents {
    items: ISpeedDialItem[] | undefined;
    /** Handle when items sort ends */
    onSortEnd?: (items: ISpeedDialRecord[]) => void;
}
export interface ISpeedDialsListProps extends ISpeedDialEvents {
    items: ISpeedDialItem[];
    className: string;
    /** Handle when item is pressed */
    onClick?: (id: string) => void;
}
//# sourceMappingURL=SpeedDials.types.d.ts.map