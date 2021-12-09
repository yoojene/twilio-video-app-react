import { makeStyles } from '@material-ui/core';

import React, { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
const useStyles = makeStyles(() => ({
  canvasContainer: {
    width: '100%',
    textAlign: 'center',
  },
}));
export default function DataTrack({ track }: { track: IDataTrack }) {
  const classes = useStyles();

  const { canvasWidthHeight } = useCaptureImageContext();

  useEffect(() => {
    // eslint-disable-next-line no-var
    var count = 0;
    // eslint-disable-next-line no-var
    var buf: Uint8ClampedArray;
    const handleMessage = (event: ArrayBuffer | string) => {
      if (typeof event === 'string') {
        // eslint-disable-next-line no-var
        buf = new Uint8ClampedArray(parseInt(event));
        count = 0;
        console.log('Expecting a total of ' + buf.byteLength + ' bytes');
        return;
      }

      const data = new Uint8ClampedArray(event);
      console.log(data);
      console.log(count);
      console.log(data.byteLength);

      buf.set(data, count);
      count += data.byteLength;
      console.log('count: ' + count);

      if (count === buf.byteLength) {
        console.log('Done can render photo now');
        console.log(buf);
        // console.log(canvasWidthHeight); // 640 / 320 on mac
        const remotecanvas = document.getElementById('remotecanvas') as HTMLCanvasElement;

        const ctx = remotecanvas.getContext('2d');
        remotecanvas.width = 640; //video.videoWidth;
        remotecanvas.height = 320; //video.videoHeight;

        const img = ctx?.createImageData(640, 320);
        img!.data.set(buf, 0);
        ctx?.putImageData(img!, 0, 0);
      }
    };
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return (
    <>
      The remote image canvas is here
      <div className={classes.canvasContainer}>
        <canvas id="remotecanvas"></canvas>
      </div>
    </>
  );

  // return null; // This component does not return any HTML, so we will return 'null' instead.
}
