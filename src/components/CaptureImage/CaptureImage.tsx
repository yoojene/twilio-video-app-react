import { makeStyles } from '@material-ui/styles';
import React from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';
import * as markerjs2 from 'markerjs2';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Button, DialogActions, DialogTitle } from '@material-ui/core';
import Predictions from '@aws-amplify/predictions';

import useTrack from '../../hooks/useTrack/useTrack';
import usePublications from '../../hooks/usePublications/usePublications';
import useParticipants from '../../hooks/useParticipants/useParticipants';

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
    width: '320px',
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
  canvas: {
    display: 'none',
  },
  buttonContainer: {
    marginTop: '3rem',
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
  const imgRef = React.createRef<HTMLImageElement>();

  const classes = useStyles();
  const { getVideoElementFromDialog, setVideoOnCanvas, saveImageToStorage, setPhoto } = useCaptureImageContext();

  // Local track for testing - uncomment for browser testing

  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  // Remote track
  // const participants = useParticipants();
  // const participant = participants[0];
  // console.log(participant)
  // const publications = usePublications(participant);
  // const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  // const videoTrack = useTrack(videoPublication) as RemoteVideoTrack;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        setPhoto(canvas);
      }
    }
  };

  const saveImage = () => {
    saveImageToStorage();
  };

  const annotateImage = () => {
    showMarkerArea();
  };

  const performOCR = () => {
    // Get element.getBoundingClientRect from image with marker
    const boundingBox = document.getElementsByTagName('rect')[0]; // appears to show two rects for rectangle marker
    const domRect = boundingBox.getBoundingClientRect();
    console.log(domRect);

    // Connect and sent to Reckonition API

    // Predictions.identify({

    // })

    // Predictions.identify({
    // text: {
    //     source: {
    //         file
    //     },
    //     format: "PLAIN",
    // }
    //   })
    //   .then(response => {
    //       const {
    //           text: {
    //               fullText, // String
    //               lines, // Array of String ordered from top to bottom
    //               linesDetailed: [
    //                   {
    //                       /* array of
    //                       text, // String
    //                       boundingBox: {
    //                           width, // ratio of overall image width
    //                           height, // ratio of overall image height
    //                           left, // left coordinate as a ratio of overall image width
    //                           top // top coordinate as a ratio of overall image height
    //                       },
    //                       polygon // Array of { x, y } coordinates as a ratio of overall image width and height
    //                       */
    //                   }
    //               ],
    //               words // Array of objects that contains { text, boundingBox, polygon}
    //           }
    //       } = response
    //   })
    //   .catch(err => console.log({ err }));

    // const config = new AWS.Config({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // });

    // AWS.config.update({ region: 'region' });

    // const client = new AWS.Rekognition();

    // console.log(client);

    // client.detectText();
  };

  const showMarkerArea = () => {
    if (imgRef.current !== null) {
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(imgRef.current);

      // TODO change this to just FrameMarker for OCR "mode"
      markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

      // attach an event handler to assign annotated image back to our image element
      markerArea.addRenderEventListener(dataUrl => {
        if (imgRef.current) {
          imgRef.current.src = dataUrl;
        }
      });
      // launch marker.js
      markerArea.show();
    }
  };

  return (
    <div className={classes.container}>
      <DialogTitle>Capture Image</DialogTitle>
      {videoTrack && (
        <div className={classes.preview}>
          <VideoTrack id={'capture-video'} track={videoTrack} />
        </div>
      )}
      <canvas id="canvas" className={classes.canvas}></canvas>
      <div className={classes.imagePreview}>
        <img
          id="photo"
          src={imagePlaceholder}
          alt="The screen capture will appear in this box."
          className={classes.photoPreview}
          ref={imgRef}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained" className={classes.button} onClick={captureImage}>
          Capture
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={annotateImage}>
          Annotate
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={performOCR}>
          OCR
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={saveImage}>
          Save
        </Button>
      </div>
    </div>
  );
}
