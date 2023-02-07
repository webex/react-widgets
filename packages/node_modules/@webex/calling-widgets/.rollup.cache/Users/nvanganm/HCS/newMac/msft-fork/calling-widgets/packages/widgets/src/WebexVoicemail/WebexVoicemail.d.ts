import React from 'react';
import './WebexVoicemail.styles.scss';
export interface IWebexVoicemailProps {
    updateUnreadCount?: (unread: number) => void;
}
export interface IWebexVoicemailHandle {
    refreshVoicemails: () => void;
}
export declare const WebexVoicemail: React.ForwardRefExoticComponent<IWebexVoicemailProps & React.RefAttributes<IWebexVoicemailHandle>>;
//# sourceMappingURL=WebexVoicemail.d.ts.map