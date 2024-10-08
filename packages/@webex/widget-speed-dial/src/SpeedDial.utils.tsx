import { Message } from '@momentum-ui/react-collaboration/dist/esm/components/InputMessage/InputMessage.types';
import { FieldError } from 'react-hook-form';
import { IFormData, ISelectItems, PhoneType, PhoneValueTypes } from './SpeedDialForm.types';

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



  if (contact.emailAddresses) {
    items.push({
      key: contact.emailAddresses[0].type,
      value: PhoneValueTypes.MAIL+`: ${contact.emailAddresses[0].address}`,
    });
  }

  if (contact.phoneNumbers) {
    contact.phoneNumbers?.forEach((n: any) => {
      if (n.type === PhoneType.WORK) {
        items.push({
          key: n.type,
          value: PhoneValueTypes.WORK +`: ${n.address}`,
        });
      }
      else if (n.type === PhoneType.MOBILE) {
        items.push({
          key: n.type,
          value: PhoneValueTypes.MOBILE+`: ${n.address}`,
        });
      }
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
    contact.callType = PhoneType.HANDSET;
  }
  
  if (contact.phoneNumbers) {
    contact.phoneNumbers?.forEach((n: any) => {
      if (n.type === PhoneType.WORK) {
        contact.businessPhones = contact.businessPhones || []
        contact.businessPhones.push(n.address);
      }
      else if (n.type === PhoneType.MOBILE) {
        contact.mobilePhone = n.address;
      }
    });
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
export function abbrDisplayName(name: string) {
  if (name) {
    const names: string[] = name.split(/\s+/);
    const isNameContainsComma = names?.some(element => element.startsWith(','));
    if(isNameContainsComma) {
      const [array1, array2] = processArray(names);

      const resultArray1 = array1.map(capitalizeFirstLetter);
      const resultArray2 = convertToUpperCaseWithDot(array2);
      
      const resultString = resultArray1.concat(resultArray2).join(' ');
      return resultString; 
    }
    else {
      if (names[1]) {
      //Added condition to avoid adding undefined if don't have last name
        names[1] = `${names[1].substr(0, 1)}.`;
      }  
      return names.join(' ');
    }
  }
}

function processArray(originalArray: string[]): [string[], string[]] {
  const array1: string[] = [];
  const array2: string[] = [];

  let foundComma = false;
  let wordsAfterComma: string[] = [];

  for (const element of originalArray) {
    if (element.startsWith(',')) {
      foundComma = true;
      wordsAfterComma = element.substring(1).split(' ');
    } else if (!foundComma) {
      array1.push(element);
    } else {
      wordsAfterComma.push(element);
    }
  }

  return [array1, wordsAfterComma];
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertToUpperCaseWithDot(words: string[]): string[] {
  return words.map(word => `${word.charAt(0).toUpperCase()}.`);
}

export function removeCommaIfNeeded(inputString: string) {
  const words = inputString?.split(' ');
  const modifiedWords = words?.map(word => {
    if (word.startsWith(',')) {
      return word.slice(1);
    }
    return word;
  });
  return modifiedWords.join(' ');
} 