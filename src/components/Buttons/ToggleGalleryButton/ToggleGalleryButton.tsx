import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as GalleryIcon } from '../../../icons/images-outline.svg';
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

export default function ToggleGalleryButton() {
  const classes = useStyles();

  const { isGalleryOpen, setIsGalleryOpen } = useCaptureImageContext();

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };
  return (
    <Button
      className={classes.button}
      onClick={toggleGallery}
      startIcon={
        <div className={classes.iconContainer}>
          <GalleryIcon />
        </div>
      }
    ></Button>
  );
}
