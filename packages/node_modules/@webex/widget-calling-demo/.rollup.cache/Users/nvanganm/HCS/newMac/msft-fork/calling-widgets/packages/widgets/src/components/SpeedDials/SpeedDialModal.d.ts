import React from 'react';
import './SpeedDialModal.styles.scss';
declare type ISpeedDialModalProps = {
    headerText?: string;
    isOpen?: boolean;
    onCancel?: () => void;
    children?: React.ReactNode;
};
/**
 * When passed in a user, a fullscreen overlay will appear
 *
 * @param {ISpeedDialModalProps} props Component props
 * @param {string} props.headerText Header title for modal
 * @param {boolean} props.isOpen Open state of modal
 * @param {Function} props.onCancel Callback function when cancel pressed
 * @param {React.ReactNode} props.children The children
 * @returns {React.Component} React component
 */
export declare const SpeedDialModal: ({ headerText, isOpen, onCancel, children, }: ISpeedDialModalProps) => JSX.Element;
export {};
//# sourceMappingURL=SpeedDialModal.d.ts.map