import {
  useContext,
  useEffect,
  useReducer,
  Dispatch,
  useState,
  useCallback,
} from 'react';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
import { AdapterContext } from '../contexts/AdapterContext';

export type IState = {
  records: Map<string, ISpeedDialRecord>;
  speedDials: ISpeedDialRecord[];
  contacts: Array<ISpeedDialRecord> | ISpeedDialRecord[] | undefined;
  selectedItem?: ISpeedDialRecord;
  lastUpdated?: Date;
};

const initialState: IState = {
  speedDials: [],
  contacts: [],
  selectedItem: undefined,
  records: new Map(),
};

export enum SpeedDialActionType {
  REFRESH = 'REFRESH',
  CLEAR = 'CLEAR',
  EDIT = 'EDIT',
  REMOVE = 'REMOVE',
  SELECT = 'SELECT',
  REORDER = 'REORDER',
  UPDATE = 'UPDATE',
  FETCH_CONTACTS = 'FETCH_CONTACTS',
  ADD = 'ADD',
}

export const addSpeedDial = (
  dispatch: Dispatch<AddSpeedDialAction>,
  payload: ISpeedDialRecord
) => dispatch({ type: SpeedDialActionType.ADD, payload });

export const updateSpeedDial = (
  dispatch: Dispatch<UpdateSpeedDialAction>,
  payload: ISpeedDialRecord
) => dispatch({ type: SpeedDialActionType.UPDATE, payload });

export const editSpeedDial = (
  dispatch: Dispatch<EditSpeedDialAction>,
  payload: ISpeedDialRecord
) => dispatch({ type: SpeedDialActionType.EDIT, payload });

export const selectSpeedDial = (
  dispatch: Dispatch<SelectSpeedDialAction>,
  payload: ISpeedDialRecord
) => dispatch({ type: SpeedDialActionType.SELECT, payload });

export const removeSpeedDial = (
  dispatch: Dispatch<RemoveSpeedDialAction>,
  payload: string
) => dispatch({ type: SpeedDialActionType.REMOVE, payload });

export const reorderSpeedDial = (
  dispatch: Dispatch<ReorderSpeedDialAction>,
  payload: ISpeedDialRecord[]
) => dispatch({ type: SpeedDialActionType.REORDER, payload });

export const clearSpeedDial = (
  dispatch: Dispatch<ClearSpeedDialAction>,
  payload?: string
) => dispatch({ type: SpeedDialActionType.CLEAR, payload });

export type RefreshAction = {
  type: typeof SpeedDialActionType.REFRESH;
  payload: ISpeedDialRecord[];
};
export type RefreshContactsAction = {
  type: typeof SpeedDialActionType.FETCH_CONTACTS;
  payload: ISpeedDialRecord[] | undefined;
};
export type AddSpeedDialAction = {
  type: typeof SpeedDialActionType.ADD;
  payload: ISpeedDialRecord;
};
export type ClearSpeedDialAction = {
  type: typeof SpeedDialActionType.CLEAR;
  payload?: string;
};
export type EditSpeedDialAction = {
  type: typeof SpeedDialActionType.EDIT;
  payload: ISpeedDialRecord;
};
export type SelectSpeedDialAction = {
  type: typeof SpeedDialActionType.SELECT;
  payload: ISpeedDialRecord | undefined;
};
export type UpdateSpeedDialAction = {
  type: typeof SpeedDialActionType.UPDATE;
  payload: ISpeedDialRecord;
};
export type ReorderSpeedDialAction = {
  type: typeof SpeedDialActionType.REORDER;
  payload: ISpeedDialRecord[];
};
export type RemoveSpeedDialAction = {
  type: typeof SpeedDialActionType.REMOVE;
  payload: string;
};

export type Actions =
  | AddSpeedDialAction
  | RefreshAction
  | ClearSpeedDialAction
  | RefreshContactsAction
  | EditSpeedDialAction
  | ReorderSpeedDialAction
  | UpdateSpeedDialAction
  | SelectSpeedDialAction
  | RemoveSpeedDialAction;

/**
 * Handles all things speed dials.
 *
 * @param {IState} state The default state
 * @param {Actions} action The invoked action
 * @returns {IState} The updated state
 */
function reducer(state: IState, action: Actions): IState {
  const { type, payload } = action;
  let selectedItem;
  let selectedIndex;
  let { speedDials } = state;

  console.group('useSpeedDials');
  console.log('reducer', type, payload);
  console.log('state', state);
  console.groupEnd();

  switch (type) {
    case SpeedDialActionType.REFRESH:
      return {
        ...state,
        speedDials: payload as ISpeedDialRecord[],
      };
    case SpeedDialActionType.FETCH_CONTACTS:
      return {
        ...state,
        contacts: payload as ISpeedDialRecord[],
      };
    case SpeedDialActionType.SELECT:
      selectedItem = payload as ISpeedDialRecord;
      return {
        ...state,
        selectedItem,
      };
    case SpeedDialActionType.CLEAR:
      selectedItem = undefined;
      return {
        ...state,
        selectedItem,
      };
    case SpeedDialActionType.ADD:
      speedDials = [...state.speedDials, payload as ISpeedDialRecord];
      return {
        ...state,
        speedDials,
      };
    case SpeedDialActionType.EDIT:
      selectedItem = payload as ISpeedDialRecord;
      return { ...state, selectedItem };

    case SpeedDialActionType.UPDATE:
      selectedIndex = state.speedDials.findIndex(
        (e: ISpeedDialRecord) => e.id === (payload as ISpeedDialRecord).id
      );
      speedDials = [...state.speedDials];
      speedDials[selectedIndex] = payload as ISpeedDialRecord;
      return {
        ...state,
        speedDials,
      };
    case SpeedDialActionType.REMOVE:
      selectedIndex = state.speedDials.findIndex(
        (e: ISpeedDialRecord) => e.id === payload
      );
      state.speedDials.splice(selectedIndex, 1);
      return { ...state };
    case SpeedDialActionType.REORDER:
      return {
        ...state,
        speedDials: payload as ISpeedDialRecord[],
      };

    default:
      throw new Error('Cannot find action.');
  }
}

/**
 * Custom hook that returns speed dial data of the given ID.
 *
 * @param {string} userID  ID for user which to return data.
 * @param {Array} initialContacts  A list of contacts to use for search.
 * @returns {object} Returns {speedDials, contacts, selectedItem, dispatch } values
 */
export default function useSpeedDials(
  userID?: string,
  initialContacts?: ISpeedDialRecord[]
) {
  if (initialContacts) {
    initialState.contacts = initialContacts;
  }

  const [loading, setLoading] = useState<boolean>(true);

  const [{ speedDials, selectedItem, contacts }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const ctx = useContext(AdapterContext);

  const onError = (error: Error) => {
    console.error('error', error);
  };

  const onUpdate = useCallback((data: ISpeedDialRecord[]) => {
    dispatch({ type: SpeedDialActionType.REFRESH, payload: data });
    setLoading(false);
  }, []);

  useEffect(() => {
    const subscription = ctx?.speedDialsAdapter
      ?.getAll(userID)
      .subscribe({ next: onUpdate, error: onError });

    return () => {
      subscription?.unsubscribe();
    };
  }, [ctx?.speedDialsAdapter, userID]);

  return {
    speedDials,
    contacts,
    selectedItem,
    loading,
    dispatch,
  } as const;
}

/**
 * Handles subscribing to 1 speed dial
 *
 * @param {string} ID The speed dial id
 * @param {ISpeedDialRecord} initialValue Initial value to use for speed dial.
 * @returns {ISpeedDialRecord} Returns speed dial item
 */
export function useSpeedDial(ID: string, initialValue?: ISpeedDialRecord) {
  const [item, setItem] = useState(initialValue || {});
  const ctx = useContext(AdapterContext);

  useEffect(() => {
    let cleanup;

    if (!ctx.speedDialsAdapter || !ID) {
      setItem({});
      cleanup = undefined;
    } else {
      const onError = (error: Error) => {
        throw error;
      };

      const subscription = ctx?.speedDialsAdapter
        .getOne?.(ID)
        .subscribe({ next: setItem, error: onError });

      cleanup = () => {
        subscription?.unsubscribe();
      };
    }

    return cleanup;
  }, [ctx.speedDialsAdapter, ID]);

  return item;
}
