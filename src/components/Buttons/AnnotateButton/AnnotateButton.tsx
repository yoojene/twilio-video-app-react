import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

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

export default function AnnotateButton() {
  const classes = useStyles();

  const { isMarkupPanelOpen, captureImage, setIsCaptureMode, isCaptureMode, annotateImage } = useCaptureImageContext();

  const doAnnotateImage = async () => {
    annotateImage();
  };

  return (
    <Button
      className={classes.button}
      onClick={doAnnotateImage}
      disabled={isMarkupPanelOpen || !isCaptureMode}
      color={isMarkupPanelOpen ? 'secondary' : undefined}
      startIcon={
        <div className={classes.iconContainer}>
          <PencilIcon />
        </div>
      }
    ></Button>
  );
}
