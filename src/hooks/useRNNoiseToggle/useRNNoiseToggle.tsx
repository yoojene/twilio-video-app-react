import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useRNNoiseToggle() {
  const { isUsingANC, enableANC, disableANC } = useVideoContext();

  const toggleRNNoise = useCallback(() => {
    isUsingANC ? disableANC() : enableANC();
  }, [isUsingANC, disableANC, enableANC]);

  return [isUsingANC, toggleRNNoise] as const;
}
