import { makeStyles } from '@material-ui/core';
import { DataTrack as IDataTrack, LocalDataTrackPublication } from 'twilio-video';

import React, { ReactElement, useEffect } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';

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

export default function RemoteLivePointer({ track }: { track: IDataTrack }): ReactElement {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { drawLivePointer, setIsRemoteLivePointerOpen } = useCaptureImageContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }
  useEffect(() => {
    const handleMessage = (event: any) => {
      console.log('in handleMessage RemoteLivePointer');
      console.log(event);

      // if (typeof event === 'string' && event.startsWith('{"isLivePointerOpen')) {
      //   const { isLivePointerOpen } = JSON.parse(event);
      //   console.log({ isLivePointerOpen });
      //   setIsRemoteLivePointerOpen(!isLivePointerOpen);

      //   return;
      // }

      const {
        mouseCoords: { mouseX, mouseY },
      } = JSON.parse(event);

      console.log({ mouseX, mouseY });

      const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
      drawLivePointer(canvas, mouseX, mouseY);
    };

    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return (
    <>
      <h2 className={classes.preview}>Remote Live Pointer</h2>
      <div className={classes.preview}>
        <canvas id="videocanvas" className={classes.canvas}></canvas>
      </div>
    </>
  );
}
