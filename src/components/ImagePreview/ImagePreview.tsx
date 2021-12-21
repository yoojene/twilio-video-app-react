import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef } from 'react';
import imagePlaceholder from '../../images/import_placeholder-90.png';

import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { DataTrack as IDataTrack } from 'twilio-video';

const useStyles = makeStyles(() => ({
  photoPreview: {
    '@media (max-width: 1600px)': {
      width: '787px',
    },
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
    marginLeft: '16px',
  },
}));

export default function ImagePreview({ track }: { track?: IDataTrack }) {
  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const { setImageRef, setImageFromCanvas } = useCaptureImageContext();
  setImageRef(imgRef);

  const classes = useStyles();

  console.log(imgRef);

  useEffect(() => {
    if (track) {
      let count = 0;
      let buf: Uint8ClampedArray;
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
          const remotecanvas = document.getElementById('canvas') as HTMLCanvasElement;

          const ctx = remotecanvas.getContext('2d');
          remotecanvas.width = canvasWidthNum;
          remotecanvas.height = canvasHeightNum;

          const img = ctx?.createImageData(canvasWidthNum, canvasHeightNum);
          img!.data.set(buf);
          ctx?.putImageData(img!, 0, 0);
          setImageFromCanvas();
        }
      };
      track.on('message', handleMessage);
      return () => {
        track.off('message', handleMessage);
      };
    }
  }, [track]);

  return (
    <>
      <div className={classes.canvasContainer}>
        <canvas id="canvas" className={classes.canvas}></canvas>
      </div>
      <div className={classes.photoContainer}>
        <img
          id="photo"
          src={imagePlaceholder}
          alt="The screen capture will appear in this box."
          className={classes.photoPreview}
          ref={imgRef}
        />
      </div>
    </>
  );
}
