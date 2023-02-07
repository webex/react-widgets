import './VoicemailItem.styles.scss';
import './VoicemailPlaybackControls.styles.scss';
export interface IVoicemailPlaybackControlsProps {
    audioSrc: string;
    onPlay?: () => void;
    className?: string;
    duration: number;
}
export declare const VoicemailPlaybackControls: ({ audioSrc, onPlay, className, duration, }: IVoicemailPlaybackControlsProps) => JSX.Element;
//# sourceMappingURL=VoicemailPlaybackControls.d.ts.map