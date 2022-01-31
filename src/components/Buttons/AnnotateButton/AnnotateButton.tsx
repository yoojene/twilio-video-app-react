import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

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

export default function AnnotateButton() {
  const classes = useStyles();

  const { isMarkupPanelOpen, isCaptureMode, annotateImage } = useCaptureImageContext();

  const doAnnotateImage = async () => {
    annotateImage();
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton }}
        onClick={doAnnotateImage}
        disabled={isMarkupPanelOpen || !isCaptureMode}
      >
        <div className={classes.iconContainer}>
          <PencilIcon />
        </div>
        <div className={classes.label}>Annotate</div>
      </IconButton>
    </>
  );
}
