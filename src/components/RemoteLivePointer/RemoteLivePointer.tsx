import { makeStyles } from '@material-ui/core';
import { DataTrack as IDataTrack, LocalDataTrackPublication } from 'twilio-video';
import React, { ReactElement, useEffect } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import VideoTrack from '../VideoTrack/VideoTrack';
import { IVideoTrack } from '../../types';
import ColorHash from 'color-hash';

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
  const { drawLivePointer, getPosition, sendMouseCoordsAndCanvasSize } = useCaptureImageContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }

  const remoteColor = new ColorHash().hex(dataTrack.name);

  useEffect(() => {
    const handleMessage = (event: any) => {
      console.log(dataTrack);

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

      const {
        trackColor: { color },
      } = JSON.parse(event);

      const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      drawLivePointer(canvas, mouseX, mouseY, color);
    };

    dataTrack.on('message', handleMessage);
    return () => {
      dataTrack.off('message', handleMessage);
    };
  }, [dataTrack]);

  useEffect(() => {
    console.log('second useEffect');
    const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
    const canvasPos = getPosition(canvas);

    // eslint-disable-next-line no-var
    var mouseX = 0;
    // eslint-disable-next-line no-var
    var mouseY = 0;
    canvas.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        const { mouseCoords } = sendMouseCoordsAndCanvasSize(e, canvas, canvasPos, remoteColor);
        mouseX = mouseCoords.mouseX;
        mouseY = mouseCoords.mouseY;
      },
      false
    );

    const ctx = canvas!.getContext('2d');

    const drawCircle = () => {
      console.log('using drawCircle in remove LivePointer()');
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.beginPath();
      ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
      ctx!.fillStyle = remoteColor; // TODO toggle based on local/remote user
      ctx!.fill();
      requestAnimationFrame(drawCircle);
    };

    drawCircle();
  });

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
