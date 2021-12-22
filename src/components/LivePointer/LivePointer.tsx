import { makeStyles } from '@material-ui/core';
import React, { ReactElement, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import VideoTrack from '../VideoTrack/VideoTrack';

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

interface LivePointerProps {
  videoTrack: IVideoTrack;
  id?: string;
  scale?: number;
}

export default function LivePointer({ videoTrack, scale }: LivePointerProps): ReactElement {
  const classes = useStyles();

  useEffect(() => {
    const canvas = document.getElementById('videocanvas') as HTMLCanvasElement;
    const video = document.getElementById('capture-video') as HTMLVideoElement;
    console.log(canvas);
    console.log(video);

    if (canvas && video) {
      setTimeout(() => {
        console.log(video.videoWidth);
        console.log(video.videoHeight);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas!.getContext('2d');

        console.log(ctx);

        if (ctx) {
          const drawToCanvas = () => {
            // draw the current frame of localVideo onto the canvas,
            // starting at 0, 0 (top-left corner) and covering its full
            // width and heigth
            ctx!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            //repeat this every time a new frame becomes available using
            //the browser's build-in requestAnimationFrame method
            requestAnimationFrame(drawToCanvas);
          };

          drawToCanvas();
        }
      }, 500);
    }
  });

  return (
    <div className={classes.preview}>
      <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
      <canvas id="videocanvas" className={classes.canvas}></canvas>
    </div>
  );
}
