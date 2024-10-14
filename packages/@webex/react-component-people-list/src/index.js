import 'react-virtualized/styles.css';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {List, AutoSizer} from 'react-virtualized';
import {ListItemHeader} from '@momentum-ui/react';

import Person from './list-item';
import styles from './styles.css';

const propTypes = {
  canEdit: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    people: PropTypes.arrayOf(PropTypes.shape({
      displayName: PropTypes.string,
      emailAddress: PropTypes.string,
      id: PropTypes.string,
      isExternal: PropTypes.bool,
      isPending: PropTypes.bool
    }))
  })).isRequired,
  onItemClick: PropTypes.func,
  onPersonRemove: PropTypes.func,
  onDisplayUsers: PropTypes.func
};

const defaultProps = {
  canEdit: false,
  onItemClick: () => {},
  onDisplayUsers: () => {},
  onPersonRemove: () => {}
};

function PeopleList({
  canEdit,
  items,
  onItemClick,
  onDisplayUsers,
  onPersonRemove
}) {
  if (!items || !items.length) {
    return null;
  }

  const totalRows = [];

  items.forEach((item) => {
    // Header for item
    if (item.label) {
      totalRows.push({type: 'header', details: item.label});
    }
    // Rows for each person
    item.people.forEach((person) => {
      totalRows.push({type: 'person', details: person});
    });
  });

  // disable react/prop-types because eslint thinks rowRenderer is the main render
  /* eslint-disable react/prop-types */
  function rowRenderer({
    key, index, style, showEdit = false
  }) {
  /* eslint-enable react/prop-types */
    if (totalRows[index].type === 'header') {
      return (
        <div style={style} className={classNames('webex-people-group', styles.group)} key={totalRows[index].details}>
          {
            totalRows[index].details
            && <ListItemHeader className={classNames('webex-people-group-title', styles.title)} header={totalRows[index].details} isReadOnly />
          }
        </div>
      );
    }

    const person = totalRows[index].details;

    const handleItemClick = () => {
      onItemClick(person);
    };

    const handlePersonRemove = () => {
      onPersonRemove(person);
    };

    return (
      <div key={key} style={style}>
        <Person
          canEdit={showEdit}
          displayName={person.displayName || person.name}
          key={person.id}
          onClick={handleItemClick}
          onRemove={handlePersonRemove}
          emailAddress={person.emailAddress}
          id={person.id}
          isExternal={person.isExternal}
          isPending={person.isPending}
        />
      </div>
    );
  }

  function onRowsRendered({startIndex, stopIndex}) {
    // gets users from displayed rows that are not labels
    const userIds = totalRows.slice(startIndex, stopIndex + 1).filter((row) => row.type === 'person').map((p) => p.details.id);

    onDisplayUsers(userIds);
  }

  const canNotVirtualize = canEdit && totalRows.length < 50;

  // To display the popover for moderator functions, we cannot use virtualized
  const list = canNotVirtualize ? (
    totalRows.map((row, index) => {
      const key = totalRows[index].type === 'header' ? totalRows[index].details : totalRows[index].details.id;

      return rowRenderer({index, key, showEdit: true});
    })
  ) : (
    <AutoSizer>
      {({height, width}) => (
        <List
          height={height}
          rowCount={totalRows.length}
          rowHeight={44}
          rowRenderer={rowRenderer}
          width={width}
          onRowsRendered={onRowsRendered}
        />
      )}
    </AutoSizer>
  );

  return (
    <div className={classNames('webex-people-list', styles.list, {[styles.listNonVirtualized]: canNotVirtualize})}>
      {list}
    </div>
  );
}


PeopleList.propTypes = propTypes;
PeopleList.defaultProps = defaultProps;

export default PeopleList;
