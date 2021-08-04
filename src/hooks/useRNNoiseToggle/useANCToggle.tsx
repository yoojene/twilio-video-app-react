import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useANCToggle() {
  const { isUsingANC, enableANC, disableANC, noiseCancellationKind } = useVideoContext();

  const toggleANC = useCallback(() => {
    isUsingANC ? disableANC() : enableANC();
  }, [isUsingANC, disableANC, enableANC]);

  return [isUsingANC, toggleANC, noiseCancellationKind] as const;
}
