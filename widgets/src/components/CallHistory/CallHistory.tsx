import React from 'react';
import { Flex, ListNext as List } from '@momentum-ui/react-collaboration';

import useWebexClasses from '../../hooks/useWebexClasses';
import { CallHistoryItem } from './CallHistoryItem';
import { ICallHistoryItemProps } from './CallHistoryItem.types';
import './CallHistory.styles.scss';

export type CallHistoryProps = {
  items: ICallHistoryItemProps[];
  style?: React.CSSProperties;
  onPress?: (item: ICallHistoryItemProps) => void;
  selectedItem?: ICallHistoryItemProps;
  extraCallHistoryItemProps?: ICallHistoryItemProps;
};

/**
 * @description CallHistory component renders an array of call history items.
 * @param {CallHistoryProps} obj - An object of CallHistoryProps
 * @param {Array} obj.items An array of CallHistoryItems
 * @param {Function} obj.onPress Handle when item is pressed
 * @param {ICallHistoryItemProps} obj.selectedItem The selected call history item
 * @param {Function} obj.onAudioCallPress Handle when audio call button is pressed
 * @param {Function} obj.onVideoCallPress Handle when video call button is pressed
 * @param {React.CSSProperties} obj.style Custom style for overriding this component's CSS
 * @returns {React.Component} CallHistory component
 */
export const CallHistory = ({
  items,
  style = undefined,
  onPress = undefined,
  selectedItem = undefined,
  extraCallHistoryItemProps = undefined,
}: CallHistoryProps) => {
  const [cssClasses, sc] = useWebexClasses('call-history');

  return (
    <Flex direction="column" className={cssClasses} style={style}>
      {items && (
        <List
          shouldFocusOnPress
          listSize={items.length}
          className={sc('list')}
          style={{
            width: '100%',
          }}
        >
          {items.map((item, index) => (
            <CallHistoryItem
              audioCallLabel={extraCallHistoryItemProps?.audioCallLabel}
              videoCallLabel={extraCallHistoryItemProps?.videoCallLabel}
              itemIndex={index}
              onPress={() => {
                if (onPress) {
                  onPress(item);
                }
              }}
              key={item.id}
              id={item.id}
              name={item.name}
              isSelected={selectedItem?.id === item?.id}
              phoneNumber={item.phoneNumber}
              direction={item.direction}
              disposition={item.disposition}
              startTime={item.startTime}
              endTime={item.endTime}
            />
          ))}
        </List>
      )}
    </Flex>
  );
};
