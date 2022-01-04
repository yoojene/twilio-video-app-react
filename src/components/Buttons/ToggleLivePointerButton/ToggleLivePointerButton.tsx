import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { LocalDataTrackPublication } from 'twilio-video';

import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    <Button color="primary" variant="contained" className={classes.button} onClick={doOpenLivePointer}>
      {isLivePointerOpen ? 'Close' : 'Open'} Live Pointer
    </Button>
  );
}
