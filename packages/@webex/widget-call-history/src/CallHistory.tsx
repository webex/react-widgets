import { Flex, ListNext as List } from '@momentum-ui/react-collaboration';
import React from 'react';

import './CallHistory.styles.scss';
import { CallHistoryItem } from './CallHistoryItem';
import { ICallHistoryItemProps } from './CallHistoryItem.types';
import useWebexClasses from './hooks/useWebexClasses';

export type CallHistoryProps = {
  items: ICallHistoryItemProps[];
  style?: React.CSSProperties;
  onPress?: (item: ICallHistoryItemProps) => void;
  selectedItem?: ICallHistoryItemProps;
  extraCallHistoryItemProps?: ICallHistoryItemProps;
  makeCall?: (address: string, isVideo?: boolean, label?: string) => void;
  isLocaleGerman?: boolean;
  dismissBagdeonClickRow?: () => void;
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
  makeCall,
  isLocaleGerman,
  dismissBagdeonClickRow
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
                  dismissBagdeonClickRow && dismissBagdeonClickRow()
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
              callbackAddress={item.callbackAddress}
              durationSeconds={item.durationSeconds}
              makeCall={makeCall}
              callingSpecific={item.callingSpecific}
              isLocaleGerman={isLocaleGerman}
              dismissBagdeonClickRow={dismissBagdeonClickRow}
            />
          ))}
        </List>
      )}
    </Flex>
  );
};