import React from 'react';
import {
  ButtonCircle,
  Flex,
  IconNext,
  Text,
} from '@momentum-ui/react-collaboration';
import { useTranslation } from 'react-i18next';
import { useMakeCall } from '../../hooks/useMakeCall';

type CallButtonsProps = {
  address: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Video and audio call buttons
 *
 * @param {CallButtonsProps} props
 * @param props.address address to call
 * @param props.disabled denotes whether the call buttons should be disabled
 * @returns {JSX.Element} React component
 */
export const CallButtons = ({
  address,
  disabled = false,
  className = undefined,
}: CallButtonsProps) => {
  const isDisabled = disabled || !address;
  const [makeCall] = useMakeCall();

  const { t } = useTranslation();

  return (
    <Flex xgap="32px" className={className} alignItems="center">
      <Flex direction="column" alignItems="center" ygap="8px">
        <ButtonCircle
          size={52}
          color="join"
          onPress={() => makeCall(address, false)}
          disabled={isDisabled}
          aria-label={t('makeAudioCallTo', { address })}
        >
          <IconNext autoScale={150} name="handset" />
        </ButtonCircle>
        <Text type="body-primary">{t('audio')}</Text>
      </Flex>
      <Flex direction="column" alignItems="center" ygap="8px">
        <ButtonCircle
          size={52}
          color="join"
          onPress={() => makeCall(address, true)}
          disabled={isDisabled}
          aria-label={t('makeVideoCallTo', { address })}
        >
          <IconNext autoScale={150} name="video" />
        </ButtonCircle>
        <Text type="body-primary">{t('video')}</Text>
      </Flex>
    </Flex>
  );
};
