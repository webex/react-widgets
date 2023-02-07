import { Dispatch } from 'react';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
export declare type IState = {
    records: Map<string, ISpeedDialRecord>;
    speedDials: ISpeedDialRecord[];
    contacts: Array<ISpeedDialRecord> | ISpeedDialRecord[] | undefined;
    selectedItem?: ISpeedDialRecord;
    lastUpdated?: Date;
};
export declare enum SpeedDialActionType {
    REFRESH = "REFRESH",
    CLEAR = "CLEAR",
    EDIT = "EDIT",
    REMOVE = "REMOVE",
    SELECT = "SELECT",
    REORDER = "REORDER",
    UPDATE = "UPDATE",
    FETCH_CONTACTS = "FETCH_CONTACTS",
    ADD = "ADD"
}
export declare const addSpeedDial: (dispatch: Dispatch<AddSpeedDialAction>, payload: ISpeedDialRecord) => void;
export declare const updateSpeedDial: (dispatch: Dispatch<UpdateSpeedDialAction>, payload: ISpeedDialRecord) => void;
export declare const editSpeedDial: (dispatch: Dispatch<EditSpeedDialAction>, payload: ISpeedDialRecord) => void;
export declare const selectSpeedDial: (dispatch: Dispatch<SelectSpeedDialAction>, payload: ISpeedDialRecord) => void;
export declare const removeSpeedDial: (dispatch: Dispatch<RemoveSpeedDialAction>, payload: string) => void;
export declare const reorderSpeedDial: (dispatch: Dispatch<ReorderSpeedDialAction>, payload: ISpeedDialRecord[]) => void;
export declare const clearSpeedDial: (dispatch: Dispatch<ClearSpeedDialAction>, payload?: string | undefined) => void;
export declare type RefreshAction = {
    type: typeof SpeedDialActionType.REFRESH;
    payload: ISpeedDialRecord[];
};
export declare type RefreshContactsAction = {
    type: typeof SpeedDialActionType.FETCH_CONTACTS;
    payload: ISpeedDialRecord[] | undefined;
};
export declare type AddSpeedDialAction = {
    type: typeof SpeedDialActionType.ADD;
    payload: ISpeedDialRecord;
};
export declare type ClearSpeedDialAction = {
    type: typeof SpeedDialActionType.CLEAR;
    payload?: string;
};
export declare type EditSpeedDialAction = {
    type: typeof SpeedDialActionType.EDIT;
    payload: ISpeedDialRecord;
};
export declare type SelectSpeedDialAction = {
    type: typeof SpeedDialActionType.SELECT;
    payload: ISpeedDialRecord | undefined;
};
export declare type UpdateSpeedDialAction = {
    type: typeof SpeedDialActionType.UPDATE;
    payload: ISpeedDialRecord;
};
export declare type ReorderSpeedDialAction = {
    type: typeof SpeedDialActionType.REORDER;
    payload: ISpeedDialRecord[];
};
export declare type RemoveSpeedDialAction = {
    type: typeof SpeedDialActionType.REMOVE;
    payload: string;
};
export declare type Actions = AddSpeedDialAction | RefreshAction | ClearSpeedDialAction | RefreshContactsAction | EditSpeedDialAction | ReorderSpeedDialAction | UpdateSpeedDialAction | SelectSpeedDialAction | RemoveSpeedDialAction;
/**
 * Custom hook that returns speed dial data of the given ID.
 *
 * @param {string} userID  ID for user which to return data.
 * @param {Array} initialContacts  A list of contacts to use for search.
 * @returns {object} Returns {speedDials, contacts, selectedItem, dispatch } values
 */
export default function useSpeedDials(userID?: string, initialContacts?: ISpeedDialRecord[]): {
    readonly speedDials: ISpeedDialRecord[];
    readonly contacts: ISpeedDialRecord[] | undefined;
    readonly selectedItem: ISpeedDialRecord | undefined;
    readonly loading: boolean;
    readonly dispatch: Dispatch<Actions>;
};
/**
 * Handles subscribing to 1 speed dial
 *
 * @param {string} ID The speed dial id
 * @param {ISpeedDialRecord} initialValue Initial value to use for speed dial.
 * @returns {ISpeedDialRecord} Returns speed dial item
 */
export declare function useSpeedDial(ID: string, initialValue?: ISpeedDialRecord): {};
//# sourceMappingURL=useSpeedDials.d.ts.map