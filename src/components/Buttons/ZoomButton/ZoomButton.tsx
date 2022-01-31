import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as ZoomIcon } from '../../../icons/search-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    button: {},
    paper: {
      padding: theme.spacing(1),
    },
    iconButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '12px',
    },
  })
);
export default function ZoomButton() {
  const classes = useStyles();

  const { setIsZoomMode, isZoomMode, isCaptureMode, isLivePointerOpen } = useCaptureImageContext();

  const doToggleZoom = () => {
    setIsZoomMode(!isZoomMode);
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton }}
        onClick={doToggleZoom}
        disabled={isCaptureMode || isLivePointerOpen}
        color={isZoomMode ? 'secondary' : undefined}
      >
        <div className={classes.iconContainer}>
          <ZoomIcon />
        </div>
        <div className={classes.label}>Zoom</div>
      </IconButton>
    </>
  );
}
