import {
  AvatarNext as Avatar,
  ButtonCircle,
  Flex, ListItemBase,
  ListItemBaseSection,
  Text
} from '@momentum-ui/react-collaboration';
import { IWebexVoicemail } from '@webex/component-adapter-interfaces/dist/esm/src';
import { formatPhoneNumberForAnnouncement, formatVoiceMailTimeDurationForAnnouncement } from '@webex/widget-call-history/src/utils/voiceOver';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './VoicemailItem.styles.scss';
import { VoicemailPlaybackControls } from './VoicemailPlaybackControls';
import useWebexClasses from './hooks/useWebexClasses';
import { removeBracketsAndContent } from './utils/avatarInitials';
import {
  formatDate,
  formatDateDDMMYYYY,
  formatDateForAnnouncement,
  formatTime,
  formatTimeToSupport24Hours
} from './utils/dateUtils';

export interface IVoicemailItemProps {
  voicemail: IWebexVoicemail;
  isSelected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  onRead?: () => void;
  voicemailSrc: string;
  voicemailSrcLoader?: boolean;
  useMakeAudioCall?:() => void;
  useMakeVideoCall?:() => void;
  itemIndex?: number;
  isLocaleGerman?: boolean;
}

export const VoicemailItem = ({
  voicemail,
  isSelected = false,
  onPress = () => {},
  onDelete = undefined,
  onRead = undefined,
  voicemailSrc,
  voicemailSrcLoader = false,
  useMakeAudioCall = undefined,
  useMakeVideoCall = undefined,
  itemIndex = undefined,
  isLocaleGerman
}: IVoicemailItemProps) => {
  const { t } = useTranslation('WebexVoicemail');
  let [unread, setUnread] = useState<boolean>(voicemail.unread);
  const prevVoicemail = useRef<IWebexVoicemail | null>(null);
  const [cssClasses, sc] = useWebexClasses('voicemail-item', undefined, {
    unread:voicemail.unread
  });
  const [isAnnouncePlayOrPause, setIsAnnouncePlayOrPause] = useState(false);
  const vmInitials = voicemail?.name ? removeBracketsAndContent(voicemail?.name) : removeBracketsAndContent(voicemail?.address);
  const playOrPause = isAnnouncePlayOrPause ? t('pauseVoicemail') : t('playVoicemail');
  const formattedDate = formatDateForAnnouncement(voicemail.date);
  const formattedTime = `${isLocaleGerman ? formatTimeToSupport24Hours(voicemail.date) : formatTime(voicemail.date)}`;

  const readVoicemail = useCallback(() => {
    if (onRead) {
      onRead();
    }
  }, [onRead]);

  const onClick = () => {
    // readVoicemail();
    onPress();
  };
  useEffect(() => {
    if (
      prevVoicemail.current &&
      prevVoicemail.current.unread === false &&
      voicemail.unread === true
    ) {
      setUnread(true);
    }
    prevVoicemail.current = voicemail;
  }, [voicemail]);

  useEffect(() => {
    if(voicemailSrc) {
      if(voicemail.unread) {
      setUnread(false);
      }
    }
  }, [voicemailSrc, voicemail.unread]);

  const playButtonRef = useRef<HTMLButtonElement>(null);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const audioButtonRef = useRef<HTMLButtonElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleAudioButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft' && trackRef.current) {
      event.preventDefault();
      event.stopPropagation();
      trackRef.current.focus();
    } else if (event.key === 'ArrowRight' && videoButtonRef.current) {
      event.preventDefault();
      event.stopPropagation();
      videoButtonRef.current.focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      //ListItemBase handle the focus movement for up and down arrow keys
      const listItem = audioButtonRef.current?.closest('[role="listitem"]');
      if (listItem) {
        const eventClone = new KeyboardEvent(event.type, {
          key: event.key,
          code: event.code,
          location: event.location,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
          repeat: event.repeat,
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          keyCode: event.keyCode,
          charCode: event.charCode,
          which: event.which,
        });
        listItem.dispatchEvent(eventClone);
      }
    }
  };

  return (
    <ListItemBase
      className={cssClasses}
      size={50}
      isPadded
      isSelected={isSelected}
      onPress={onClick}
      data-testid="voicemail-item"
      itemIndex={itemIndex}
      aria-label={`${unread ? t('unreadVoicemail') + ',' : ''} ${(voicemail.name)}, ${formatPhoneNumberForAnnouncement(voicemail.address)}, ${playOrPause}, ${(formatVoiceMailTimeDurationForAnnouncement(voicemail.duration as number))}, ${t('voicemailPlayButton')}, ${t('voicemailScrubbingBar')}, ${formattedDate}, ${formattedTime}, ${t('audioCallLabel')}, ${t('videoCallLabel')}, ${t('deleteVoicemail')}, ${t('voicemailFocusButton')}`}
    >
      <ListItemBaseSection position="fill">
        <Avatar initials={vmInitials} title={voicemail.name} size={32} className={sc('avatar')} />
        <Flex direction="column">
          <Text type="body-primary" className={sc('name')}>
            {voicemail.name}
          </Text>
          <Text 
            type="body-secondary" 
            className={`${sc('phone')} ${ voicemail?.name && voicemail?.address ?  sc('margin_adjust') : voicemail?.name === '' ? sc('font_adjust') : ''}`}
            >
            {voicemail.address}
          </Text>
        </Flex>
        <VoicemailPlaybackControls
          onPlay={readVoicemail}
          duration={voicemail.duration}
          audioSrc={voicemailSrc}
          audioSrcLoader={voicemailSrcLoader}
          setIsAnnouncePlayOrPause={setIsAnnouncePlayOrPause}
          voicemailName={voicemail.name}
          playButtonRef={playButtonRef}
          pauseButtonRef={pauseButtonRef}
          audioButtonRef={audioButtonRef}
          trackRef={trackRef}
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
              {isLocaleGerman ? formatDateDDMMYYYY(voicemail.date) : formatDate(voicemail.date)}
            </Text>
            <Text
              type="body-secondary"
              className={`${sc('time')} ${sc('margin_adjust')} chromatic-ignore`}
            >
              {isLocaleGerman ? formatTimeToSupport24Hours(voicemail.date) : formatTime(voicemail.date)}
            </Text>
          </Flex>
          <Flex xgap=".5rem" className={sc('actions')}>
            <ButtonCircle
              size={32}
              color="join"
              onPress={useMakeAudioCall}
              title={t('audioCallLabel')}
              disabled={voicemail?.address === '' ? true : false}
              data-testid='make-audio-call'
              ref={audioButtonRef}
              onKeyDown={handleAudioButtonKeyDown}
              aria-label={t('audioCallLabel')}
            >
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4528 9.88166L11.9616 8.38851C11.7886 8.21573 11.5833 8.07873 11.3573 7.98536C11.1313 7.89199 10.8891 7.84407 10.6446 7.84434C10.4001 7.84461 10.158 7.89306 9.93227 7.98693C9.70649 8.0808 9.50143 8.21825 9.3288 8.39141C9.3288 8.39141 8.6848 9.04706 8.4123 9.32236C7.43023 9.28791 6.49785 8.88201 5.8035 8.18665C5.10916 7.4913 4.70461 6.55832 4.6716 5.57621C4.9466 5.30336 5.6013 4.65896 5.6042 4.65621C5.95237 4.30645 6.14783 3.83304 6.14783 3.33953C6.14783 2.84603 5.95237 2.37261 5.6042 2.02286L4.1125 0.529506C3.75723 0.189672 3.28456 0 2.79292 0C2.30129 0 1.82862 0.189672 1.47335 0.529506L0.675999 1.32746C-0.400651 2.40501 -0.654001 6.17746 3.5788 10.4161C5.85325 12.6935 7.8596 13.5286 9.1428 13.8278C9.60751 13.9391 10.0834 13.997 10.5612 14.0004C11.3207 14.0535 12.0711 13.8106 12.6555 13.3228L13.4528 12.525C13.8026 12.1741 13.999 11.6988 13.999 11.2033C13.999 10.7079 13.8026 10.2326 13.4528 9.88166ZM12.7458 11.8167L11.9484 12.615C11.6208 12.9431 10.674 13.1568 9.36935 12.8531C8.2136 12.5831 6.3933 11.8186 4.28585 9.70836C0.523149 5.94046 0.682849 2.73651 1.383 2.03541L2.1804 1.23746C2.26075 1.15688 2.35622 1.09295 2.46132 1.04933C2.56642 1.0057 2.6791 0.98325 2.7929 0.98325C2.9067 0.98325 3.01937 1.0057 3.12448 1.04933C3.22958 1.09295 3.32505 1.15688 3.4054 1.23746L4.8971 2.73066C5.05766 2.89176 5.14806 3.10978 5.1486 3.33723C5.14914 3.56469 5.05979 3.78314 4.9 3.94501C4.9 3.94501 4.085 4.74686 3.8873 4.94501C3.38585 5.44861 3.79405 7.59056 5.0973 8.89551C6.401 10.2015 8.5416 10.6117 9.0431 10.1071C9.24035 9.91006 10.0387 9.09646 10.0387 9.09646C10.2 8.93538 10.4186 8.8449 10.6466 8.8449C10.8746 8.8449 11.0932 8.93538 11.2545 9.09646L12.7457 10.5897C12.908 10.7526 12.9992 10.9732 12.9992 11.2032C12.9992 11.4332 12.9081 11.6537 12.7458 11.8167Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </ButtonCircle>
            <ButtonCircle
              size={32}
              color="join"
              onPress={useMakeVideoCall}
              title={t('videoCallLabel')}
              disabled={voicemail?.address === '' ? true : false}
              data-testid='make-video-call'
              ref={videoButtonRef}
              aria-label={t('videoCallLabel')}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5259 2.64929C13.381 2.55925 13.2155 2.50792 13.0451 2.50022C12.8748 2.49253 12.7053 2.52873 12.5529 2.60535C12.5376 2.61316 12.5227 2.62146 12.508 2.63074L11.0012 3.58911V3.00037C11.0004 2.33756 10.7368 1.70213 10.2681 1.23346C9.79942 0.764788 9.16399 0.501146 8.50119 0.500366H2.50119C1.83839 0.501146 1.20296 0.764788 0.734284 1.23346C0.265612 1.70213 0.00196959 2.33756 0.00119019 3.00037V9.00037C0.00196827 9.66317 0.26561 10.2986 0.734283 10.7673C1.20296 11.2359 1.83839 11.4996 2.50119 11.5004H8.50119C9.16399 11.4996 9.79943 11.2359 10.2681 10.7673C10.7368 10.2986 11.0004 9.66317 11.0012 9.00037V8.41132L12.508 9.36904C12.5224 9.37832 12.5373 9.38662 12.5525 9.39443C12.7049 9.47074 12.8743 9.50681 13.0446 9.49922C13.2149 9.49162 13.3805 9.4406 13.5255 9.35102C13.6705 9.26144 13.7903 9.13626 13.8733 8.98738C13.9563 8.8385 13.9999 8.67086 14 8.50039V3.49989C14.0006 3.32934 13.9573 3.1615 13.8742 3.01253C13.7912 2.86356 13.6712 2.73847 13.5259 2.64929ZM10.0012 9.00037C10.0008 9.39806 9.84258 9.77934 9.56137 10.0605C9.28016 10.3418 8.89888 10.4999 8.50119 10.5004H2.50119C2.1035 10.4999 1.72222 10.3418 1.44101 10.0605C1.1598 9.77934 1.00162 9.39806 1.00119 9.00037V3.00037C1.00162 2.60267 1.1598 2.2214 1.44101 1.94019C1.72222 1.65898 2.1035 1.5008 2.50119 1.50037H8.50119C8.89888 1.5008 9.28016 1.65898 9.56137 1.94019C9.84258 2.2214 10.0008 2.60267 10.0012 3.00037V9.00037ZM11.0012 7.2265V4.77411L13 3.50281L13.0002 8.49695L11.0012 7.2265Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </ButtonCircle>
            {onDelete && (
              <ButtonCircle 
               size={32} 
               outline 
               onPress={onDelete}  
               data-testid="delete-button"
               title={t('deleteVoicemail')}
               aria-label={t('deleteVoicemail')}
               >
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.9998 3.99988H0.999306C0.858683 3.99991 0.719649 4.0296 0.591274 4.087C0.4629 4.14439 0.348072 4.22822 0.254284 4.333C0.160495 4.43777 0.0898545 4.56115 0.0469714 4.69508C0.0040883 4.829 -0.0100734 4.97046 0.00541074 5.11023L0.746131 11.7762C0.813563 12.3879 1.10444 12.9531 1.56297 13.3634C2.02151 13.7738 2.6154 14.0004 3.23075 13.9999H6.76835C7.3837 14.0004 7.9776 13.7738 8.43613 13.3634C8.89466 12.9531 9.18554 12.3879 9.25297 11.7762L9.99347 5.11023C10.0091 4.97046 9.99498 4.82898 9.95215 4.69503C9.90932 4.56108 9.8387 4.43767 9.74492 4.33287C9.65114 4.22807 9.5363 4.14425 9.4079 4.08687C9.27951 4.02949 9.14043 3.99984 8.9998 3.99988ZM8.2593 11.6659C8.21871 12.0328 8.04411 12.3719 7.76897 12.6181C7.49384 12.8642 7.13752 13.0002 6.76833 12.9999H3.23073C2.86154 13.0002 2.50523 12.8642 2.23009 12.6181C1.95495 12.3719 1.78035 12.0328 1.73977 11.6659L0.999266 4.99988H8.99977L8.2593 11.6659Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                    <path d="M0.500041 2.99988H9.50004C9.63265 2.99988 9.75983 2.9472 9.85359 2.85343C9.94736 2.75966 10 2.63249 10 2.49988C10 2.36727 9.94736 2.24009 9.85359 2.14632C9.75983 2.05256 9.63265 1.99988 9.50004 1.99988H7.50004V1.49988C7.49961 1.10219 7.34143 0.720908 7.06022 0.439697C6.77901 0.158487 6.39773 0.000312028 6.00004 -0.00012207H4.00004C3.60235 0.000312028 3.22107 0.158487 2.93986 0.439697C2.65865 0.720908 2.50047 1.10219 2.50004 1.49988V1.99988H0.500041C0.367433 1.99988 0.240255 2.05256 0.146487 2.14632C0.052719 2.24009 4.07694e-05 2.36727 4.07694e-05 2.49988C4.07694e-05 2.63249 0.052719 2.75966 0.146487 2.85343C0.240255 2.9472 0.367433 2.99988 0.500041 2.99988ZM3.50004 1.49988C3.50017 1.36731 3.55289 1.24021 3.64663 1.14647C3.74037 1.05273 3.86747 1.00001 4.00004 0.999878H6.00004C6.13261 1.00001 6.25971 1.05273 6.35345 1.14647C6.44719 1.24021 6.49991 1.36731 6.50004 1.49988V1.99988H3.50004V1.49988Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                </svg>
              </ButtonCircle>
            )}
          </Flex>
        </div>
        <div className={sc('unread-bubble')} role="img" aria-label={t('unreadVoicemail')} />
      </ListItemBaseSection>
    </ListItemBase>
  );
};