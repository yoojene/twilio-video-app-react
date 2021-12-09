import { DataStore } from '@aws-amplify/datastore';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { RemoteDataTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Image } from '../../models';
import { DataTrack as IDataTrack } from 'twilio-video';

import DataTrack from '../DataTrack/DataTrack';
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
export default function RemoteImagePreview(props: { track: IDataTrack }) {
  const classes = useStyles();

  const { photoBase64, getImagesFromDataStore } = useCaptureImageContext();

  useEffect(() => {
    getImagesFromDataStore();
    const subscription = DataStore.observe(Image).subscribe(() => getImagesFromDataStore());
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <DataTrack track={props.track} />
      {/* <div className={classes.photoContainer}>
        <img
          id="photo"
          src={photoBase64}
          alt="Users screen capture"
          className={classes.photoPreview}
        // ref={imgRef}
        />
      </div> */}
    </>
  );
}
