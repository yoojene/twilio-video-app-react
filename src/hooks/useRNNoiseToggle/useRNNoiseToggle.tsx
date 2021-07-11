import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useRNNoiseToggle() {
  const { isUsingRNNoise, enableRNNoise, disableRNNoise } = useVideoContext();

  const toggleRNNoise = useCallback(() => {
    isUsingRNNoise ? disableRNNoise() : enableRNNoise();
  }, [isUsingRNNoise, disableRNNoise, enableRNNoise]);

  return [isUsingRNNoise, toggleRNNoise] as const;
}
