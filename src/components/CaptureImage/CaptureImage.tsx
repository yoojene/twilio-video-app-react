/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack, Room, LocalDataTrackPublication } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import {
  Backdrop,
  CircularProgress,
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Snackbar,
  Drawer,
  Slider,
} from '@material-ui/core';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import SavedImageGallery from '../SavedImageGallery/SavedImageGallery';
import ChatWindow from '../ChatWindow/ChatWindow';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import ImagePreview from '../ImagePreview/ImagePreview';
import RemoteImagePreview from '../RemoteImagePreview/RemoteImagePreview';
import { DataTrack as IDataTrack } from 'twilio-video';
import LivePointer from '../LivePointer/LivePointer';
import RemoteLivePointer from '../RemoteLivePointer/RemoteLivePointer';

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1,
    color: '#000000',
    backgroundColor: '#ffffff',
  },

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
    width: '100vw',
    // width: '1000px',
    // '@media (max-width: 1600px)': {
    //   width: '1000px',
    // },
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px',
    },
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
  galleryTitle: {
    textAlign: 'center',
  },
  galleryContainer: {
    textAlign: 'center',
  },
  zoomSlider: {
    width: 400,
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

export default function CaptureImage() {
  const classes = useStyles();
  const {
    checkIsUser,
    scale,
    isGalleryOpen,
    isLivePointerOpen,
    setIsRemoteLivePointerOpen,
    isRemoteLivePointerOpen,
    isCaptureMode,
    isBackdropOpen,
    setIsBackdropOpen,
    isImagePreviewOpen,
    captureImage,
    isVideoOpen,
    setIsImagePreviewOpen,
    setIsVideoOpen,
    setIsRemoteCaptureMode,
    isRemoteCaptureMode,
    isAnnotationSnackOpen,
    setIsAnnotationSnackOpen,
    setIsZoomMode,
    isZoomMode,
    onZoomChange,
  } = useCaptureImageContext();

  const { isChatWindowOpen } = useChatContext();

  // Local track for testing - uncomment for browser testing

  const { localTracks } = useVideoContext();
  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

  // Remote track
  const participants = useParticipants();
  const participant = participants[0];
  const publications = usePublications(participant);
  const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  const remoteVideoTrack = useTrack(videoPublication) as RemoteVideoTrack;

  // Data track

  const dataPublication = publications.find(p => p.kind === 'data');
  const dataTrack = useTrack(dataPublication) as IDataTrack;

  let videoTrack;
  if (checkIsUser()) {
    console.log('mobile');
    videoTrack = localVideoTrack;
  } else {
    console.log('desktop');
    videoTrack = remoteVideoTrack;
  }

  useEffect(() => {
    if (dataTrack) {
      const handleMessage = (event: any) => {
        if (typeof event === 'string' && event.startsWith('{"isLivePointerOpen')) {
          console.log('isLivePointer - toggle state');
          console.log(isRemoteLivePointerOpen);
          setIsRemoteLivePointerOpen(!isRemoteLivePointerOpen);
          console.log(isRemoteLivePointerOpen);
        }
        if (typeof event === 'string' && event.startsWith('{"isCaptureMode')) {
          console.log('isCaptureMode - toggle state');
          console.log(isRemoteCaptureMode);
          setIsRemoteCaptureMode(!isRemoteCaptureMode);
          console.log(isRemoteCaptureMode);
          setIsVideoOpen(!isVideoOpen);
        }
      };
      dataTrack.on('message', handleMessage);
      return () => {
        dataTrack.off('message', handleMessage);
      };
    }
  });

  useEffect(() => {
    if (isRemoteCaptureMode) {
      setIsAnnotationSnackOpen(true);
    }
  }, [isRemoteCaptureMode]);

  const handleClose = () => {
    // setIsBackdropOpen(false);
    setIsAnnotationSnackOpen(false);
  };

  const firstUpdate = useRef(true);

  // Capture effect
  useEffect(() => {
    if (isCaptureMode) {
      console.log('calling captureImage() in layout eeffect');
      captureImage();
    }
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!isCaptureMode) {
      console.log('capture off effect');
      setIsImagePreviewOpen(!isImagePreviewOpen);
      setIsVideoOpen(!isVideoOpen);
    }
  }, [isCaptureMode]);

  // useEffect(() => {
  //   console.log('annotation mode effect');
  //   console.log(isAnnotationMode);

  //   if (isAnnotationMode) {
  //     // Update remote client into Annotation Mode

  //     localDataTrackPublication.track.send(
  //       JSON.stringify({
  //         isAnnotationMode: !isAnnotationMode,
  //       })
  //     );

  //   }
  // }, [isAnnotationMode]);

  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setIsZoomMode(false);
    setOpen(!open);
  };

  return (
    <div className={classes.container}>
      {/* <Backdrop className={classes.backdrop} open={isBackdropOpen} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        message="Annotation mode"
        open={isAnnotationSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      />

      <Drawer anchor="bottom" open={isZoomMode} onClose={toggleDrawer}>
        <br></br>
        <br></br>
        <h3 className={classes.galleryTitle}>Zoom</h3>
        <Slider
          className={classes.zoomSlider}
          defaultValue={scale}
          aria-labelledby="discrete-slider-small-steps"
          step={1}
          marks
          min={1}
          max={3}
          value={scale}
          onChange={onZoomChange}
          valueLabelDisplay="auto"
        />
        <br></br>
        <br></br>
      </Drawer>

      {isVideoOpen && videoTrack && !isLivePointerOpen && !isRemoteLivePointerOpen && (
        // Main video track
        <div className={classes.preview}>
          <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
        </div>
      )}
      {isLivePointerOpen && !isRemoteLivePointerOpen && videoTrack && dataTrack ? (
        // Agent Live Pointer
        <LivePointer dataTrack={dataTrack} videoTrack={videoTrack}></LivePointer>
      ) : (
        ''
      )}

      {checkIsUser() && isRemoteLivePointerOpen && dataTrack && videoTrack ? (
        // User Live Pointer
        <RemoteLivePointer dataTrack={dataTrack} videoTrack={videoTrack} />
      ) : (
        ''
      )}

      {// Agent Image Preview
      !checkIsUser() && !isLivePointerOpen && isImagePreviewOpen ? <ImagePreview track={dataTrack} /> : ''}
      {// User Image Preview
      checkIsUser() && !isRemoteLivePointerOpen && isRemoteCaptureMode && dataTrack ? (
        <RemoteImagePreview track={dataTrack} />
      ) : (
        ''
      )}

      {isGalleryOpen ? (
        <>
          {isChatWindowOpen ? (
            <Grid item xs={3}>
              <div className={classes.galleryContainer}>
                <DialogTitle>Saved Images</DialogTitle>
                <SavedImageGallery></SavedImageGallery>
              </div>
            </Grid>
          ) : (
            <Grid item xs={6}>
              <DialogTitle className={classes.galleryTitle}>Saved Images</DialogTitle>
              <div className={classes.galleryContainer}>
                <SavedImageGallery></SavedImageGallery>
              </div>
            </Grid>
          )}
        </>
      ) : (
        ''
      )}

      {isChatWindowOpen ? (
        <Grid item xs={3}>
          <ChatWindow />
        </Grid>
      ) : (
        ''
      )}
    </div>
  );
}
