import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: '15px',
    },
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
  })
);
export default function CaptureImageButton() {
  const classes = useStyles();

  const { captureImage, isCaptureMode } = useCaptureImageContext();

  const doCaptureImage = () => {
    captureImage();
  };

  return (
    <Button
      className={classes.button}
      onClick={doCaptureImage}
      startIcon={
        <div className={classes.iconContainer}>
          <CameraIcon />
        </div>
      }
    >
      Capture Image
    </Button>
  );
}
