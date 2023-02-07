import React, { useCallback, useEffect, useState } from 'react';
import {
  ListHeader,
  ListItemBaseSection,
  ListNext as List,
  LoadingSpinner,
} from '@momentum-ui/react-collaboration';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import useWebexClasses from '../../hooks/useWebexClasses';
import { useContactSearch } from '../../hooks/useContactSearch';
import { SearchContactsListEmpty } from './SearchContactsListEmpty';
import './SearchContactsList.styles.scss';
import { SearchContactsItem } from './SearchContactsItem';

type SearchContactsListProps = {
  searchValue: string;
  noContactsFoundMessage: string;
  onUserSelect?: (user: IWebexIntContact | undefined) => void;
  hideSource?: boolean;
  style?: React.CSSProperties;
};

/**
 *
 * @param root0
 * @param root0.style
 * @param root0.searchValue
 * @param root0.noContactsFoundMessage
 * @param root0.onSelectUser
 * @param root0.onUserSelect
 * @param root0.hideSource
 */
export const SearchContactsList = ({
  searchValue,
  noContactsFoundMessage,
  onUserSelect = () => {},
  hideSource = false,
  style = undefined,
}: SearchContactsListProps) => {
  const [sources, filteredContactResponse, isSearching] =
    useContactSearch(searchValue);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [cssClasses, sc] = useWebexClasses('search-contacts-list', undefined, {
    loading: isSearching,
  });

  const setSeletedUser = useCallback(
    (user?: IWebexIntContact) => {
      onUserSelect(user);
      setSelectedUserId(user?.id);
    },
    [onUserSelect, setSelectedUserId]
  );

  useEffect(() => {
    setSeletedUser(undefined);
  }, [searchValue]);

  if (!isSearching && filteredContactResponse.count === 0) {
    return (
      <SearchContactsListEmpty
        noContactsFoundMessage={noContactsFoundMessage}
      />
    );
  }

  return (
    <List
      listSize={filteredContactResponse.count}
      className={cssClasses}
      style={style}
    >
      {sources
        .filter(
          (source) =>
            isSearching ||
            (filteredContactResponse.items[source] || []).length > 0
        )
        .map((source) => (
          <React.Fragment key={source}>
            {!hideSource && (
              <ListHeader>
                <ListItemBaseSection
                  position="fill"
                  className={sc('source-header')}
                >
                  {source}
                </ListItemBaseSection>
              </ListHeader>
            )}
            {isSearching ? (
              <LoadingSpinner
                scale={32}
                className={sc('loading')}
                data-testid={`loading-spinner-${source}`}
              />
            ) : (
              filteredContactResponse.items[source].map((user, index) => (
                <SearchContactsItem
                  key={user.id}
                  user={user}
                  index={index}
                  isSelected={selectedUserId === user.id}
                  onPress={() => setSeletedUser(user)}
                />
              ))
            )}
          </React.Fragment>
        ))}
    </List>
  );
};
