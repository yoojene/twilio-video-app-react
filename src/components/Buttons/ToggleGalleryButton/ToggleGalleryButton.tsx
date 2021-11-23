import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    <Button color="primary" variant="contained" className={classes.button} onClick={toggleGallery}>
      Gallery
    </Button>
  );
}
