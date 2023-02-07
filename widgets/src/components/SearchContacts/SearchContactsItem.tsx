import React, { useCallback, useEffect, useRef } from 'react';
import {
  AvatarNext,
  ButtonCircle,
  Flex,
  IconNext as Icon,
  ListItemBase,
  ListItemBaseSection,
} from '@momentum-ui/react-collaboration';
import { useTranslation } from 'react-i18next';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import { useLazyLoadAvatarUrl } from '../../hooks/useLazyLoadAvatarUrl';
import {
  CallSelectPopover,
  ICallSelectPopoverHandle,
} from './CallSelectPopover';
import useWebexClasses from '../../hooks/useWebexClasses';
import './SearchContactsItem.scss';

type SearchContactsItemProps = {
  user: IWebexIntContact;
  index: number;
  onPress?: (user: IWebexIntContact) => void;
  isSelected?: boolean;
  style?: React.CSSProperties;
};

/**
 * User object that appears in the search contacts list.  On hover will show audio and video calling buttons.
 * When clicking one of them, a dropdown appears with the possible call addresses if multiple exist.
 * If the user only has one callable address, it will immediately call that one address.
 *
 * @param {SearchContactsItemProps} props
 * @param props.style optional inline styles
 * @param props.user user to show call options for
 * @param props.index index within the list
 * @param props.isSelected whether it is selected within the list
 * @param props.onPress action to perform when the user list item is pressed
 */
export const SearchContactsItem = ({
  user,
  index,
  onPress = () => {},
  isSelected = false,
  style = undefined,
}: SearchContactsItemProps) => {
  const { t } = useTranslation();

  const [imageUrl] = useLazyLoadAvatarUrl(user.id, user.fetchAvatarUrl);

  const callables = [...user.phoneNumbers, ...user.emailAddresses];
  const [cssClasses, sc] = useWebexClasses('search-contacts-item');

  const audioCallRef = useRef<ICallSelectPopoverHandle>(null);
  const videoCallRef = useRef<ICallSelectPopoverHandle>(null);

  const onAudioCallButtonPress = useCallback(() => {
    videoCallRef?.current?.hidePopover();
    onPress(user);
  }, [videoCallRef, user, onPress]);

  const onVideoCallButtonPress = useCallback(() => {
    audioCallRef?.current?.hidePopover();
    onPress(user);
  }, [audioCallRef, user, onPress]);

  useEffect(() => {
    if (!isSelected) {
      videoCallRef?.current?.hidePopover();
      audioCallRef?.current?.hidePopover();
    }
  }, [audioCallRef, videoCallRef, isSelected]);

  return (
    <ListItemBase
      itemIndex={index}
      isPadded
      interactive
      shape="isPilled"
      style={style}
      className={cssClasses}
      isSelected={isSelected}
      onPress={() => onPress(user)}
    >
      <ListItemBaseSection position="start">
        <AvatarNext title={user.name} size={32} src={imageUrl} />
      </ListItemBaseSection>
      <ListItemBaseSection position="fill">{user.name}</ListItemBaseSection>
      <ListItemBaseSection position="end">
        <Flex xgap=".5rem" className={sc('actions')}>
          <CallSelectPopover
            callables={callables}
            isVideo={false}
            ref={audioCallRef}
          >
            <ButtonCircle
              color="join"
              size={28}
              onPress={onAudioCallButtonPress}
              aria-label={t('makeAudioCallTo', { address: user.name })}
            >
              <Icon scale={18} name="handset" />
            </ButtonCircle>
          </CallSelectPopover>
          <CallSelectPopover callables={callables} isVideo ref={videoCallRef}>
            <ButtonCircle
              color="join"
              size={28}
              onPress={onVideoCallButtonPress}
              aria-label={t('makeVideoCallTo', { address: user.name })}
            >
              <Icon scale={18} name="video" />
            </ButtonCircle>
          </CallSelectPopover>
        </Flex>
      </ListItemBaseSection>
    </ListItemBase>
  );
};
