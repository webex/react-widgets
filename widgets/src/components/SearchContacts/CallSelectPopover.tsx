import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  ListItemBase,
  ListNext,
  PopoverNext as Popover,
} from '@momentum-ui/react-collaboration';
import './SearchContactsList.styles.scss';
import { IWebexIntCallableEntity } from '@webex-int/adapter-interfaces';
import useWebexClasses from '../../hooks/useWebexClasses';
import './CallSelectPopover.scss';
import { useMakeCall } from '../../hooks/useMakeCall';

interface ICallSelectPopoverProps {
  callables: IWebexIntCallableEntity[];
  isVideo?: boolean;
  children: React.ReactElement;
}

export interface ICallSelectPopoverHandle {
  hidePopover: () => void;
}

/**
 *
 * @param {ICallSelectPopoverProps} props
 * @param props.callables all callable addresses
 * @param props.isVideo whether a call initialized from this popover will be a audio or video call
 * @param props.children button that controls showing the popover
 */
export const CallSelectPopover = forwardRef<
  ICallSelectPopoverHandle,
  ICallSelectPopoverProps
>(({ callables, isVideo, children }, ref) => {
  const [cssClasses, sc] = useWebexClasses('call-select-popover');
  const [makeCall] = useMakeCall();

  const [instance, setInstance] = useState<any>();

  useImperativeHandle(ref, () => ({
    hidePopover() {
      instance?.hide();
    },
  }));

  if (callables.length === 1) {
    return React.cloneElement(children, {
      onPress: () => makeCall(callables[0].address, isVideo),
    });
  }

  return (
    <Popover
      color="primary"
      delay={[0, 0]}
      placement="bottom"
      showArrow
      trigger="click"
      interactive
      triggerComponent={children}
      variant="small"
      setInstance={setInstance}
      hideOnEsc
      strategy="fixed"
      data-testid={`webex-call-select-popover--${isVideo ? 'video' : 'audio'}`}
      className={cssClasses}
    >
      <ListNext listSize={callables.length}>
        {callables.map((item, callableIndex) => (
          <ListItemBase
            key={item.address}
            itemIndex={callableIndex}
            isPadded
            onPress={() => makeCall(item.address, isVideo)}
          >
            <div className={sc('item')}>
              <span className={sc('item-type')}>{item.type}:</span>
              <span>{item.address}</span>
            </div>
          </ListItemBase>
        ))}
      </ListNext>
    </Popover>
  );
});

CallSelectPopover.defaultProps = {
  isVideo: false,
};