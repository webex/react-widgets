import { ICallHistoryRecord } from '@webex-int/adapter-interfaces';
/**
 * Custom hook that returns call history data of the given ID.
 *
 * @param {string} userID  ID for user which to return data.
 * @returns {object} Returns {callHistory, lastUpdated} values
 */
export default function useCallHistory(userID?: string): {
    readonly lastUpdated: Date | undefined;
    readonly callHistory: ICallHistoryRecord[];
    readonly refresh: () => void;
    readonly loading: boolean;
};
//# sourceMappingURL=useCallHistory.d.ts.map