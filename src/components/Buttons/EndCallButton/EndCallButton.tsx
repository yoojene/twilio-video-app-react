import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { DataStore } from 'aws-amplify';
import { defaultBase64Image } from '../../RemoteImagePreview/RemoteImagePreviewData';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { setPhotoBase64 } = useCaptureImageContext();

  const disconnect = () => {
    DataStore.clear();
    setPhotoBase64(defaultBase64Image);
    room!.disconnect();
  };

  return (
    <Button onClick={disconnect} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
