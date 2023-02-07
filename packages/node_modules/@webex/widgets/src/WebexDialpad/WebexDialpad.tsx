import React, { useCallback, useRef, useState } from 'react';
import './WebexDialpad.scss';
import { NumberPad } from '../components/NumberPad';
import { CallButtons } from '../components';
import {
  WebexSearchContacts,
  WebexSearchContactsHandle,
} from '../WebexSearchContacts/WebexSearchContacts';
import useWebexClasses from '../hooks/useWebexClasses';

type Props = {
  style?: React.CSSProperties;
};

/**
 * Full dialpad with searchable input, number pad, and calling buttons
 *
 * @param root0
 * @param root0.style
 * @returns {JSX.Element} React component
 */
export const WebexDialpad = ({ style = undefined }: Props) => {
  const [cssClasses, sc] = useWebexClasses('dialpad-widget');
  const searchContactsRef = useRef<WebexSearchContactsHandle>(null);
  const [callAddress, setCallAddress] = useState<string>('');
  const [callDisabled, setCallDisabled] = useState<boolean>(false);

  const onButtonPress = (value: string) => {
    searchContactsRef.current?.appendValueToInput(value);
  };

  const onInputChange = useCallback(
    (input: string) => {
      setCallDisabled(false);
      setCallAddress(input);
    },
    [setCallDisabled, setCallAddress]
  );

  return (
    <div className={cssClasses} style={style}>
      <WebexSearchContacts
        ref={searchContactsRef}
        onInputChange={onInputChange}
        onDropdownHide={() => setCallDisabled(false)}
        onUserSelect={(user) => setCallDisabled(!!user)}
      />

      <NumberPad onButtonPress={onButtonPress} />
      <CallButtons
        address={callAddress}
        className={sc('call-buttons')}
        disabled={callDisabled}
      />
    </div>
  );
};
