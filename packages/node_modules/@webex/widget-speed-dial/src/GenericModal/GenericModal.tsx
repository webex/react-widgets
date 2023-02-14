import React from 'react';
import { ModalContainer, Overlay } from '@momentum-ui/react-collaboration';

import useWebexClasses from '../hooks/useWebexClasses';
import './GenericModal.styles.scss';

type IGenericModalProps = {
  isOpen?: boolean;
  isRound?: boolean;
  children?: React.ReactNode;
  className?: string;
};

/**
 * @description The summary of this component.
 * @param {IGenericModalProps} props Component props
 * @param {boolean} props.isOpen The open state
 * @param {boolean} props.isRound The round edgets
 * @param {React.ReactNode} props.children The children
 * @param {string} props.className Custom class names
 * @returns {React.Component} React component
 */
export const GenericModal = ({
  isOpen = false,
  isRound = false,
  children = undefined,
  className = undefined,
}: IGenericModalProps) => {
  const [cssClasses, sc] = useWebexClasses('generic-modal');
  return (
    <div className={`${cssClasses} ${className}`}>
      {isOpen && (
        <Overlay fullscreen className={sc('overlay')} color="primary">
          <ModalContainer
            className={sc('container')}
            round={isRound ? 50 : 0}
            elevation={4}
            isPadded
          >
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </div>
  );
};
