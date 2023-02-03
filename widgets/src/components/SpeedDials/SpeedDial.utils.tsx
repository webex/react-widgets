import { FieldError } from 'react-hook-form';
import { Message } from '@momentum-ui/react-collaboration/dist/esm/components/InputMessage/InputMessage.types';
import { IFormData, ISelectItems } from './SpeedDialForm.types';

/**
 * Handles converting field error to message.
 *
 * @param {FieldError} e The field error message
 * @returns {Message} The field error to message
 */
export function fieldErrorToMessage(e: FieldError): Message {
  return { message: e.message as string, level: 'error' };
}

/**
 * Phone Options is a list of phones for existing contact
 *
 * @param {IFormData} contact The contact phones to populate number select.
 * @returns {Array} An array of phone nubmers to select.
 */
export const getPhoneOptions = (contact: IFormData) => {
  const items = [];
  if (contact.mobilePhone) {
    items.push({
      key: contact.mobilePhone,
      value: `Mobile: ${contact.mobilePhone}`,
    });
  }
  if (contact.mail) {
    items.push({
      key: contact.mail,
      value: `Mail: ${contact.mail}`,
    });
  }
  if (contact.businessPhones) {
    contact.businessPhones.forEach((n) => {
      items.push({
        key: n,
        value: `Work: ${n}`,
      });
    });
  }
  return items;
};

/**
 * Handles setting the correct properties on contact when creating new SpeedDial.
 *
 * @param {IFormData} data The speed dial contact
 * @returns {IFormData} Returns contact with correct call types.
 */
export const setPhoneOptions = (data: IFormData) => {
  const contact = { ...data };
  if (!contact.callType) {
    contact.callType = 'handset';
  }
  if (contact.phoneType === 'work' && contact.phone) {
    contact.businessPhones = contact.businessPhones || [];
    contact.businessPhones.push(contact.phone);
  }
  if (contact.phoneType === 'mobile' && contact.phone) {
    contact.mobilePhone = contact.phone;
  }

  return contact;
};

/**
 * Get phone types for options select
 *
 * @param {array} types Array of strings
 * @returns {ISelectItems[]} array of select option items.
 */
export const getPhoneTypeOptions = (types: string[]): ISelectItems[] =>
  [...types].map((type: string) => ({
    id: type.toLowerCase(),
    value: type,
  }));

/**
 * Handle abbriviating last name.
 *
 * @param {string} name The display
 * @returns {string} Formatted first and last name.
 */
export function abbrDisplayName(name: string): string {
  const names: string[] = name.split(/\s+/);
  // Replaces the first name with an initial, followed by a period.
  names[1] = `${names[1].substr(0, 1)}.`;
  // Glue the pieces back together.
  return names.join(' ');
}
