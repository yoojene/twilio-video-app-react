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

export default function RefreshImagePreviewButton() {
  const classes = useStyles();

  const { getImagesFromDataStore } = useCaptureImageContext();

  const refreshPreview = async () => {
    getImagesFromDataStore();
  };
  return (
    <Button color="primary" variant="contained" className={classes.button} onClick={refreshPreview}>
      Refresh Preview
    </Button>
  );
}
