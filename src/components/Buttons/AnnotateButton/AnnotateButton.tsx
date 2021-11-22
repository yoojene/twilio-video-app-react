import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import React, { useRef } from 'react';
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

  const { createMarkerArea, isMarkupPanelOpen, imgRef } = useCaptureImageContext();

  const annotateImage = () => {
    console.log(imgRef);
    const markerArea = createMarkerArea(imgRef);
    console.log(markerArea);
    console.log(isMarkupPanelOpen);

    if (!isMarkupPanelOpen) {
      markerArea.show();
    } else {
      markerArea.close();
    }
  };

  return (
    <Button
      color="primary"
      variant="contained"
      className={classes.button}
      onClick={annotateImage}
      disabled={isMarkupPanelOpen}
    >
      Annotate
    </Button>
  );
}
