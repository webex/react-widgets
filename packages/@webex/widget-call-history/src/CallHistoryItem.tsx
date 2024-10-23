import {
  AvatarNext as Avatar,
  ButtonCircle,
  Flex, ListItemBase,
  ListItemBaseSection,
  Text
} from '@momentum-ui/react-collaboration';
import React from 'react';

import { useTranslation } from 'react-i18next';
import './CallHistoryItem.styles.scss';
import { ICallHistoryItemProps } from './CallHistoryItem.types';
import useWebexClasses from './hooks/useWebexClasses';
import {
  removeBracketsAndContent,
  titleCase
} from './utils/avatarInitials';
import {
  formatDate,
  formatDateDDMMYYYY,
  formatDateForAnnouncement,
  formatDurationFromSeconds,
  formatTime,
  formatTimeToSupport24Hours
} from './utils/dateUtils';
import {
  formatDurationForAnnouncement,
  formatPhoneNumberForAnnouncement
} from './utils/voiceOver';


/**
 * @description CallHistoryItem renders a individual call history item.
 * @param {object} param An object parameter
 * @param {string} param.id The id of the item
 * @param {number} param.itemIndex The index of the item
 * @param {string} param.name The name of the item
 * @param {string} param.startTime The startTime of the item
 * @param {string} param.endTime The endTime of the item
 * @param {string} param.phoneNumber The phone number of the item
 * @param {string} param.disposition The disposition of the item
 * @param {string} param.direction The direction of the item
 * @param {string} param.callbackAddress The address of the item call address
 * @param {string} param.missedCallText The text for the missed call label
 * @param {boolean} param.isSelected The selected state of the item
 * @param {Function} param.onPress Handle when item is pressed
 * @param {Function} param.onVideoCallPress Handle when item video call button is pressed
 * @param param.audioCallLabel
 * @param param.videoCallLabel
 * @param {Function} param.onAudioCallPress Handle when item audio call button is pressed
 * @returns {React.Component} A CallHistoryItem for rendering
 */
export const CallHistoryItem = ({
  id,
  name,
  itemIndex = undefined,
  startTime,
  endTime,
  phoneNumber,
  callbackAddress = undefined,
  onPress = undefined,
  direction = undefined,
  disposition = undefined,
  isSelected = false,
  missedCallText = 'Missed call',
  audioCallLabel = 'Make an audio call',
  videoCallLabel = 'Make a video call',
  durationSeconds,
  makeCall,
  callingSpecific = undefined,
  isLocaleGerman,
  dismissBagdeonClickRow
}: ICallHistoryItemProps) => {
  const { t } = useTranslation('WebexCallHistory');
  const isMissed = disposition?.toLowerCase() === 'missed';
  const isOutgoing = direction?.toLowerCase() === 'outgoing';
  const duration = formatDurationFromSeconds(durationSeconds ? durationSeconds : 0);
  const chTitle = name ? name : phoneNumber;
  const chInitials = name ? removeBracketsAndContent(name) : removeBracketsAndContent(phoneNumber);
  const recentCallsLabel = 'Recent calls'

  const [cssClasses, sc] = useWebexClasses('call-history-item', undefined, {
    'is-missed': isMissed,
    'is-outgoing': isOutgoing,
    'is-selected': isSelected as boolean,
  });

  const handleAudioPress = () => {
    if (makeCall) {
    makeCall(callbackAddress || id, false, recentCallsLabel);
    }
    if(dismissBagdeonClickRow) {
    dismissBagdeonClickRow();
    }
  };
    
  const handleVideoPress = () => {
    if (makeCall) {
    makeCall(callbackAddress || id, true, recentCallsLabel);
    }
    if(dismissBagdeonClickRow) {
    dismissBagdeonClickRow();
    }
  };

  return (
    <ListItemBase
      id={id}
      itemIndex={itemIndex}
      size={50}
      isPadded
      isSelected={isSelected}
      className={cssClasses}
      onPress={onPress}
      data-testid="call-history-item"
      aria-label={`${(name)}, ${(phoneNumber && formatPhoneNumberForAnnouncement(phoneNumber))}, ${(callingSpecific ? callingSpecific + ',' : '')} ${isOutgoing ? t('outGoingCallText') : isMissed ? t('missedCallText') : t('incomingCallText')}, ${(formatDurationForAnnouncement(durationSeconds as number))}, ${(formatDateForAnnouncement(startTime))}, ${(startTime && isLocaleGerman ? formatTimeToSupport24Hours(startTime) : formatTime(startTime))}, ${t('recentCallsFocusButton')}`}
    >
      <ListItemBaseSection position="start" className={sc('icon')}>
        <Avatar initials={chInitials} title={chTitle} size={32} />
      </ListItemBaseSection>
      <ListItemBaseSection position="fill" className={sc('content')}>
        <Flex>
          <Flex direction="column" className={sc('content-wrap')}>
            <div title={titleCase(name) + " " + (name === phoneNumber ? '' : phoneNumber)}>
              <Text type="body-primary" className={sc('name')}>
                {name}
              </Text>
            </div>
            {!(callingSpecific && name) &&
              <div title={phoneNumber} className={`${(name && phoneNumber) ? sc('margin_adjust') : ''}`}>
              <Text 
                type={`${(phoneNumber && callingSpecific) ? "body-primary" : "body-secondary"}`}
                className={`${sc('phoneNumber')} ${name === '' ? sc('font_adjust') : ''} ${(phoneNumber && callingSpecific) ? sc('margin_zero') : ''}`}
                >
                {phoneNumber}
              </Text>
              </div>
            }
            {(callingSpecific && (name || phoneNumber)) &&
              <div className={`${(name || phoneNumber) && callingSpecific ? sc('margin_adjust') : ''}`}>
                <Text
                type="body-secondary" 
                className={`${sc('phoneNumber')}`}
                >
                {callingSpecific}
              </Text>
              </div>
              }
            </Flex>
          <Flex
            justifyContent="flex-start"
            xgap=".2rem"
            alignItems="center"
            className={sc('direction')}
          >
            {isOutgoing && (
              <Flex justifyContent="center" alignItems="flex-end" xgap="1rem">
                <svg  role="img" aria-label={t('outGoingCallText')} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4999 0.000183131H9.49991C9.3673 0.000183131 9.24012 0.0528615 9.14635 0.14663C9.05258 0.240398 8.99991 0.367575 8.99991 0.500183C8.99991 0.632791 9.05258 0.759968 9.14635 0.853736C9.24012 0.947505 9.3673 1.00018 9.49991 1.00018H12.2917L8.14639 5.14668C8.09997 5.19311 8.06314 5.24822 8.03802 5.30888C8.0129 5.36954 7.99997 5.43455 7.99997 5.5002C7.99997 5.56586 8.0129 5.63087 8.03803 5.69152C8.06315 5.75218 8.09998 5.80729 8.14641 5.85371C8.19283 5.90014 8.24795 5.93696 8.3086 5.96208C8.36926 5.98721 8.43427 6.00014 8.49992 6.00014C8.56558 6.00013 8.63059 5.9872 8.69124 5.96208C8.7519 5.93695 8.80701 5.90012 8.85344 5.8537L12.9999 1.70599V4.50018C12.9999 4.63279 13.0526 4.75997 13.1464 4.85374C13.2402 4.9475 13.3673 5.00018 13.4999 5.00018C13.6325 5.00018 13.7597 4.9475 13.8535 4.85374C13.9473 4.75997 13.9999 4.63279 13.9999 4.50018V0.500183C14 0.434515 13.987 0.369487 13.9619 0.308814C13.9368 0.248142 13.9 0.193014 13.8535 0.146581C13.8071 0.100148 13.752 0.0633195 13.6913 0.0381999C13.6306 0.0130804 13.5656 0.00016211 13.4999 0.000183131Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                  <path d="M11.1057 8.75773C10.9423 8.59463 10.7484 8.46531 10.535 8.37718C10.3216 8.28905 10.093 8.24383 9.86209 8.2441C9.63121 8.24438 9.40265 8.29014 9.18947 8.37877C8.97629 8.46741 8.78266 8.59718 8.61965 8.76067C8.61965 8.76067 8.04123 9.35012 7.78378 9.60987C6.8929 9.57306 6.0485 9.20236 5.41844 8.57146C4.78838 7.94056 4.41879 7.09567 4.38316 6.20474C4.64306 5.94695 5.23124 5.36777 5.23416 5.36483C5.56357 5.03494 5.74858 4.5878 5.74858 4.1216C5.74858 3.65541 5.56357 3.20827 5.23416 2.87837L3.85701 1.49937C3.52147 1.17866 3.07518 0.999685 2.61103 0.999685C2.14687 0.999685 1.70059 1.17866 1.36505 1.49937L0.628846 2.23658C-0.375064 3.24134 -0.618844 6.75164 3.30938 10.6851C5.80916 13.1887 8.13796 13.9997 9.75988 13.9997C10.4782 14.0499 11.1886 13.8246 11.7467 13.3697L12.4829 12.6325C12.8135 12.3015 12.9993 11.8527 12.9993 11.3848C12.9993 10.917 12.8135 10.4682 12.4829 10.1372L11.1057 8.75773ZM11.7755 11.9241L11.0393 12.6427C10.3998 13.2816 7.47161 13.4176 4.01677 9.95815C0.561436 6.49824 0.697241 3.58474 1.33623 2.9449L2.07244 2.22369C2.14309 2.15283 2.22704 2.09661 2.31946 2.05825C2.41188 2.01989 2.51097 2.00014 2.61104 2.00014C2.7111 2.00014 2.81019 2.01989 2.90261 2.05825C2.99503 2.09661 3.07898 2.15283 3.14964 2.22369L4.52679 3.58669C4.66799 3.72814 4.74754 3.91967 4.74808 4.11953C4.74863 4.31939 4.67014 4.51136 4.52972 4.65358C4.52972 4.65358 3.7769 5.39467 3.59422 5.57762C2.94253 6.23212 3.82822 8.39575 4.71196 9.28066C5.29272 9.84613 6.00792 10.2544 6.79015 10.4669C7.24545 10.5916 8.06129 10.7487 8.41058 10.3994C8.59231 10.2174 9.32998 9.46655 9.32998 9.46606C9.47179 9.32463 9.6639 9.2452 9.86418 9.2452C10.0645 9.2452 10.2566 9.32463 10.3984 9.46606L11.7755 10.8455C11.9185 10.9886 11.9988 11.1826 11.9988 11.3848C11.9988 11.5871 11.9185 11.7811 11.7755 11.9241Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                </svg>
              </Flex>
            )}
            {isMissed && (
              <Text type="body-secondary" className={sc('duration')}>
                {t('missedCallText')}
              </Text>
            )}
            {!isMissed && (
              <Text 
                type="body-secondary" 
                className={sc('duration')}
                >
                {duration}
              </Text>
            )}
          </Flex>
        </Flex>
      </ListItemBaseSection>
      <ListItemBaseSection
        position="end"
        className={`chromatic-ignore ${sc('meta')}`}
      >
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          className={sc('meta')}
        >
          <Flex xgap=".5rem" className={sc('actions')}>
            <ButtonCircle
              size={32}
              color="join"
              className={sc('audio-btn')}
              title={t('audioCallLabel')}
              onPress={handleAudioPress}
              data-testid='make-audio-call'
              aria-label={t('audioCallLabel')}
            >
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4484 10.8767L11.9572 9.38345C11.7842 9.21066 11.5788 9.07367 11.3528 8.98029C11.1269 8.88692 10.8847 8.839 10.6402 8.83927C10.3957 8.83955 10.1536 8.88801 9.92784 8.98189C9.70206 9.07577 9.49701 9.21323 9.32439 9.3864C9.32439 9.3864 8.68034 10.0421 8.40789 10.3173C7.42591 10.2829 6.49359 9.87702 5.79926 9.18177C5.10492 8.48652 4.7003 7.55368 4.66714 6.57165C4.94109 6.29885 5.59634 5.65395 5.59929 5.651C5.94824 5.30167 6.14424 4.82811 6.14424 4.33435C6.14424 3.8406 5.94824 3.36703 5.59929 3.0177L4.10809 1.5245C3.75283 1.18467 3.28015 0.994995 2.78852 0.994995C2.29688 0.994995 1.82421 1.18467 1.46894 1.5245L0.671541 2.32245C-0.404459 3.4 -0.658509 7.17255 3.57439 11.4116C5.84879 13.689 7.85514 14.524 9.13834 14.8233C9.60308 14.9344 10.079 14.9921 10.5568 14.9954C11.3162 15.0486 12.0668 14.8058 12.651 14.3177L13.4484 13.52C13.7982 13.1691 13.9946 12.6938 13.9946 12.1983C13.9946 11.7029 13.7982 11.2276 13.4484 10.8767V10.8767ZM12.7414 12.8117L11.944 13.61C11.6169 13.9376 10.6706 14.1527 9.36494 13.8481C8.20914 13.5781 6.38884 12.814 4.28144 10.7038C0.518742 6.93545 0.678391 3.7315 1.37859 3.0304L2.17594 2.23245C2.34089 2.07481 2.56027 1.98683 2.78844 1.98683C3.01661 1.98683 3.23599 2.07481 3.40094 2.23245L4.89214 3.72565C5.05298 3.88663 5.14358 4.10473 5.14413 4.33229C5.14468 4.55986 5.05515 4.77839 4.89509 4.94015C4.89509 4.94015 4.08009 5.74195 3.88384 5.9395C3.80279 6.03552 3.74184 6.14683 3.7046 6.26684C3.66736 6.38685 3.65459 6.51312 3.66704 6.63815C3.73085 7.85961 4.23777 9.01592 5.09284 9.8905C6.39654 11.1964 8.53719 11.6061 9.03864 11.1021C9.23544 10.905 10.0336 10.0921 10.0342 10.0915C10.1956 9.93037 10.4142 9.8399 10.6422 9.8399C10.8701 9.8399 11.0888 9.93037 11.2501 10.0915L12.7413 11.5846C12.9036 11.7476 12.9947 11.9682 12.9948 12.1982C12.9948 12.4282 12.9037 12.6488 12.7414 12.8118V12.8117Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </ButtonCircle>
            <ButtonCircle
              size={32}
              color="join"
              className={sc('video-btn')}
              title={t('videoCallLabel')}
              onPress={handleVideoPress}
              data-testid='make-video-call'
              aria-label={t('videoCallLabel')}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5259 2.64929C13.381 2.55925 13.2155 2.50792 13.0451 2.50022C12.8748 2.49253 12.7053 2.52873 12.5529 2.60535C12.5376 2.61316 12.5227 2.62146 12.508 2.63074L11.0012 3.58911V3.00037C11.0004 2.33756 10.7368 1.70213 10.2681 1.23346C9.79942 0.764788 9.16399 0.501146 8.50119 0.500366H2.50119C1.83839 0.501146 1.20296 0.764788 0.734284 1.23346C0.265612 1.70213 0.00196959 2.33756 0.00119019 3.00037V9.00037C0.00196827 9.66317 0.26561 10.2986 0.734283 10.7673C1.20296 11.2359 1.83839 11.4996 2.50119 11.5004H8.50119C9.16399 11.4996 9.79943 11.2359 10.2681 10.7673C10.7368 10.2986 11.0004 9.66317 11.0012 9.00037V8.41132L12.508 9.36904C12.5224 9.37832 12.5373 9.38662 12.5525 9.39443C12.7049 9.47074 12.8743 9.50681 13.0446 9.49922C13.2149 9.49162 13.3805 9.4406 13.5255 9.35102C13.6705 9.26144 13.7903 9.13626 13.8733 8.98738C13.9563 8.8385 13.9999 8.67086 14 8.50039V3.49989C14.0006 3.32934 13.9573 3.1615 13.8742 3.01253C13.7912 2.86356 13.6712 2.73847 13.5259 2.64929ZM10.0012 9.00037C10.0008 9.39806 9.84258 9.77934 9.56137 10.0605C9.28016 10.3418 8.89888 10.4999 8.50119 10.5004H2.50119C2.1035 10.4999 1.72222 10.3418 1.44101 10.0605C1.1598 9.77934 1.00162 9.39806 1.00119 9.00037V3.00037C1.00162 2.60267 1.1598 2.2214 1.44101 1.94019C1.72222 1.65898 2.1035 1.5008 2.50119 1.50037H8.50119C8.89888 1.5008 9.28016 1.65898 9.56137 1.94019C9.84258 2.2214 10.0008 2.60267 10.0012 3.00037V9.00037ZM11.0012 7.2265V4.77411L13 3.50281L13.0002 8.49695L11.0012 7.2265Z" fill="white" fillOpacity="0.95"/>
              </svg> 
            </ButtonCircle>
          </Flex>
          <Flex
            direction="column"
            alignContent="flex-end"
            alignItems="flex-end"
            className={sc('datetime')}
          >
            <Text type="body-secondary" className={sc('date')}>
              {startTime && isLocaleGerman ? formatDateDDMMYYYY(startTime) : formatDate(startTime)}
            </Text>
            <Text type="body-secondary" className={`${sc('time')} ${sc('margin_adjust')}`}>
              {startTime && isLocaleGerman ? formatTimeToSupport24Hours(startTime) : formatTime(startTime)}
            </Text>
          </Flex>
        </Flex>
      </ListItemBaseSection>
    </ListItemBase>
  );
};