import React, { useCallback, useEffect, useState } from 'react';
import {
  Divider,
  Dialog,
  DialogActions,
  Button,
  Theme,
  DialogTitle,
  makeStyles,
  ImageList,
  ImageListItem,
} from '@material-ui/core';
import VideoTrack from '../VideoTrack/VideoTrack';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import useTrack from '../../hooks/useTrack/useTrack';
import usePublications from '../../hooks/usePublications/usePublications';
import * as markerjs2 from 'markerjs2';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';
import { S3ProviderListOutput, S3ProviderListOutputItem, StorageClass } from '@aws-amplify/storage';
import { Storage } from 'aws-amplify';
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '600px',
    minHeight: '400px',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 32px)',
    },
    '& .inputSelect': {
      width: 'calc(100% - 35px)',
    },
  },
  button: {
    float: 'right',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
    },
  },
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0.8em',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
  preview: {
    width: '320px',
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px',
    },
  },
  photoPreview: {
    width: '320px',
    backgroundSize: 'auto',
  },
  canvas: {
    display: 'none',
  },
}));

export default function SavedImageGallery() {
  const [images, setImages] = useState<S3ProviderListOutput>([]);

  useEffect(() => {
    console.log('here');
    getImages();

    async function getImages() {
      try {
        const allFiles = await Storage.list('');

        let imageRes: S3ProviderListOutputItem[] = [];

        imageRes = allFiles.filter(
          f =>
            !f.key?.endsWith('txt') &&
            f.lastModified?.getDate() === new Date().getDate() &&
              f.lastModified.getMonth() === new Date().getMonth() &&
              f.lastModified.getFullYear() === new Date().getFullYear()
        );
        console.log(images);
        setImages(imageRes);
      } catch (err) {
        console.error(err);
      }
    }
  }, [images]);
  return (
    <>
      in Saved image gallery
      <ImageList cols={1}>
        {images?.map((img: any) => (
          <ImageListItem key={img.key}>
            <img src={img.key} alt={img.eTag} />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
