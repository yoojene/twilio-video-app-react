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

  const { photoBase64, setPhotoBase64 } = useCaptureImageContext();
  // const [photoBase64, setPhotoBase64] = useState<string>(defaultBase64Image);

  useEffect(() => {
    getImages();
    const subscription = DataStore.observe(Image).subscribe(() => getImages());
    return () => subscription.unsubscribe();
  });

  const getImages = async () => {
    console.log('getting Images from datastore');
    const images = await DataStore.query(Image);
    console.log(images);
    if (images.length > 0) {
      console.log('returning new image');
      console.log(photoBase64);
      console.log(images[images.length - 1].base64Data);
      setPhotoBase64(images[images.length - 1].base64Data);
      // return images[images.length - 1].base64Data;
    }
    // else {
    //   return photoBase64;
    // }
  };

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
