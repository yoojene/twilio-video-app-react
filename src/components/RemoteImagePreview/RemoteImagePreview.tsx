import { DataStore } from '@aws-amplify/datastore';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Image } from '../../models';
import { defaultBase64Image } from './RemoteImagePreviewData';

const useStyles = makeStyles(() => ({
  photoPreview: {
    '@media (max-width: 1600px)': {
      width: '787px',
    },
  },
  canvasContainer: {
    width: '100%',
    textAlign: 'center',
  },
  canvas: {
    display: 'none',
  },
  photoContainer: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '16px',
  },
}));
export default function RemoteImagePreview() {
  const classes = useStyles();

  const { photoBase64, getImagesFromDataStore } = useCaptureImageContext();

  useEffect(() => {
    getImagesFromDataStore();
    const subscription = DataStore.observe(Image).subscribe(() => getImagesFromDataStore());
    return () => subscription.unsubscribe();
  });

  return (
    <div className={classes.photoContainer}>
      <img
        id="photo"
        src={photoBase64}
        alt="Users screen capture"
        className={classes.photoPreview}
        // ref={imgRef}
      />
    </div>
  );
}
