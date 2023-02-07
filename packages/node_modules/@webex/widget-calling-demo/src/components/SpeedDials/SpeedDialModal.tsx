import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  ButtonCircle,
  Flex,
  IconNext,
  Text,
} from '@momentum-ui/react-collaboration';

import useWebexClasses from '../../hooks/useWebexClasses';
import { GenericModal } from '../GenericModal';
import './SpeedDialModal.styles.scss';

type ISpeedDialModalProps = {
  headerText?: string;
  isOpen?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
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
  headerText = 'Add a speed dial',
  isOpen = true,
  onCancel = undefined,
  children = undefined,
}: ISpeedDialModalProps) => {
  const [cssClasses, sc] = useWebexClasses('speed-dial-modal');
  const { t } = useTranslation('WebexSpeedDials');

  return (
    <GenericModal isOpen={isOpen} className={cssClasses}>
      <Flex className={sc('header')} direction="column">
        <Flex className={sc('header-text')}>
          <Text type="header-secondary">{t('webex.calling')}</Text>
          <ButtonCircle ghost onPress={onCancel}>
            <IconNext name="cancel" scale={22} />
          </ButtonCircle>
        </Flex>
        <Flex className={sc('subheader-text')}>
          <Text type="header-primary">{headerText}</Text>
        </Flex>
      </Flex>
      <div className={sc('content')}>{children}</div>
    </GenericModal>
  );
};
