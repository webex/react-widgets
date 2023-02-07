import { FieldError } from 'react-hook-form';
import { Message } from '@momentum-ui/react-collaboration/dist/esm/components/InputMessage/InputMessage.types';
import { IFormData, ISelectItems } from './SpeedDialForm.types';
/**
 * Handles converting field error to message.
 *
 * @param {FieldError} e The field error message
 * @returns {Message} The field error to message
 */
export declare function fieldErrorToMessage(e: FieldError): Message;
/**
 * Phone Options is a list of phones for existing contact
 *
 * @param {IFormData} contact The contact phones to populate number select.
 * @returns {Array} An array of phone nubmers to select.
 */
export declare const getPhoneOptions: (contact: IFormData) => {
    key: string;
    value: string;
}[];
/**
 * Handles setting the correct properties on contact when creating new SpeedDial.
 *
 * @param {IFormData} data The speed dial contact
 * @returns {IFormData} Returns contact with correct call types.
 */
export declare const setPhoneOptions: (data: IFormData) => {
    id: string;
    displayName: string;
    status?: string | undefined;
    number?: string | undefined;
    callType?: string | undefined;
    phone?: string | undefined;
    phoneType?: string | undefined;
    currentCallAddress?: string | undefined;
    mail?: string | undefined;
    mobilePhone?: string | undefined;
    businessPhones?: string[] | undefined;
    surname?: string | undefined;
    givenName?: string | undefined;
    photo?: string | undefined;
};
/**
 * Get phone types for options select
 *
 * @param {array} types Array of strings
 * @returns {ISelectItems[]} array of select option items.
 */
export declare const getPhoneTypeOptions: (types: string[]) => ISelectItems[];
/**
 * Handle abbriviating last name.
 *
 * @param {string} name The display
 * @returns {string} Formatted first and last name.
 */
export declare function abbrDisplayName(name: string): string;
//# sourceMappingURL=SpeedDial.utils.d.ts.map