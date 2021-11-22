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

  const { getVideoElementFromDialog, setVideoOnCanvas, setPhotoFromCanvas } = useCaptureImageContext();

  const captureImage = () => {
    console.log('capture image from captureImageButton');
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        setPhotoFromCanvas(canvas);
      }
    }
  };

  return (
    <Button color="primary" variant="contained" className={classes.button} onClick={captureImage}>
      Capture
    </Button>
  );
}
