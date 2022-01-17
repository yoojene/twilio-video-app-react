import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as SaveIcon } from '../../../icons/save-outline.svg';

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
export default function SaveCaptureImageButton() {
  const classes = useStyles();

  const { saveImageToStorage } = useCaptureImageContext();

  const saveImage = async () => {
    saveImageToStorage();
  };

  return (
    <Button
      className={classes.button}
      onClick={saveImage}
      startIcon={
        <div className={classes.iconContainer}>
          <SaveIcon />
        </div>
      }
    >
      Save
    </Button>
  );
}
