import {
  ButtonCircle,
  Flex, PopoverNext as Popover, Text
} from '@momentum-ui/react-collaboration';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { GenericModal } from './GenericModal';
import useWebexClasses from './hooks/useWebexClasses';
import './SpeedDialModal.styles.scss';

type ISpeedDialModalProps = {
  headerText?: string;
  isOpen?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
  handleEnterKeyPress?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isEdit?: boolean;
};

/**
 * When passed in a user, a fullscreen overlay will appear
 *
 * @param {ISpeedDialModalProps} props Component props
 * @param {string} props.headerText Header title for modal
 * @param {boolean} props.isOpen Open state of modal
 * @param {Function} props.onCancel Callback function when cancel pressed
 * @param {React.ReactNode} props.children The children
 * @returns {React.Component} React component
 */
export const SpeedDialModal = ({
  isOpen = true,
  onCancel = undefined,
  children = undefined,
  headerText,
  isEdit,
  handleEnterKeyPress = undefined
}: ISpeedDialModalProps) => {
  const [cssClasses, sc] = useWebexClasses('speed-dial-modal');
  const { t } = useTranslation('WebexSpeedDials');

  return (
    <GenericModal isOpen={isOpen} className={cssClasses}>
      <Flex className={sc('header')} direction="column">
        <Flex className={sc('header-text')}>
          <Text className='header-text' type="header-secondary">{t('webex.calling')}</Text>
          <ButtonCircle className='cancel-button' ghost onPress={onCancel} aria-label={t("voiceover.addSpeedDial.closeBtn")} onKeyDown={handleEnterKeyPress}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6.70705 6.00001L10.8536 1.85351C10.9 1.80708 10.9368 1.75197 10.9619 1.69131C10.987 1.63065 11 1.56564 11 1.49999C11 1.43433 10.987 1.36932 10.9619 1.30867C10.9368 1.24801 10.9 1.1929 10.8535 1.14648C10.8071 1.10005 10.752 1.06323 10.6913 1.0381C10.6307 1.01298 10.5657 1.00005 10.5 1.00005C10.4344 1.00005 10.3694 1.01299 10.3087 1.03811C10.248 1.06324 10.1929 1.10007 10.1465 1.14649L6.00001 5.29299L1.85351 1.14649C1.80718 1.09963 1.75205 1.0624 1.69128 1.03692C1.63051 1.01145 1.5653 0.998235 1.49941 0.998049C1.43351 0.997863 1.36823 1.0107 1.30732 1.03584C1.24641 1.06097 1.19106 1.09789 1.14447 1.14449C1.09788 1.19108 1.06095 1.24643 1.03583 1.30734C1.0107 1.36826 0.997859 1.43354 0.998049 1.49943C0.998238 1.56532 1.01145 1.63053 1.03693 1.6913C1.06241 1.75207 1.09965 1.8072 1.14651 1.85353L5.29301 6.00003L1.14651 10.1465C1.10008 10.1929 1.06326 10.2481 1.03813 10.3087C1.01301 10.3694 1.00008 10.4344 1.00008 10.5C1.00008 10.5657 1.01301 10.6307 1.03813 10.6914C1.06326 10.752 1.10008 10.8071 1.14651 10.8536C1.19293 10.9 1.24804 10.9368 1.3087 10.9619C1.36936 10.9871 1.43437 11 1.50002 11C1.56568 11 1.63069 10.9871 1.69134 10.9619C1.752 10.9368 1.80711 10.9 1.85354 10.8536L6.00004 6.70706L10.1465 10.8536C10.2403 10.9473 10.3675 11 10.5001 11C10.6326 11 10.7598 10.9473 10.8536 10.8536C10.9473 10.7598 11 10.6326 11 10.5C11 10.3674 10.9473 10.2403 10.8536 10.1465L6.70705 6.00001Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
          </svg>
          </ButtonCircle>
        </Flex>
        <Flex className={sc('subheader-text')}>
          <Text className='subheader-text' type="header-primary">{headerText}</Text>
          {/** No need this info toggletip as discussed with IVY **/}
          {/* <Popover
              color="primary"
              delay={[0, 0]}
              placement="bottom"
              showArrow={false}
              trigger="mouseenter"
              className="tooltip tooltip_adjust"
              triggerComponent={
                <div className={sc('subheader-icon')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M11.9062 6C11.9062 9.26193 9.26193 11.9062 6 11.9062C2.73807 11.9062 0.09375 9.26193 0.09375 6C0.09375 2.73807 2.73807 0.09375 6 0.09375C9.26193 0.09375 11.9062 2.73807 11.9062 6ZM5 5V10C5 10.5523 5.44772 11 6 11C6.55228 11 7 10.5523 7 10V5C7 4.44772 6.55228 4 6 4C5.44772 4 5 4.44772 5 5ZM6 3C6.55228 3 7 2.55228 7 2C7 1.44772 6.55228 1 6 1C5.44772 1 5 1.44772 5 2C5 2.55228 5.44772 3 6 3Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                    </svg>
                </div>
              }
              variant="small"
                >
                <p>{isEdit ? t('voiceover.editTextInfo') : t('addSpeedBanner.info.text')}</p>
            </Popover> */}
        </Flex>
      </Flex>
      <div className={sc('content')}>{children}</div>
    </GenericModal>
  );
};
