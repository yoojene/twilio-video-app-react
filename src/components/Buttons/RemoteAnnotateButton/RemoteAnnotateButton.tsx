import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: '15px',
    },
    button: {
      textAlign: 'center',
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
    <Button
      className={classes.button}
      onClick={doAnnotate}
      startIcon={
        <div className={classes.iconContainer}>
          <PencilIcon />
        </div>
      }
    ></Button>
  );
}
