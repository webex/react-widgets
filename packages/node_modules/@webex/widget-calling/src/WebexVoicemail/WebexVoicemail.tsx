import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ListNext, LoadingSpinner } from '@momentum-ui/react-collaboration';
import { VoicemailItem } from '../components/Voicemail/VoicemailItem';
import useVoicemails from '../hooks/useVoicemails';
import useWebexClasses from '../hooks/useWebexClasses';
import './WebexVoicemail.styles.scss';

export interface IWebexVoicemailProps {
  updateUnreadCount?: (unread: number) => void;
}

export interface IWebexVoicemailHandle {
  refreshVoicemails: () => void;
}

export const WebexVoicemail = forwardRef<
  IWebexVoicemailHandle,
  IWebexVoicemailProps
>(({ updateUnreadCount }, ref) => {
  const { voicemails, loading, deleteVoicemail, readVoicemail, refresh } =
    useVoicemails();

  useImperativeHandle(ref, () => ({
    refreshVoicemails() {
      refresh();
    },
  }));

  const [selectedVoicemailId, setSelectedVoicemailId] = useState<string>();

  useEffect(() => {
    if (updateUnreadCount) {
      updateUnreadCount(
        voicemails.filter((voicemail) => voicemail.unread).length
      );
    }
  }, [voicemails, loading, updateUnreadCount]);

  const [cssClasses] = useWebexClasses('voicemail-widget');

  if (loading) {
    return <LoadingSpinner scale={48} />;
  }

  return (
    <ListNext listSize={voicemails.length} className={cssClasses}>
      {voicemails.map((voicemail) => (
        <VoicemailItem
          key={voicemail.id}
          voicemail={voicemail}
          onPress={() => setSelectedVoicemailId(voicemail.id)}
          isSelected={selectedVoicemailId === voicemail.id}
          onDelete={() => deleteVoicemail(voicemail.id)}
          onRead={() => readVoicemail(voicemail.id)}
        />
      ))}
    </ListNext>
  );
});

WebexVoicemail.defaultProps = {
  updateUnreadCount: undefined,
};
