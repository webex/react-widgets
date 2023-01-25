/// <reference types="react" />
declare type CallButtonsProps = {
    address: string;
    disabled?: boolean;
    className?: string;
};
/**
 * Video and audio call buttons
 *
 * @param {CallButtonsProps} props
 * @param props.address address to call
 * @param props.disabled denotes whether the call buttons should be disabled
 * @returns {JSX.Element} React component
 */
export declare const CallButtons: ({ address, disabled, className, }: CallButtonsProps) => JSX.Element;
export {};
//# sourceMappingURL=CallButtons.d.ts.map