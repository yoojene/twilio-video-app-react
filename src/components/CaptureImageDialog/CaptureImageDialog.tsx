import React from 'react';
import {
  Divider,
  Dialog,
  DialogActions,
  Button,
  Theme,
  DialogTitle,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import VideoTrack from '../VideoTrack/VideoTrack';
import { Participant, RemoteVideoTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import useTrack from '../../hooks/useTrack/useTrack';
import usePublications from '../../hooks/usePublications/usePublications';

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
}));

interface CaptureImageDialogProps {
  open: boolean;
  onClose: () => void;
  participant: Participant;
}

export default function CaptureImageDialog({ open, onClose, participant }: CaptureImageDialogProps) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { getVideoElementFromDialog, setVideoOnCanvas, saveImageAndOpen } = useCaptureImageContext();
  // const { localTracks } = useVideoContext();
  // const videoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;
  // console.log(participant)
  const publications = usePublications(participant);
  const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  const videoTrack = useTrack(videoPublication) as RemoteVideoTrack;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      setVideoOnCanvas(video);
    }
  };

  const saveImage = () => {
    console.log('saving image');
    saveImageAndOpen();
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Capture Image</DialogTitle>
      <Divider />
      {videoTrack && (
        <div className={classes.preview}>
          <VideoTrack id={'capture-video'} track={videoTrack} />
        </div>
      )}
      <Divider />
      <canvas id="canvas"></canvas>
      {/* <div>
        <img id="photo" alt="The screen capture will appear in this box."/> 
      </div> */}
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
