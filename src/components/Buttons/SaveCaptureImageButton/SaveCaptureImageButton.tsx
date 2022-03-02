import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as SaveIcon } from '../../../icons/save-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    paper: {
      padding: theme.spacing(1),
    },
    iconButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: `${theme.menuBarIconFontSize}px`,
    },
    hover: {
      '&:hover': {
        borderBottom: `5px ${theme.brand} solid`,
        color: `${theme.brand}`,
      },
    },
  })
);
export default function SaveCaptureImageButton() {
  const classes = useStyles();

  const { isCaptureMode, saveImageToStorage, setIsCaptureSnackOpen } = useCaptureImageContext();

  const saveImage = async () => {
    setIsCaptureSnackOpen(true);
    saveImageToStorage();
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton, root: classes.hover }}
        onClick={saveImage}
        disabled={!isCaptureMode}
      >
        <div className={classes.iconContainer}>
          <SaveIcon />
        </div>
        <div className={classes.label}>Save</div>
      </IconButton>
    </>
  );
}
