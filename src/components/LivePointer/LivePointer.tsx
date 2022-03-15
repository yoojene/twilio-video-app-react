import { makeStyles } from '@material-ui/core';
import React, { ReactElement, useEffect } from 'react';
import { DataTrack as IDataTrack, LocalDataTrackPublication } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { IVideoTrack } from '../../types';
import VideoTrack from '../VideoTrack/VideoTrack';
import { LOCAL_POINTER_COLOR } from '../../utils';

const useStyles = makeStyles(() => ({
  preview: {
    // display: 'flex',
    // justifyContent: 'center',
    // width: '100vw',

    // maxHeight: '800px',
    // margin: '0.5em auto',
    '& video': {
      // width: '80vw',
      // marginLeft: '10vw',
      // height: '100vh',
      maxHeight: '600px',
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
    // width: '80vw',
    // height: '100vh'
    maxHeight: '600px',
  },
}));

interface LivePointerProps {
  videoTrack: IVideoTrack;
  dataTrack: IDataTrack;
  id?: string;
  scale?: number;
}

export default function LivePointer({ videoTrack, dataTrack, scale }: LivePointerProps): ReactElement {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { getPosition, sendMouseCoordsAndCanvasSize, drawVideoToCanvas, drawLivePointer } = useCaptureImageContext();

  const color = LOCAL_POINTER_COLOR;
  console.log(color);

  useEffect(() => {
    const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
    const video = document.getElementById('capture-video') as HTMLVideoElement;
    console.log(canvas);
    console.log(video);

    if (canvas && video) {
      setTimeout(() => {
        console.log(video.videoWidth);
        console.log(video.videoHeight);
        canvas.width = 340;
        canvas.height = 600;
        const ctx = canvas!.getContext('2d');

        console.log(ctx);

        const canvasPos = getPosition(canvas);

        // Mouse position and event listener
        // eslint-disable-next-line no-var
        var mouseX = 0;
        // eslint-disable-next-line no-var
        var mouseY = 0;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const mouseMove = (e: MouseEvent) => {
          const { mouseCoords } = sendMouseCoordsAndCanvasSize(e, canvas, canvasPos, color);
          mouseX = mouseCoords.mouseX;
          mouseY = mouseCoords.mouseY;
          drawCircle();
        };

        canvas.addEventListener('mousemove', mouseMove, false);

        // Draw video image onto canvas

        // const drawToCanvas = () => {
        //   // draw the current frame of localVideo onto the canvas,
        //   // starting at 0, 0 (top-left corner) and covering its full
        //   // width and heigth
        //   ctx!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        //   //repeat this every time a new frame becomes available using
        //   //the browser's build-in requestAnimationFrame method
        //   requestAnimationFrame(drawToCanvas);
        // };
        drawVideoToCanvas(canvas, video);

        // Drawing pointer circle on canvas
        const drawCircle = () => {
          ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx!.beginPath();
          ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
          ctx!.lineWidth = 5;
          ctx!.strokeStyle = color; // TODO toggle based on local/remote user
          ctx!.stroke();
          requestAnimationFrame(drawCircle);
        };

        // drawLivePointer(canvas, mouseX, mouseY);
        return () => {
          canvas.removeEventListener('mousemove', mouseMove);
        };
      }, 500);
    }
  });

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (typeof event === 'string' && event.startsWith('{"isLivePointerOpen')) {
        return;
      }

      const {
        mouseCoords: { mouseX, mouseY },
      } = JSON.parse(event);

      // console.log({ mouseX, mouseY });
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

  return (
    <>
      {/* <h2 className={classes.preview}>Live Pointer</h2> */}
      <div className={classes.preview}>
        <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
        <canvas id="videocanvas" className={classes.canvas}></canvas>
      </div>
    </>
  );
}
