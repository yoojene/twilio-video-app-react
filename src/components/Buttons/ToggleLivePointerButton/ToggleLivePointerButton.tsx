import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { LocalDataTrackPublication } from 'twilio-video';

import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { ReactComponent as LivePointerIcon } from '../../../icons/color-wand-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    button: {},
    paper: {
      padding: theme.spacing(1),
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
export default function ToggleLivePointerButton(): ReactElement {
  const classes = useStyles();

  const { setIsLivePointerOpen, isLivePointerOpen, isCaptureMode } = useCaptureImageContext();
  const { room } = useVideoContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }
  const doOpenLivePointer = () => {
    console.log('live pointing');

    setIsLivePointerOpen(!isLivePointerOpen);
    localDataTrackPublication.track.send(
      JSON.stringify({
        isLivePointerOpen: !isLivePointerOpen,
      })
    );
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton }}
        onClick={doOpenLivePointer}
        disabled={isCaptureMode}
        color={isLivePointerOpen ? 'secondary' : undefined}
      >
        <div className={classes.iconContainer}>
          <LivePointerIcon />
        </div>
        <div className={classes.label}>Live Pointer</div>
      </IconButton>
    </>
  );
}
