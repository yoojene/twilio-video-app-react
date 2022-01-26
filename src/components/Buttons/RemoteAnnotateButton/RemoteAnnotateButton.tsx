import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: '15px',
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

export default function RemoteAnnotateButton() {
  const classes = useStyles();

  const { annotateImage } = useCaptureImageContext();
  const doAnnotate = async () => {
    annotateImage();
  };
  return (
    <>
      <IconButton classes={{ label: classes.iconButton }} onClick={doAnnotate}>
        <div className={classes.iconContainer}>
          <PencilIcon />
        </div>
        <div className={classes.label}>Annotate</div>
      </IconButton>
    </>
  );
}
