import React from 'react';
import { Divider, Dialog, DialogActions, Button, Theme, DialogTitle, makeStyles, Typography } from '@material-ui/core';
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
  const { getVideoElementFromDialog } = useCaptureImageContext();

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  const captureImage = () => {
    const video = getVideoElementFromDialog();
    if (video) {
      // console.log(video)
      // let vid = video as HTMLMediaElement;
      // console.log(vid.srcObject)
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      // canvas.style = 'display:none'

      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 320;
        canvas.height = 200;
        ctx?.drawImage(video as CanvasImageSource, 0, 0, canvas.width, canvas.height);

        // const data = canvas.toDataURL('image/png');
        // const photo = document.getElementById('photo');
        // photo?.setAttribute('src', data);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Capture Image</DialogTitle>
      <Divider />
      {/* <DialogContent className={classes.headline}>** Captured image placeholder **</DialogContent> */}
      {localVideoTrack && (
        <div>
          <VideoTrack id={'capture-video'} isLocal track={localVideoTrack} />
        </div>
      )}
      <Divider />
      {/* <Typography variant="h6">
         Captured Image
      </Typography> */}
      <canvas id="canvas"></canvas>
      {/* <div>
        <img id="photo" alt="The screen capture will appear in this box."/> 
      </div> */}
      <Divider />
      <DialogActions>
        <Button color="primary" variant="contained" className={classes.button} onClick={captureImage}>
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
}
