/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';

const useStyles = makeStyles(() => ({
  title: {
    marginLeft: '16px',
  },
  photoPreview: {
    // '@media (max-width: 1600px)': {
    //   width: '787px',
    // },
    width: '100vw',
  },
  canvasContainer: {
    width: '100%',
    textAlign: 'center',
  },
  canvas: {
    display: 'none',
  },
  photoContainer: {
    width: '100%',
    textAlign: 'center',
  },
}));
export default function RemoteImagePreview({ track }: { track: IDataTrack }) {
  const classes = useStyles();

  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const { setImageRef, setRemoteImageFromCanvas } = useCaptureImageContext();

  useEffect(() => {
    console.log('setting imgRef in useEffect');
    setImageRef(imgRef);
  });

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

        console.log(canvasWidthNum);
        console.log(canvasHeightNum);

        return Promise.resolve([canvasWidthNum, canvasHeightNum]);
      }

      if (typeof event === 'string' && event.startsWith('data-send-complete')) {
        const remotecanvas = document.getElementById('canvas') as HTMLCanvasElement;

        const ctx = remotecanvas.getContext('2d');
        remotecanvas.width = canvasWidthNum;
        remotecanvas.height = canvasHeightNum;
        console.log('Done can render photo now');

        const img = ctx?.createImageData(canvasWidthNum, canvasHeightNum);
        img!.data.set(buf);
        ctx?.putImageData(img!, 0, 0);
        setRemoteImageFromCanvas();
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

      console.log(count);
      console.log(buf.byteLength);
    };
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return (
    <>
      <div className={classes.canvasContainer}>
        <canvas id="canvas" className={classes.canvas}></canvas>
      </div>
      {
        <div className={classes.photoContainer}>
          <img
            id="remotephoto"
            // src={imagePlaceholder}
            // alt="The photo capture will appear in this box."
            className={classes.photoPreview}
            ref={imgRef}
          />
        </div>
      }
    </>
  );
}
