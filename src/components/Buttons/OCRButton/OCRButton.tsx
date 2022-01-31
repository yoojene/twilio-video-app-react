import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as TextIcon } from '../../../icons/text-outline.svg';

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

export default function OCRButton() {
  const classes = useStyles();

  const { isCaptureMode, captureOCR, setIsCaptureSnackOpen, setSnackMessage } = useCaptureImageContext();

  const doOCR = async () => {
    console.log('doOCR');
    setSnackMessage('Please wait..');
    setIsCaptureSnackOpen(true);
    await captureOCR();
  };

  return (
    <>
      <IconButton classes={{ label: classes.iconButton }} onClick={doOCR} disabled={!isCaptureMode}>
        <div className={classes.iconContainer}>
          <TextIcon />
        </div>
        <div className={classes.label}>OCR</div>
      </IconButton>
    </>
  );
}
