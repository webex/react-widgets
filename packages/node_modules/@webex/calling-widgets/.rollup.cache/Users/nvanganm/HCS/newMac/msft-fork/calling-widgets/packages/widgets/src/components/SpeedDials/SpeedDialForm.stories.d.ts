/// <reference types="react" />
import { ComponentMeta, ComponentStory } from '@storybook/react';
declare const _default: ComponentMeta<({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: import("./SpeedDialForm.types").ISpeedDialFormProps) => JSX.Element>;
export default _default;
export declare const Default: ComponentStory<({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: import("./SpeedDialForm.types").ISpeedDialFormProps) => JSX.Element>;
/**
 * Fetch user by ID and response is
 *
 * {
 * "@odata.context":"https://graph.microsoft.com/v1.0/$metadata#users/$entity",
 * "businessPhones":[],
 * "displayName":"Karen Adams",
 * "givenName":"Karen",
 * "jobTitle":null,
 * "mail":"kadams@webexinteg.onmicrosoft.com",
 * "mobilePhone":null,
 * "officeLocation":null,
 * "preferredLanguage":"en-US",
 * "surname":"Adams",
 * "userPrincipalName":"kadams@webexinteg.onmicrosoft.com",
 * "id":"aa8d69ac-0b34-450a-9b44-4834e2de0f48"
 * }
 */
/**
 Extensions Response:
 [
 {"displayName":"David","currentCallAddress":"555-555-5555"},
 {"displayName":"John","currentCallAddress":"555-555-5555"},
 {"contactId":"5cf8c96c-d0b3-4090-85a9-63daa55cd1ab","addressType":"work"},
 {"contactId":"aa8d69ac-0b34-450a-9b44-4834e2de0f48","addressType":"mail"}
 ]
 */
/**
 {
 "id":"aa8d69ac-0b34-450a-9b44-4834e2de0f48",
 "displayName":"Karen Adams",
 "mobilePhone":null,
 "mail":"kadams@webexinteg.onmicrosoft.com",
 "businessPhones":[]
 }
 url("blob:https://jabber-integration-intb.ciscospark.com/76175925-d585-47fd-8e04-a2529ced52ef")
 */
export declare const AddExistingContact: ComponentStory<({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: import("./SpeedDialForm.types").ISpeedDialFormProps) => JSX.Element>;
export declare const AddCustomContact: ComponentStory<({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: import("./SpeedDialForm.types").ISpeedDialFormProps) => JSX.Element>;
export declare const EditSpeedDial: ComponentStory<({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: import("./SpeedDialForm.types").ISpeedDialFormProps) => JSX.Element>;
export declare const ImageInput: () => JSX.Element;
//# sourceMappingURL=SpeedDialForm.stories.d.ts.map