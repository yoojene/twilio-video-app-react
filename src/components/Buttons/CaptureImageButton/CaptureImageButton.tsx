import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { truncate } from 'lodash';
import React, { useEffect, useLayoutEffect } from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
  })
);
export default function CaptureImageButton() {
  const classes = useStyles();

  const { setIsCaptureMode, isCaptureMode } = useCaptureImageContext();

  const doCaptureImage = () => {
    setIsCaptureMode(!isCaptureMode);
  };

  return (
    <Button
      className={classes.button}
      onClick={doCaptureImage}
      color={isCaptureMode ? 'secondary' : undefined}
      startIcon={
        <div className={classes.iconContainer}>
          <CameraIcon />
        </div>
      }
    ></Button>
  );
}
