import { makeStyles } from '@material-ui/core';
import { DataTrack as IDataTrack } from 'twilio-video';
import React, { ReactElement, useEffect } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import VideoTrack from '../VideoTrack/VideoTrack';
import { IVideoTrack } from '../../types';
import { REMOTE_POINTER_COLOR } from '../../utils';

const useStyles = makeStyles(() => ({
  preview: {
    // display: 'flex',
    // justifyContent: 'center',
    // width: '100vw',

    // maxHeight: '800px',
    // margin: '0.5em auto',
    '& video': {
      width: '100vw',
    },
    position: 'relative',
  },
  canvas: {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    right: '0',
    textAlign: 'center',
    width: '100vw',
  },
}));

interface RemoteLivePointerProps {
  videoTrack: IVideoTrack;
  dataTrack: IDataTrack;
  id?: string;
  scale?: number;
}

export default function RemoteLivePointer({ videoTrack, dataTrack, scale }: RemoteLivePointerProps): ReactElement {
  const classes = useStyles();
  const {
    drawLivePointer,
    getPosition,
    sendMouseCoordsAndCanvasSize,
    drawVideoToCanvas,
    isLivePointerOpen,
  } = useCaptureImageContext();

  const remoteColor = REMOTE_POINTER_COLOR;

  useEffect(() => {
    console.log('drawing remotelivepointer');
    const canvas = document.getElementById('remotevideocanvas') as HTMLCanvasElement;
    const video = document.getElementById('remote-capture-video') as HTMLVideoElement;

    console.log(canvas);
    console.log(video);

    if (canvas && video) {
      setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const canvasPos = getPosition(canvas);

        // eslint-disable-next-line no-var
        var mouseX = 0;
        // eslint-disable-next-line no-var
        var mouseY = 0;

        canvas.addEventListener('touchstart', (e: TouchEvent) => {
          console.log(e);
        });
        canvas.addEventListener(
          'touchmove',
          (e: TouchEvent) => {
            e.preventDefault();
            // console.log('touchmove ', e);
            console.log(e.touches[0].clientX);
            console.log(e.touches[0].clientY);
            const { mouseCoords } = sendMouseCoordsAndCanvasSize(e.touches[0], canvas, canvasPos, remoteColor);
            mouseX = mouseCoords.mouseX;
            mouseY = mouseCoords.mouseY;
            drawCircle();
          },
          false
        );

        drawVideoToCanvas(canvas, video);

        const ctx = canvas!.getContext('2d');

        const drawCircle = () => {
          ctx!.clearRect(0, 0, canvas.width, canvas.height);
          ctx!.beginPath();
          ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
          ctx!.fillStyle = remoteColor; // TODO toggle based on local/remote user
          ctx!.fill();
          requestAnimationFrame(drawCircle);
        };
      }, 500);
    }
  });

  useEffect(() => {
    const handleMessage = (event: any) => {
      console.log(dataTrack);

      console.log('in handleMessage RemoteLivePointer');
      console.log(event);

      if (typeof event === 'string' && event.startsWith('{"isLivePointerOpen')) {
        if (!isLivePointerOpen) {
          console.log('here');
          document.querySelectorAll('main')[0].style.overflow = 'unset';
        }
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

      const canvas = document.getElementById('remotevideocanvas') as HTMLCanvasElement;
      const video = document.getElementById('remote-capture-video') as HTMLVideoElement;

      console.log(video);
      console.log(video.videoHeight);
      console.log(video.videoWidth);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawLivePointer(canvas, mouseX, mouseY, color);
    };

    dataTrack.on('message', handleMessage);
    return () => {
      dataTrack.off('message', handleMessage);
    };
  }, [dataTrack]);

  return (
    <>
      {/* <h2 className={classes.preview}>Remote Live Pointer</h2> */}
      <div className={classes.preview}>
        <VideoTrack id={'remote-capture-video'} track={videoTrack} scale={scale} />
        <canvas id="remotevideocanvas" className={classes.canvas}></canvas>
      </div>
    </>
  );
}
