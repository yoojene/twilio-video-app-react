import { makeStyles } from '@material-ui/core';
import React, { ReactElement, useEffect } from 'react';
import { LocalDataTrackPublication } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
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
  const { room } = useVideoContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }

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

        // Canvas position calculation fn
        const getPosition = (el: any) => {
          let xPos = 0;
          let yPos = 0;

          while (el) {
            xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
            yPos += el.offsetTop - el.scrollTop + el.clientTop;
            el = el.offsetParent;
          }

          return {
            x: xPos,
            y: yPos,
          };
        };

        const canvasPos = getPosition(canvas);

        // Mouse position and event listener
        let mouseX = 0;
        let mouseY = 0;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const setMousePosition = (e: MouseEvent) => {
          mouseX = e.clientX - canvasPos.x;
          mouseY = e.clientY - canvasPos.y;
          const mouseCoords = { mouseX, mouseY };
          const canvasSize = { canvasWidth, canvasHeight };
          localDataTrackPublication.track.send(
            JSON.stringify({
              mouseCoords,
              canvasSize,
            })
          );
        };

        canvas.addEventListener('mousemove', setMousePosition, false);

        if (ctx) {
          // Draw video image onto canvas

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

          // Drawing pointer circle on canvas
          const drawCircle = () => {
            ctx!.beginPath();
            ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
            ctx!.fillStyle = '#FF6A6A'; // TODO toggle based on local/remote user
            ctx!.fill();
            requestAnimationFrame(drawCircle);
          };

          drawCircle();
        }
      }, 500);
    }
  });

  return (
    <>
      <h2 className={classes.preview}>Live Pointer</h2>
      <div className={classes.preview}>
        <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
        <canvas id="videocanvas" className={classes.canvas}></canvas>
      </div>
    </>
  );
}
