import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as ZoomIcon } from '../../../icons/search-outline.svg';

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
export default function ZoomButton() {
  const classes = useStyles();

  const { setIsZoomMode, isZoomMode } = useCaptureImageContext();

  const doToggleZoom = () => {
    setIsZoomMode(!isZoomMode);
  };

  return (
    <>
      <Button
        className={classes.button}
        onClick={doToggleZoom}
        color={isZoomMode ? 'secondary' : undefined}
        startIcon={
          <div className={classes.iconContainer}>
            <ZoomIcon />
          </div>
        }
      ></Button>
    </>
  );
}
