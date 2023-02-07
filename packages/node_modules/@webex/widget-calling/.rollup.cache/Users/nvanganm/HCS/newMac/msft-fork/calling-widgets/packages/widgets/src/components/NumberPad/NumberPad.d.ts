import './NumberPad.scss';
export interface INumPadProps {
    onButtonPress: (value: string) => void;
    disabled?: boolean;
}
/**
 * Number pad containing 0-9, #, and *.  Also contains sub-lettering
 *
 * @param {INumPadProps} props props for the NumberPad element
 * @param {Function} props.onButtonPress callback to be called whenever a button is pressed
 * @returns {React.Component} React component
 */
export declare const NumberPad: ({ onButtonPress, disabled, }: INumPadProps) => JSX.Element;
//# sourceMappingURL=NumberPad.d.ts.map