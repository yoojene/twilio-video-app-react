import React from 'react';
import { Divider, Dialog, DialogActions, Button, Theme, DialogTitle, makeStyles } from '@material-ui/core';
import VideoTrack from '../VideoTrack/VideoTrack';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import useTrack from '../../hooks/useTrack/useTrack';
import usePublications from '../../hooks/usePublications/usePublications';
import * as markerjs2 from 'markerjs2';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '600px',
    minHeight: '400px',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 32px)',
    },
    '& .inputSelect': {
      width: 'calc(100% - 35px)',
    },
  },
  button: {
    float: 'right',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
    },
  },
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0.8em',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
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
}));

interface CaptureImageDialogProps {
  open: boolean;
  onClose: () => void;
  participant: Participant;
}

export default function CaptureImageDialog({ open, onClose, participant }: CaptureImageDialogProps) {
  const imgRef = React.createRef<HTMLImageElement>();

  const classes = useStyles();
  const {
    getVideoElementFromDialog,
    setVideoOnCanvas,
    saveImageToStorage,
    setPhotoFromCanvas,
  } = useCaptureImageContext();
  // Local track for testing
  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  // Remote track
  // console.log(participant)
  // const publications = usePublications(participant);
  // const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  // const videoTrack = useTrack(videoPublication) as RemoteVideoTrack;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        setPhotoFromCanvas(canvas);
        showMarkerArea();
      }
    }
  };

  const saveImage = () => {
    console.log('saving image');
    saveImageToStorage();
  };

  const showMarkerArea = () => {
    if (imgRef.current !== null) {
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(imgRef.current);
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
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Capture Image</DialogTitle>
      <Divider />
      {videoTrack && (
        <div className={classes.preview}>
          <VideoTrack id={'capture-video'} track={videoTrack} />
        </div>
      )}
      <Divider />
      <canvas id="canvas" className={classes.canvas}></canvas>
      <div>
        <img
          id="photo"
          src={imagePlaceholder}
          alt="The screen capture will appear in this box."
          className={classes.photoPreview}
          ref={imgRef}
          onClick={() => showMarkerArea()}
        />
      </div>
      <Divider />
      <DialogActions>
        <Button color="primary" variant="contained" className={classes.button} onClick={saveImage}>
          Save
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={captureImage}>
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
}
