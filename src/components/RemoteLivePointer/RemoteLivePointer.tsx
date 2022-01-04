import { makeStyles } from '@material-ui/core';
import { DataTrack as IDataTrack, LocalDataTrackPublication } from 'twilio-video';

import React, { ReactElement, useEffect } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import VideoTrack from '../VideoTrack/VideoTrack';

import { IVideoTrack } from '../../types';

const useStyles = makeStyles(() => ({
  preview: {
    width: '1000px',
    marginLeft: '16px',
    '@media (max-width: 1600px)': {
      width: '500px',
    },
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px',
    },
    position: 'relative',
  },
  canvas: { position: 'absolute', top: '0', left: '0', zIndex: 1 },
}));

interface RemoteLivePointerProps {
  videoTrack: IVideoTrack;
  dataTrack: IDataTrack;
  id?: string;
  scale?: number;
}

export default function RemoteLivePointer({ videoTrack, dataTrack, scale }: RemoteLivePointerProps): ReactElement {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { drawLivePointer } = useCaptureImageContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }
  useEffect(() => {
    const handleMessage = (event: any) => {
      console.log('in handleMessage RemoteLivePointer');
      console.log(event);

      if (typeof event === 'string' && event.startsWith('{"isLivePointerOpen')) {
        return;
      }

      const {
        mouseCoords: { mouseX, mouseY },
      } = JSON.parse(event);

      console.log({ mouseX, mouseY });
      const {
        canvasSize: { canvasWidth, canvasHeight },
      } = JSON.parse(event);

      const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      drawLivePointer(canvas, mouseX, mouseY);
    };

    dataTrack.on('message', handleMessage);
    return () => {
      dataTrack.off('message', handleMessage);
    };
  }, [dataTrack]);

  return (
    <>
      <h2 className={classes.preview}>Remote Live Pointer</h2>
      <div className={classes.preview}>
        <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
        <canvas id="videocanvas" className={classes.canvas}></canvas>
      </div>
    </>
  );
}
