import { ISpeedDialRecord } from '@webex/component-adapter-interfaces/dist/cjs/src';

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
  /** Handle when add speed dial btn is pressed */
  onAddPress?: () => void
}

export interface ISpeedDialsProps extends ISpeedDialEvents {
  items: ISpeedDialItem[] | undefined;
  /** Handle when items sort ends */
  onSortEnd?: (items: ISpeedDialRecord[]) => void;
  listError?: boolean;
}

export interface ISpeedDialsListProps extends ISpeedDialEvents {
  items: ISpeedDialItem[];
  className: string;
  /** Handle when item is pressed */
  onClick?: (id: string) => void;
  /** To handle reinitialization of aria label content after item has been rearranged  */
  selectedNodeForRearange: Element | undefined;
}
