import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

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

  const doOpenLivePointer = () => {
    console.log('live pointing');

    setIsLivePointerOpen(!isLivePointerOpen);
  };

  return (
    <Button color="primary" variant="contained" className={classes.button} onClick={doOpenLivePointer}>
      {isLivePointerOpen ? 'Close' : 'Open'} Live Pointer
    </Button>
  );
}
