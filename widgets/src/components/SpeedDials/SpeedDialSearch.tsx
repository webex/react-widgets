import React, { useCallback, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AvatarNext,
  ContentSeparator,
  IconNext,
  ListHeader,
  ListItemBase,
  ListItemBaseSection,
  ListNext as List,
  SearchInput,
  Text,
} from '@momentum-ui/react-collaboration';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';

import useWebexClasses from '../../hooks/useWebexClasses';
import { ISpeedDialItem } from './SpeedDials.types';

import './SpeedDialSearch.styles.scss';

type ISpeedDialSearchProps = {
  /* Custom classname for component */
  className?: string;
  items?: ISpeedDialRecord[];
  /* Triggered when search input changing */
  onSearch?: (value: string) => void;
  /* Triggered when add button is pressed */
  onAdd?: (item: ISpeedDialItem) => void;
  /* Triggered when search item is pressed */
  onPress?: (item: ISpeedDialItem) => void;
};

type State = {
  searchValue: string;
  items: ISpeedDialItem[];
  filteredItems: ISpeedDialItem[];
};

enum ActionTypes {
  FILTER_CONTACTS = 'FILTER_CONTACTS',
}

type SearchAction = {
  type: typeof ActionTypes.FILTER_CONTACTS;
  payload: string;
};

type Actions = SearchAction;

const initialState = {
  searchValue: '',
  items: [],
  filteredItems: [],
};

/**
 * Handles sanitizing user input.
 *
 * @param {string} str The input string
 * @returns {string} THe input string sanitized
 */
function sanitizeString(str: string): string {
  const s: string = str.replace(/[^a-z\dáéíóúñü .,_-]/gim, '');
  return s.trim();
}

/**
 * Search component reducer
 *
 * @param {State} state The current state
 * @param {Actions} action The action to perform
 * @returns {State} The updated state
 */
function reducer(state: State, action: Actions): State {
  const { type, payload } = action;

  const searchValue = sanitizeString(payload) as string;

  switch (type) {
    case ActionTypes.FILTER_CONTACTS:
      if (!payload) {
        return {
          ...state,
          searchValue,
          filteredItems: [],
        };
      }
      return {
        ...state,
        searchValue,
        filteredItems: state.items.filter((item: ISpeedDialItem) => {
          const regex = new RegExp(`${searchValue}`, 'ig');
          return item?.displayName.match(regex);
        }),
      };
    default:
      throw new Error();
  }
}

type ISpeedDialListItem = {
  item: ISpeedDialItem;
  className?: string;
  onPress?: (item: ISpeedDialItem) => void;
};
const SpeedDialListItem = ({
  item,
  className = undefined,
  onPress = undefined,
}: ISpeedDialListItem) => {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);
  return (
    <ListItemBase
      isPadded
      shape="isPilled"
      size={50}
      className={className}
      onPress={handlePress}
    >
      <ListItemBaseSection position="start">
        <AvatarNext title={item.displayName} size={32} />
      </ListItemBaseSection>
      <ListItemBaseSection position="fill">
        {item.displayName}
      </ListItemBaseSection>
    </ListItemBase>
  );
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
export const SpeedDialSearch = ({
  items = [],
  className = undefined,
  onSearch = undefined,
  onAdd = undefined,
  onPress = undefined,
}: ISpeedDialSearchProps) => {
  const [cssClasses, sc] = useWebexClasses('speed-dial-search', className);
  const { t } = useTranslation('WebexSpeedDials');
  const [state, dispatch] = useReducer(reducer, { ...initialState, items });

  const searchContactsData = {
    directory: state.filteredItems.filter(
      (a: ISpeedDialItem) => a.type === 'directory'
    ),
    outlook: state.filteredItems.filter(
      (a: ISpeedDialItem) => a.type === 'outlook'
    ),
  };

  const createHeaderStr = t('search.labels.header', {
    searchValue: state.searchValue,
  });

  const handleChange = (e: string) => {
    if (onSearch) {
      onSearch(e);
    }
    dispatch({ type: ActionTypes.FILTER_CONTACTS, payload: e });
  };

  const handlePress = (item: ISpeedDialItem) => {
    if (onPress) {
      onPress(item);
    }
  };

  const handleAdd = () => {
    const newItem: ISpeedDialItem = {
      id: '0',
      displayName: state.searchValue,
    };

    if (onAdd) {
      onAdd(newItem);
    }
  };

  return (
    <div className={cssClasses}>
      <SearchInput
        autoFocus
        label={t('search.label')}
        name="searchContactsInput"
        onChange={handleChange}
        clearButtonAriaLabel={t('search.labels.clear')}
      />

      {state.searchValue && (
        <div className={sc('popover')}>
          <ul className={sc('popover-list')}>
            <li className={sc('list-container')}>
              <List
                className={sc('list')}
                id="searchContactsList"
                listSize={state.filteredItems.length + 2}
              >
                {/* Directory Contacts List */}
                {searchContactsData?.directory.length > 0 && (
                  <>
                    <ListHeader
                      key="searchContactsDirectoryHeader"
                      className={sc('item-header')}
                    >
                      <ListItemBaseSection position="fill">
                        <Text type="subheader-secondary">
                          {t('search.labels.directory')}
                        </Text>
                      </ListItemBaseSection>
                    </ListHeader>

                    {searchContactsData?.directory.map(
                      (item: ISpeedDialItem) => (
                        <SpeedDialListItem
                          key={`search-item-${item.id}`}
                          className={sc('item')}
                          onPress={handlePress}
                          item={item}
                        />
                      )
                    )}
                  </>
                )}
                {/* Outlook Contacts List */}
                {searchContactsData?.outlook.length > 0 && (
                  <>
                    <ListHeader
                      key="searchContactsOutlookHeader"
                      className={sc('item-header')}
                    >
                      <ListItemBaseSection position="fill">
                        <Text type="subheader-secondary">
                          {t('search.labels.outlook')}
                        </Text>
                      </ListItemBaseSection>
                    </ListHeader>
                    {searchContactsData?.outlook.map((item: ISpeedDialItem) => (
                      <SpeedDialListItem
                        key={`search-item-${item.id}`}
                        className={sc('item')}
                        onPress={handlePress}
                        item={item}
                      />
                    ))}
                  </>
                )}
              </List>
            </li>
            <ContentSeparator />
            {createHeaderStr && (
              <ListHeader
                key="searchContactsCreateHeader"
                className={sc('item-header')}
              >
                <Text type="subheader-secondary">{createHeaderStr}</Text>
              </ListHeader>
            )}
            {/* Create speed dial action */}
            <ListItemBase
              isPadded
              shape="isPilled"
              className={sc('create-button')}
              key="searchContactsCreateButton"
              onPress={handleAdd}
            >
              <ListItemBaseSection position="start">
                {t('search.labels.create')}
                <span className={sc('create-label')}>
                  {` '${state.searchValue}'`}
                </span>
              </ListItemBaseSection>
              <ListItemBaseSection position="end">
                <IconNext name="participant-add" scale={20} />
              </ListItemBaseSection>
            </ListItemBase>
          </ul>
        </div>
      )}
    </div>
  );
};
