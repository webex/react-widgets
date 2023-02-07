import { ICallHistoryRecord, ISpeedDialRecord, IWebexIntContact, IWebexVoicemail } from '@webex-int/adapter-interfaces';
import { ISpeedDialItem } from '../components/SpeedDials/SpeedDials.types';
/**
 * Helper to simulate network requests.
 *
 * @param {number} min Min number
 * @param {number} max Max number
 * @returns {number} A random number
 */
export declare function randomIntFromInterval(min: number, max: number): number;
/**
 *
 */
export declare function createMSUser(): {
    id: string;
    displayName: string;
    givenName: string;
    surname: string;
    mail: string;
    mobilePhone: string;
    businessPhones: string[];
    photo: string;
    type: string;
};
export declare const createSpeedDialItem: (user?: ISpeedDialRecord | undefined) => {
    currentCallAddress: string | undefined;
    id?: string | undefined;
    displayName?: string | undefined;
    status: string;
    number?: string | undefined;
    callType?: string | undefined;
    phone?: string | undefined;
    phoneType?: string | undefined;
    mail?: string | undefined;
    mobilePhone?: string | undefined;
    businessPhones?: string[] | undefined;
    surname?: string | undefined;
    givenName?: string | undefined;
    photo?: string | undefined;
    isAudio: boolean;
};
/**
 *
 * @param count
 */
export declare function createSpeedDialItems(count?: number): ISpeedDialItem[];
/**
 *
 * @param root0
 * @param root0.count
 * @param root0.date
 */
export declare function createCallHistoryItems({ count, date, }: {
    count?: number | undefined;
    date?: Date | undefined;
}): ICallHistoryRecord[];
/**
 * @param count.count
 * @param count
 * @param minPhone
 * @param count.minPhone
 * @param count.maxPhoneNumbers
 * @param count.minEmail
 * @param count.maxEmail
 * @param count.minPhoneNumbers
 * @param count.minEmailAddresses
 * @param count.maxEmailAddresses
 * @description Create mock webex int contact
 */
export declare function createWebexIntUser({ minPhoneNumbers, maxPhoneNumbers, minEmailAddresses, maxEmailAddresses, }: {
    minPhoneNumbers?: number | undefined;
    maxPhoneNumbers?: number | undefined;
    minEmailAddresses?: number | undefined;
    maxEmailAddresses?: number | undefined;
}): IWebexIntContact;
/**
 *
 * @param root0
 * @param root0.count
 * @param root0.minPhoneNumbers
 * @param root0.maxPhoneNumbers
 * @param root0.minEmailAddresses
 * @param root0.maxEmailAddresses
 */
export declare function createWebexIntUsers({ count, minPhoneNumbers, maxPhoneNumbers, minEmailAddresses, maxEmailAddresses, }: {
    count?: number | undefined;
    minPhoneNumbers?: number | undefined;
    maxPhoneNumbers?: number | undefined;
    minEmailAddresses?: number | undefined;
    maxEmailAddresses?: number | undefined;
}): IWebexIntContact[];
/**
 *
 * @param root0
 * @param root0.count
 * @param root0.date
 */
export declare function createVoicemailItems({ count, date, }: {
    count?: number | undefined;
    date?: Date | undefined;
}): IWebexVoicemail[];
/**
 *
 * @param count
 */
export declare function createMSUsers(count?: number): {
    id: string;
    displayName: string;
    givenName: string;
    surname: string;
    mail: string;
    mobilePhone: string;
    businessPhones: string[];
    photo: string;
    type: string;
}[];
export declare const webexDemoSpeedDials: {
    displayName: string;
    givenName: string;
    surname: string;
    mail: string;
    photo: string;
    currentCallAddress: string | undefined;
    id?: string | undefined;
    status: string;
    number?: string | undefined;
    callType?: string | undefined;
    phone?: string | undefined;
    phoneType?: string | undefined;
    mobilePhone?: string | undefined;
    businessPhones?: string[] | undefined;
    isAudio: boolean;
}[];
//# sourceMappingURL=index.d.ts.map