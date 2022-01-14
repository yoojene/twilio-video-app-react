import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    <Button color="primary" variant="contained" className={classes.button} onClick={doCaptureImage}>
      Capture
    </Button>
  );
}
