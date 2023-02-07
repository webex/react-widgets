import { IWebexVoicemail } from '@webex-int/adapter-interfaces';
/**
 * Custom hook that returns voicemail data for a given user.
 *
 * @returns {object} Returns {callHistory, lastUpdated} values
 */
export default function useVoicemails(): {
    readonly lastUpdated: Date | undefined;
    readonly voicemails: IWebexVoicemail[];
    readonly refresh: () => Promise<void>;
    readonly loading: boolean;
    readonly deleteVoicemail: (voicemailId: string) => void;
    readonly readVoicemail: (voicemailId: string) => void;
};
//# sourceMappingURL=useVoicemails.d.ts.map