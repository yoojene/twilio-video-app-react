import React from 'react';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';
import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    iconButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '12px',
    },
  })
);
export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const classes = useStyles();

  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <>
      <IconButton
        data-cy-audio-toggle
        classes={{ label: classes.iconButton }}
        onClick={toggleAudioEnabled}
        disabled={!hasAudioTrack}
      >
        {isAudioEnabled ? (
          <>
            <div className={classes.iconContainer}>
              <MicIcon />
            </div>
            <div className={classes.label}>Mic On</div>
          </>
        ) : (
          <>
            <div className={classes.iconContainer}>
              <MicOffIcon />
            </div>
            <div className={classes.label}>Mic Off</div>
          </>
        )}
      </IconButton>
    </>
  );
}
