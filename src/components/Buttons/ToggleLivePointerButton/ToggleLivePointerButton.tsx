import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
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
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
  })
);
export default function ToggleLivePointerButton(): ReactElement {
  const classes = useStyles();

  const { setIsLivePointerOpen, isLivePointerOpen } = useCaptureImageContext();
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
    <Button
      className={classes.button}
      onClick={doOpenLivePointer}
      startIcon={
        <div className={classes.iconContainer}>
          <LivePointerIcon />
        </div>
      }
    ></Button>
  );
}
