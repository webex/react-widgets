import {
  ButtonCircle,
  Flex,
  IconNext,
  Text
} from '@momentum-ui/react-collaboration';
import React from 'react';
import { useTranslation } from 'react-i18next';

type CallButtonsProps = {
  address: string;
  disabled?: boolean;
  className?: string;
  useMakeAudioCall?:() => void;
  useMakeVideoCall?:() => void;
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
  useMakeAudioCall = undefined,
  useMakeVideoCall = undefined,
}: CallButtonsProps) => {
  const isDisabled = disabled || !address;

  const { t } = useTranslation('WebexSearchContacts');

  return (
    <Flex xgap="32px" className={className} alignItems="center">
      <Flex direction="column" alignItems="center" ygap="8px">
        <ButtonCircle
          size={52}
          color="join"
          onPress={useMakeAudioCall}
          title={!isDisabled ? t('audioCallLabel') : ''}
          disabled={isDisabled}
          aria-label={t('audioCallLabel')}
        >
          <IconNext autoScale={150} name="handset" />
        </ButtonCircle>
        <Text type="body-primary"  className={`${ isDisabled ? `disabled-color` : `enabled-color`}`}>{t('audio')}</Text>
      </Flex>
      <Flex direction="column" alignItems="center" ygap="8px">
        <ButtonCircle
          size={52}
          color="join"
          onPress={useMakeVideoCall}
          title={!isDisabled ? t('videoCallLabel') : ''}
          disabled={isDisabled}
          aria-label={t('videoCallLabel')}
        >
          <IconNext autoScale={150} name="video" />
        </ButtonCircle>
        <Text type="body-primary" className={`${ isDisabled ? `disabled-color` : `enabled-color`}`}>{t('video')}</Text>
      </Flex>
    </Flex>
  );
};
