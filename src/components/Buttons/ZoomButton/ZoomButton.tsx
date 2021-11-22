import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
  })
);
export default function ZoomButton() {
  const classes = useStyles();

  const { setScale } = useCaptureImageContext();

  const zoomOne = () => {
    setScale(1);
  };
  const zoomTwo = () => {
    setScale(2);
  };
  const zoomThree = () => {
    setScale(3);
  };

  return (
    <>
      <Button color="primary" variant="contained" className={classes.button} onClick={zoomOne}>
        1X
      </Button>
      <Button color="primary" variant="contained" className={classes.button} onClick={zoomTwo}>
        2X
      </Button>
      <Button color="primary" variant="contained" className={classes.button} onClick={zoomThree}>
        3X
      </Button>
    </>
  );
}
