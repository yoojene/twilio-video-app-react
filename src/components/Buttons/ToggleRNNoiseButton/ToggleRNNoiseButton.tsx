import React from 'react';

import Button from '@material-ui/core/Button';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';
import useRNNoiseToggle from '../../../hooks/useRNNoiseToggle/useRNNoiseToggle';

export default function ToggleRNNoiseButton(props: { disabled?: boolean; className?: string }) {
  const [isRNNoiseEnabled, toggleRNNoise] = useRNNoiseToggle();

  // todo: move this to state.
  const hasRNNNoise = window.location.search.includes('rnnoise');

  return (
    <Button
      className={props.className}
      onClick={toggleRNNoise}
      disabled={!hasRNNNoise || props.disabled}
      startIcon={isRNNoiseEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
      data-cy-audio-toggle
    >
      {!hasRNNNoise ? 'No RNNoise' : isRNNoiseEnabled ? 'Disable RNNoise' : 'Enable RNNoise'}
    </Button>
  );
}
