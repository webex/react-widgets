import React from 'react';
import './GenericModal.styles.scss';
declare type IGenericModalProps = {
    isOpen?: boolean;
    isRound?: boolean;
    children?: React.ReactNode;
    className?: string;
};
/**
 * @description The summary of this component.
 * @param {IGenericModalProps} props Component props
 * @param {boolean} props.isOpen The open state
 * @param {boolean} props.isRound The round edgets
 * @param {React.ReactNode} props.children The children
 * @param {string} props.className Custom class names
 * @returns {React.Component} React component
 */
export declare const GenericModal: ({ isOpen, isRound, children, className, }: IGenericModalProps) => JSX.Element;
export {};
//# sourceMappingURL=GenericModal.d.ts.map