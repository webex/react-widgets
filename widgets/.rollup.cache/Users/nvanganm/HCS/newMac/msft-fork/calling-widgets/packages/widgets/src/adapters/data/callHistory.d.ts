export declare const rawHistoryCalls: ({
    id: string;
    durationSecs: number;
    self: {
        id: string;
        name: string;
        phoneNumber: string;
        incomingCallProtocols: never[];
        callbackInfo?: undefined;
        lookUpInfo?: undefined;
    };
    url: string;
    sessionId: string;
    sessionType: string;
    startTime: string;
    endTime: string;
    direction: string;
    disposition: string;
    other: {
        name: string;
        id: string;
        phoneNumber: string;
        isPrivate: boolean;
        callbackAddress: string;
    };
    durationSeconds: number;
    joinedDurationSeconds: number;
    participantCount: number;
    links: {
        callbackAddress: string;
        locusUrl?: undefined;
        conversationUrl?: undefined;
    };
    isDeleted: boolean;
    isPMR: boolean;
    correlationIds: never[];
} | {
    id: string;
    durationSecs: number;
    self: {
        id: string;
        name: string;
        incomingCallProtocols: never[];
        callbackInfo: {
            callbackAddress: string;
            callbackType: string;
        };
        lookUpInfo: {
            lookupLink: string;
            type: string;
        };
        phoneNumber?: undefined;
    };
    url: string;
    sessionId: string;
    sessionType: string;
    startTime: string;
    endTime: string;
    direction: string;
    disposition: string;
    other: {
        id: string;
        name: string;
        isPrivate: boolean;
        callbackAddress: string;
        phoneNumber?: undefined;
    };
    durationSeconds: number;
    joinedDurationSeconds: number;
    participantCount: number;
    links: {
        locusUrl: string;
        conversationUrl: string;
        callbackAddress: string;
    };
    isDeleted: boolean;
    isPMR: boolean;
    correlationIds: string[];
} | {
    id: string;
    durationSecs: number;
    self: {
        id: string;
        name: string;
        phoneNumber: string;
        incomingCallProtocols: never[];
        callbackInfo?: undefined;
        lookUpInfo?: undefined;
    };
    url: string;
    sessionId: string;
    sessionType: string;
    startTime: string;
    endTime: string;
    direction: string;
    disposition: string;
    other: {
        id: string;
        phoneNumber: string;
        isPrivate: boolean;
        callbackAddress: string;
        name?: undefined;
    };
    durationSeconds: number;
    joinedDurationSeconds: number;
    participantCount: number;
    links: {
        callbackAddress: string;
        locusUrl?: undefined;
        conversationUrl?: undefined;
    };
    isDeleted: boolean;
    isPMR: boolean;
    correlationIds: never[];
})[];
//# sourceMappingURL=callHistory.d.ts.map