import React from 'react';
import {
  ButtonCircle,
  Flex,
  IconNext,
  ModalContainer,
  Overlay,
  Text,
} from '@momentum-ui/react-collaboration';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './ContactCardModal.styles.scss';
import useWebexClasses from '../../hooks/useWebexClasses';
import { ContactCard } from '../ContactCard';

type ContactCardModalProps = {
  user: IWebexIntContact;
  closeModal: () => void;
};

/**
 * When passed in a user, a fullscreen overlay will appear
 *
 * @param {ContactCardModalProps} props
 * @param props.user user to display in the modal
 * @param props.closeModal closes the modal
 * @returns {JSX.Element} React component
 */
export const ContactCardModal = ({
  user,
  closeModal,
}: ContactCardModalProps) => {
  const [cssClasses, sc] = useWebexClasses('contact-card-modal');

  return (
    <Overlay fullscreen>
      <ModalContainer
        className={cssClasses}
        color="primary"
        data-testid="webex-contact-card-modal"
      >
        <Flex className={sc('header')} alignItems="center">
          <Text type="body-compact" className={sc('header-text')}>
            Webex Calling
          </Text>
          <ButtonCircle
            className={sc('header-close')}
            size={32}
            onPress={() => closeModal()}
            ghost
            aria-label="close modal"
          >
            <IconNext autoScale={150} name="cancel" />
          </ButtonCircle>
        </Flex>
        <ContactCard user={user} />
      </ModalContainer>
    </Overlay>
  );
};
