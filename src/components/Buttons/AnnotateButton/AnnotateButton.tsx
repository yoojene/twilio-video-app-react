import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
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

export default function AnnotateButton() {
  const classes = useStyles();

  const { isMarkupPanelOpen, captureImage, annotateImage } = useCaptureImageContext();

  const doAnnotateImage = () => {
    const isAnnotating = true;
    captureImage(isAnnotating);
    console.log('then annotate');
    annotateImage();
  };

  return (
    <Button
      color="primary"
      variant="contained"
      className={classes.button}
      onClick={doAnnotateImage}
      disabled={isMarkupPanelOpen}
    >
      Annotate
    </Button>
  );
}
