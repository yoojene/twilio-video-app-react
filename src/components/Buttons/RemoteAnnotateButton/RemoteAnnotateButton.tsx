import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      textAlign: 'center',
      marginLeft: '8px',
      marginTop: '10px',
    },
  })
);

export default function RemoteAnnotateButton() {
  const classes = useStyles();

  const { annotateImage, setIsAnnotating } = useCaptureImageContext();

  const doAnnotate = async () => {
    setIsAnnotating(true);
    console.log('then annotate');
    annotateImage();
  };
  return (
    <Button className={classes.button} onClick={doAnnotate}>
      Annotate
    </Button>
  );
}
