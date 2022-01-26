import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as GalleryIcon } from '../../../icons/images-outline.svg';
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

export default function ToggleGalleryButton() {
  const classes = useStyles();

  const { isGalleryOpen, setIsGalleryOpen } = useCaptureImageContext();

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };
  return (
    <>
      <IconButton classes={{ label: classes.iconButton }} onClick={toggleGallery}>
        <div className={classes.iconContainer}>
          <GalleryIcon />
        </div>
        <div className={classes.label}>View Gallery</div>
      </IconButton>
    </>
  );
}
