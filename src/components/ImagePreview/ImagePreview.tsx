import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef } from 'react';
import imagePlaceholder from '../../images/import_placeholder-90.png';

import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';

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

export default function ImagePreview() {
  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const { setImageRef } = useCaptureImageContext();
  setImageRef(imgRef);

  const classes = useStyles();

  console.log(imgRef);

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
