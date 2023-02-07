import React from 'react';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './WebexSearchContacts.styles.scss';
export interface IWebexSearchContactsProps {
    label?: string;
    noContactsFoundMessage?: string;
    style?: React.CSSProperties;
    minSearchLength?: number;
    onInputChange?: (input: string) => void;
    onUserSelect?: (user: IWebexIntContact | undefined) => void;
    onDropdownHide?: () => void;
    hideDropdownSource?: boolean;
}
export declare type WebexSearchContactsHandle = {
    appendValueToInput: (toAppend: string) => void;
};
/**
 * Description for this component.
 *
 * @param {IWebexSearchContactsProps} props Props for this component
 * @param props.style optional styles to add
 * @param props.label label to display in the search bar
 * @param props.noContactsFoundMessage text to output when no users are found
 * @param props.minSearchLength minimum text length required before searching
 * @param props.inputId id to make the search input
 */
export declare const WebexSearchContacts: React.ForwardRefExoticComponent<IWebexSearchContactsProps & React.RefAttributes<WebexSearchContactsHandle>>;
//# sourceMappingURL=WebexSearchContacts.d.ts.map