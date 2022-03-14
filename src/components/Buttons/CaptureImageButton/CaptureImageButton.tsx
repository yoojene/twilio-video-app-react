import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { LocalDataTrackPublication } from 'twilio-video';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    paper: {
      padding: theme.spacing(1),
    },
    iconButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: `${theme.menuBarIconFontSize}px`,
    },
    hover: {
      '&:hover': {
        borderBottom: `5px ${theme.brand} solid`,
        color: `${theme.brand}`,
      },
    },
  })
);
export default function CaptureImageButton() {
  const classes = useStyles();

  const { setIsCaptureMode, isCaptureMode, isLivePointerOpen } = useCaptureImageContext();
  const { room } = useVideoContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }

  const doCaptureImage = () => {
    setIsCaptureMode(!isCaptureMode);
    console.log('about to send isCaptureMode on DT');
    localDataTrackPublication.track.send(
      JSON.stringify({
        isCaptureMode: !isCaptureMode,
      })
    );
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton, root: classes.hover }}
        onClick={doCaptureImage}
        disabled={isLivePointerOpen}
        color={isCaptureMode ? 'primary' : 'default'}
      >
        <div className={classes.iconContainer}>
          <CameraIcon />
        </div>
        <div className={classes.label}>Capture Mode</div>
      </IconButton>
    </>
  );
}
