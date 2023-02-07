/// <reference types="react" />
import { ISpeedDialFormProps } from './SpeedDialForm.types';
import './SpeedDialForm.styles.scss';
/**
 * The form for creating/editing a speed dial.
 *
 * @param {string} cancelText The text for the cancel button
 * @param {string} addText The the text for the add button
 * @param {object} data The form data to populate with
 * @param {Function} onSubmit Callback function when form submit
 * @param {Function} onCancel Callback function when form reset
 * @param {boolean} isEdit If the speed dial item is being edited
 * @param {boolean} isContact If the speed dial item is existing contact
 * @returns {React.Component} SpeedDialForm component
 */
export declare const SpeedDialForm: ({ cancelText, addText, data, onSubmit, onCancel, isEdit, isContact, }: ISpeedDialFormProps) => JSX.Element;
//# sourceMappingURL=SpeedDialForm.d.ts.map