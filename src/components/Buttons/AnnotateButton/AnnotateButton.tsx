import { makeStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

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

export default function AnnotateButton() {
  const classes = useStyles();

  const { isMarkupPanelOpen, isCaptureMode, setIsAnnotateMode, isAnnotateMode } = useCaptureImageContext();

  const doAnnotateImage = async () => {
    // annotateImage();
    setIsAnnotateMode(!isAnnotateMode);
  };

  return (
    <>
      <IconButton
        classes={{ label: classes.iconButton, root: classes.hover }}
        onClick={doAnnotateImage}
        disabled={isAnnotateMode || !isCaptureMode}
        color={isAnnotateMode ? 'primary' : 'default'}
      >
        <div className={classes.iconContainer}>
          <PencilIcon />
        </div>
        <div className={classes.label}>Annotate</div>
      </IconButton>
    </>
  );
}
