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
export default function SaveCaptureImageButton() {
  const classes = useStyles();

  const { saveImageToStorage } = useCaptureImageContext();

  const saveImage = async () => {
    saveImageToStorage();
  };

  return (
    <Button color="primary" variant="contained" className={classes.button} onClick={saveImage}>
      Save
    </Button>
  );
}
