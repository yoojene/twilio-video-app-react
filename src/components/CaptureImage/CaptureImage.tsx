import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';
import * as markerjs2 from 'markerjs2';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Button, DialogActions, DialogTitle } from '@material-ui/core';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '2rem',
  },
  container: {
    height: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    background: 'white',
    overflowY: 'scroll',
  },
  preview: {
    width: '1000px',
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px',
    },
  },
  photoPreview: {
    width: '320px',
    backgroundSize: 'auto',
  },
  canvasContainer: {
    width: '100%',
    textAlign: 'center',
  },
  canvas: {
    display: 'none',
  },
  buttonContainer: {
    marginTop: '-5rem',
    padding: '16px',
    marginLeft: '8px',
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    textAlign: 'center',
    marginLeft: '8px',
    // "> :not(:first-child)" :{
    //    // marginLeft: '8px',
    // }
  },
  imagePreview: {
    marginTop: '3rem',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function CaptureImage() {
  const [scale, setScale] = useState(1);

  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const classes = useStyles();
  const {
    getVideoElementFromDialog,
    setVideoOnCanvas,
    saveImageToStorage,
    setPhotoFromCanvas,
    createMarkerArea,
    isMarkupPanelOpen,
  } = useCaptureImageContext();

  // Local track for testing - uncomment for browser testing

  // const { localTracks } = useVideoContext();
  // const videoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  // Remote track
  const participants = useParticipants();
  const participant = participants[0];
  console.log(participant);
  const publications = usePublications(participant);
  const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  const videoTrack = useTrack(videoPublication) as RemoteVideoTrack;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video, scale);
      if (canvas) {
        setPhotoFromCanvas(canvas);
      }
    }
  };

  const saveImage = () => {
    saveImageToStorage();
  };

  const annotateImage = () => {
    console.log(imgRef);
    const markerArea = createMarkerArea(imgRef);
    console.log(markerArea);
    console.log(isMarkupPanelOpen);

    if (!isMarkupPanelOpen) {
      markerArea.show();
    } else {
      markerArea.close();
    }
  };

  const performOCR = () => {
    // Get element.getBoundingClientRect from image with marker
    const boundingBox = document.getElementsByTagName('rect')[0]; // appears to show two rects for rectangle marker
    const domRect = boundingBox.getBoundingClientRect();
    console.log(domRect);
  };

  const zoomOne = () => {
    setScale(1);
  };
  const zoomTwo = () => {
    setScale(2);
  };
  const zoomThree = () => {
    setScale(3);
  };

  // const handleMarkerArea = () => {

  //   if (imgRef.current !== null) {

  //     // create a marker.js MarkerArea
  //     const markerArea = new markerjs2.MarkerArea(imgRef.current);

  //     // TODO change this to just FrameMarker for OCR "mode"
  //     markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

  //     // attach an event handler to assign annotated image back to our image element
  //     markerArea.addRenderEventListener(dataUrl => {
  //       if (imgRef.current) {
  //         imgRef.current.src = dataUrl;
  //       }
  //     });
  //     // launch marker.js
  //     markerArea.show();
  //     // markerArea.close()
  //   }
  // };

  return (
    <>
      <div className={classes.container}>
        <DialogTitle>Capture Image</DialogTitle>
        {videoTrack && (
          <div className={classes.preview}>
            <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
          </div>
        )}
        <div className={classes.canvasContainer}>
          <canvas id="canvas" className={classes.canvas}></canvas>
        </div>
        <div className={classes.imagePreview}>
          <img
            id="photo"
            src={imagePlaceholder}
            alt="The screen capture will appear in this box."
            className={classes.photoPreview}
            ref={imgRef}
          />
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained" className={classes.button} onClick={captureImage}>
          Capture
        </Button>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={annotateImage}
          disabled={isMarkupPanelOpen}
        >
          Annotate
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={performOCR}>
          OCR
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={saveImage}>
          Save
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={zoomOne}>
          1X
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={zoomTwo}>
          2X
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={zoomThree}>
          3X
        </Button>
      </div>
    </>
  );
}
