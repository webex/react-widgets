import React, { useCallback, useState } from 'react';
import {
  AvatarNext as Avatar,
  ButtonCircle,
  Flex,
  IconNext as Icon,
  ListItemBase,
  ListItemBaseSection,
  Text,
} from '@momentum-ui/react-collaboration';
import { IWebexVoicemail } from '@webex-int/adapter-interfaces';
import useWebexClasses from '../../hooks/useWebexClasses';
import './VoicemailItem.styles.scss';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { VoicemailPlaybackControls } from './VoicemailPlaybackControls';
import { useMakeCall } from '../../hooks/useMakeCall';

export interface IVoicemailItemProps {
  voicemail: IWebexVoicemail;
  isSelected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  onRead?: () => void;
}

export const VoicemailItem = ({
  voicemail,
  isSelected = false,
  onPress = () => {},
  onDelete = undefined,
  onRead = undefined,
}: IVoicemailItemProps) => {
  const [unread, setUnread] = useState<boolean>(voicemail.unread);
  const [makeCall] = useMakeCall();
  const [cssClasses, sc] = useWebexClasses('voicemail-item', undefined, {
    unread,
  });

  const readVoicemail = useCallback(() => {
    setUnread(false);
    if (onRead) {
      onRead();
    }
  }, [onRead]);

  const onClick = () => {
    readVoicemail();
    onPress();
  };

  return (
    <ListItemBase
      className={cssClasses}
      size={50}
      isPadded
      isSelected={isSelected}
      onPress={onClick}
    >
      <ListItemBaseSection position="fill">
        <Avatar title={voicemail.name} size={32} className={sc('avatar')} />
        <Flex direction="column">
          <Text type="body-primary" className={sc('name')}>
            {voicemail.name}
          </Text>
          <Text type="body-secondary" className={sc('phone')}>
            {voicemail.address}
          </Text>
        </Flex>
        <VoicemailPlaybackControls
          audioSrc={voicemail.audioSrc}
          onPlay={readVoicemail}
          duration={voicemail.duration}
        />
        <div className={sc('meta')}>
          <Flex
            direction="column"
            alignItems="flex-end"
            className={sc('datetime')}
          >
            <Text
              type="body-secondary"
              className={`${sc('date')} chromatic-ignore`}
            >
              {formatDate(voicemail.date)}
            </Text>
            <Text
              type="body-secondary"
              className={`${sc('time')} chromatic-ignore`}
            >
              {formatTime(voicemail.date)}
            </Text>
          </Flex>
          <Flex xgap=".5rem" className={sc('actions')}>
            <ButtonCircle
              size={28}
              color="join"
              onPress={() => makeCall(voicemail.address, true)}
            >
              <Icon scale={18} name="video" />
            </ButtonCircle>
            <ButtonCircle
              size={28}
              color="join"
              onPress={() => makeCall(voicemail.address, false)}
            >
              <Icon scale={18} name="audio-call" />
            </ButtonCircle>
            {onDelete && (
              <ButtonCircle size={28} outline onPress={onDelete}>
                <Icon scale={18} name="delete" />
              </ButtonCircle>
            )}
          </Flex>
        </div>
        <div className={sc('unread-bubble')} />
      </ListItemBaseSection>
    </ListItemBase>
  );
};