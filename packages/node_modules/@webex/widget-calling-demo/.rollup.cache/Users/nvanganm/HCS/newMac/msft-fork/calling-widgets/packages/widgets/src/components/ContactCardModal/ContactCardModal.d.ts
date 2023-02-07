/// <reference types="react" />
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './ContactCardModal.styles.scss';
declare type ContactCardModalProps = {
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
export declare const ContactCardModal: ({ user, closeModal, }: ContactCardModalProps) => JSX.Element;
export {};
//# sourceMappingURL=ContactCardModal.d.ts.map