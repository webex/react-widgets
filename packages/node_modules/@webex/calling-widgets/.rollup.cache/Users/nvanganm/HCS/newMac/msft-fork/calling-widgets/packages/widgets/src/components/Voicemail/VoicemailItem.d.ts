/// <reference types="react" />
import { IWebexVoicemail } from '@webex-int/adapter-interfaces';
import './VoicemailItem.styles.scss';
export interface IVoicemailItemProps {
    voicemail: IWebexVoicemail;
    isSelected?: boolean;
    onPress?: () => void;
    onDelete?: () => void;
    onRead?: () => void;
}
export declare const VoicemailItem: ({ voicemail, isSelected, onPress, onDelete, onRead, }: IVoicemailItemProps) => JSX.Element;
//# sourceMappingURL=VoicemailItem.d.ts.map