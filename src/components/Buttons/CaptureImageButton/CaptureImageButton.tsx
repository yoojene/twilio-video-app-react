import { Button, createStyles, makeStyles, Popover, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useLayoutEffect } from 'react';
import { LocalDataTrackPublication } from 'twilio-video';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
    paper: {
      padding: theme.spacing(1),
    },
  })
);
export default function CaptureImageButton() {
  const classes = useStyles();

  const { setIsCaptureMode, isCaptureMode } = useCaptureImageContext();
  const { room } = useVideoContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
      <Button
        className={classes.button}
        onClick={doCaptureImage}
        color={isCaptureMode ? 'secondary' : undefined}
        onMouseEnter={handlePopoverOpen}
        startIcon={
          <div className={classes.iconContainer}>
            <CameraIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'capture-mouse-over-popover'}
        open={open}
        classes={{
          paper: classes.paper,
        }}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography>Capture Mode</Typography>
      </Popover>
    </>
  );
}
