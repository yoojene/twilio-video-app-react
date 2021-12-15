/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';

const useStyles = makeStyles(() => ({
  canvasContainer: {
    width: '100%',
    textAlign: 'center',
  },
}));
export default function RemoteImagePreview({ track }: { track: IDataTrack }) {
  const classes = useStyles();

  useEffect(() => {
    let count = 0;
    var buf: Uint8ClampedArray;
    let canvasWidthNum: number;
    let canvasHeightNum: number;
    const handleMessage = (event: ArrayBuffer | string) => {
      if (typeof event === 'string' && event.startsWith('canvas')) {
        // eslint-disable-next-line prefer-const
        const canvasWidth = event.slice(event.indexOf(':') + 1, event.indexOf(','));
        // eslint-disable-next-line prefer-const
        const canvasHeight = event.slice(event.lastIndexOf(':') + 1);

        canvasWidthNum = +canvasWidth;
        canvasHeightNum = +canvasHeight;

        return Promise.resolve([canvasWidthNum, canvasHeightNum]);
      }
      if (typeof event === 'string') {
        // eslint-disable-next-line no-var
        buf = new Uint8ClampedArray(parseInt(event));
        count = 0;
        console.log('Expecting a total of ' + buf.byteLength + ' bytes');
        return;
      }

      const data = new Uint8ClampedArray(event);

      buf.set(data, count);
      count += data.byteLength;

      if (count === buf.byteLength) {
        console.log('Done can render photo now');
        const remotecanvas = document.getElementById('remotecanvas') as HTMLCanvasElement;

        const ctx = remotecanvas.getContext('2d');
        remotecanvas.width = canvasWidthNum;
        remotecanvas.height = canvasHeightNum;

        const img = ctx?.createImageData(canvasWidthNum, canvasHeightNum);
        img!.data.set(buf);
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
      <div className={classes.canvasContainer}>
        <canvas id="remotecanvas"></canvas>
      </div>
    </>
  );
}
