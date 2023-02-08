import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { LoadingSpinner } from '@momentum-ui/react-collaboration';
import {
  CallHistory,
  ICallHistoryItemProps,
  NoHistory,
} from '../components/CallHistory';
import useWebexClasses from '../hooks/useWebexClasses';
import useCallHistory from '../hooks/useCallHistory';

import './WebexCallHistory.styles.scss';
import { eventEmitter, EventType } from '../services';

export type IWebexCallHistoryProps = {
  userID: string;
  noHistoryMessage?: string | undefined;
  style?: React.CSSProperties;
  onPress?: (item: ICallHistoryItemProps) => void;
  extraCallHistoryItemProps?: ICallHistoryItemProps;
};

export interface IWebexCallHistoryHandle {
  refreshCallHistory: () => void;
  getLastUpdated: () => Date | undefined;
}

/**
 * @description The summary of this component.
 * @param {IWebexCallHistoryProps} obj - An object of props.
 * @param {string} obj.userID The ID of the current user
 * @param {string} obj.headerText The label for the header
 * @param {string} obj.noHistoryMessage The message when call history is empty
 * @param {Function} obj.onPress Handle when item is pressed
 * @param {Function} obj.onAudioCallPress Handle when audio call button is pressed
 * @param {Function} obj.onVideoCallPress Handle when video call button is pressed
 * @param {React.CSSProperties} obj.style Custom style for overriding this component's CSS
 * @returns {React.Component} WebexCallHistory component
 */
export const WebexCallHistory = forwardRef<
  IWebexCallHistoryHandle,
  IWebexCallHistoryProps
>(
  (
    { userID, style, noHistoryMessage, onPress, extraCallHistoryItemProps },
    ref
  ) => {
    const {
      callHistory = [],
      lastUpdated,
      refresh,
      loading,
    } = useCallHistory(userID);

    useImperativeHandle(ref, () => ({
      refreshCallHistory() {
        refresh();
      },
      getLastUpdated() {
        return lastUpdated;
      },
    }));

    const isEmpty = callHistory?.length === 0;

    eventEmitter.subscribe(EventType.AUTO_REFRESH, 'autorefresh', () => {
      refresh();
    });
    const [cssClasses, sc] = useWebexClasses('call-history-widget', '', {
      loading,
      'is-empty': isEmpty && !loading,
    });

    const [selected, setSelected] = useState<ICallHistoryItemProps | undefined>(
      undefined
    );

    return (
      <div className={cssClasses} style={style}>
        {loading ? (
          <LoadingSpinner scale={48} />
        ) : (
          <div className={sc('content')}>
            {isEmpty && (
              <div style={{ marginTop: '6rem' }}>
                <NoHistory message={noHistoryMessage} />
              </div>
            )}
            {!isEmpty && (
              <CallHistory
                onPress={(item) => {
                  if (onPress) {
                    onPress(item);
                  }
                  setSelected(item);
                }}
                selectedItem={selected}
                items={callHistory as ICallHistoryItemProps[]}
                extraCallHistoryItemProps={extraCallHistoryItemProps}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

WebexCallHistory.defaultProps = {
  style: undefined,
  noHistoryMessage: 'Your recent calls will appear here.',
  onPress: undefined,
  extraCallHistoryItemProps: undefined,
};
