import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as SaveIcon } from '../../../icons/save-outline.svg';

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
export default function SaveCaptureImageButton() {
  const classes = useStyles();

  const { saveImageToStorage } = useCaptureImageContext();

  const saveImage = async () => {
    saveImageToStorage();
  };

  return (
    <>
      <IconButton classes={{ label: classes.iconButton }} onClick={saveImage}>
        <div className={classes.iconContainer}>
          <SaveIcon />
        </div>
        <div className={classes.label}>Save</div>
      </IconButton>
    </>
  );
}
