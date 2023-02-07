import './SpeedDialPhotoInput.styles.scss';
declare type ISpeedDialPhotoInputProps = {
    name: string;
    title?: string;
    src?: string;
    className?: string;
};
/**
 * The Speed Dial Photo input that handles previewing an avatar.
 *
 * @param {ISpeedDialPhotoInputProps} props Component props
 * @param {string} props.title The title
 * @param {string} props.name The file input name
 * @param {string} props.className Custom class names
 * @returns {React.Component} React component
 */
export declare const SpeedDialPhotoInput: ({ name, src, title, className, }: ISpeedDialPhotoInputProps) => JSX.Element;
export {};
//# sourceMappingURL=SpeedDialPhotoInput.d.ts.map