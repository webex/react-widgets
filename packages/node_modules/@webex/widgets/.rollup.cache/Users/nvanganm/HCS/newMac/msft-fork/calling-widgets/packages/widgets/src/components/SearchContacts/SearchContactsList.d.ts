import React from 'react';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import './SearchContactsList.styles.scss';
declare type SearchContactsListProps = {
    searchValue: string;
    noContactsFoundMessage: string;
    onUserSelect?: (user: IWebexIntContact | undefined) => void;
    hideSource?: boolean;
    style?: React.CSSProperties;
};
/**
 *
 * @param root0
 * @param root0.style
 * @param root0.searchValue
 * @param root0.noContactsFoundMessage
 * @param root0.onSelectUser
 * @param root0.onUserSelect
 * @param root0.hideSource
 */
export declare const SearchContactsList: ({ searchValue, noContactsFoundMessage, onUserSelect, hideSource, style, }: SearchContactsListProps) => JSX.Element;
export {};
//# sourceMappingURL=SearchContactsList.d.ts.map