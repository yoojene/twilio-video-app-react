/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';

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
  photoContainer: {
    width: '100%',
    textAlign: 'center',
    marginLeft: '16px',
  },
}));
export default function RemoteImagePreview({ track }: { track: IDataTrack }) {
  const classes = useStyles();

  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const { setImageRef, isAnnotating } = useCaptureImageContext();
  setImageRef(imgRef);

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
      {isAnnotating ? (
        <div className={classes.photoContainer}>
          <img
            id="photo"
            src={imagePlaceholder}
            alt="The screen capture will appear in this box."
            className={classes.photoPreview}
            ref={imgRef}
          />
        </div>
      ) : (
        ''
      )}
    </>
  );
}
