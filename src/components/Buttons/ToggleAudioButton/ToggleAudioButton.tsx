import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
  })
);
export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const classes = useStyles();

  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={
        isAudioEnabled ? (
          <div className={classes.iconContainer}>
            <MicIcon />
          </div>
        ) : (
          <div className={classes.iconContainer}>
            <MicOffIcon />
          </div>
        )
      }
      data-cy-audio-toggle
    ></Button>
  );
}
