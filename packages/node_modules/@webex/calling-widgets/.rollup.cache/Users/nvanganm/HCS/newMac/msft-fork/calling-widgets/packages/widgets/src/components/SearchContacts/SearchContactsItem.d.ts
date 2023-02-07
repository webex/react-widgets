import React from 'react';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './SearchContactsItem.scss';
declare type SearchContactsItemProps = {
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
export declare const SearchContactsItem: ({ user, index, onPress, isSelected, style, }: SearchContactsItemProps) => JSX.Element;
export {};
//# sourceMappingURL=SearchContactsItem.d.ts.map