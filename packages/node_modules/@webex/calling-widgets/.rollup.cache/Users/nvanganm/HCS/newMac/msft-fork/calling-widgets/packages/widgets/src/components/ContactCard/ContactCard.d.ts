import React from 'react';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './ContactCard.styles.scss';
declare type Props = {
    style?: React.CSSProperties;
    user: IWebexIntContact;
    noCallableAddressMessage?: string;
};
/**
 * Description for this component.
 *
 * @param {Props} props Props for this component
 * @param props.style optional styles to add
 * @param props.user user to display call options for
 * @param props.onSelect callback function to call when the selection is updated.  It is called once at component mount with the default value
 * @param props.noCallableAddressMessage message to display when there is no callable entry for a user
 * @returns Contact card react component
 */
export declare const ContactCard: ({ user, style, noCallableAddressMessage, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=ContactCard.d.ts.map