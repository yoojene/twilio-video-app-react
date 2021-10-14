import React from 'react';
import { Divider, Dialog, DialogActions, Button, Theme, DialogTitle, makeStyles } from '@material-ui/core';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { LocalVideoTrack } from 'twilio-video';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';

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
}));

export default function CaptureImageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();
  const { getVideoElementFromDialog, setVideoOnCanvas } = useCaptureImageContext();

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      setVideoOnCanvas(video);
    }
  };

  const saveImage = () => {
    console.log('saving image');
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Capture Image</DialogTitle>
      <Divider />
      {localVideoTrack && (
        <div>
          <VideoTrack id={'capture-video'} isLocal track={localVideoTrack} />
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
