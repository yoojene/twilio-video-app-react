import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalAudioToggle() {
  const { localTracks, disableANC, enableANC } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      if (audioTrack.isEnabled) {
        audioTrack.disable();
        disableANC();
      } else {
        audioTrack.enable();
        enableANC();
      }
    }
  }, [audioTrack, disableANC, enableANC]);

  return [isEnabled, toggleAudioEnabled] as const;
}
