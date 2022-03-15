/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Backdrop, CircularProgress, Grid, Snackbar, Drawer, Slider, Theme } from '@material-ui/core';
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
import useUser from '../../utils/useUser/useUser';

const useStyles = makeStyles((theme: Theme) => ({
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
    background: theme.palette.background.default,
    overflowY: 'scroll',
    paddingTop: '16px',
  },
  preview: {
    width: '100vw',
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px !important' as any,
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
  },
  drawerTitle: {
    textAlign: 'center',
    padding: '16px',
  },
  galleryContainer: {
    padding: '16px',
  },
  zoomSlider: {
    width: 400,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  ocrText: {
    padding: '16px',
    maxWidth: '30vw',
  },
}));

export default function CaptureImage() {
  const classes = useStyles();
  const {
    scale,
    isGalleryOpen,
    setIsGalleryOpen,
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
    isCaptureSnackOpen,
    setIsCaptureSnackOpen,
    setSnackMessage,
    snackMessage,
    setIsZoomMode,
    isZoomMode,
    onZoomChange,
    isOCRMode,
    setIsOCRMode,
    OCRText,
  } = useCaptureImageContext();

  const checkIsUser = useUser();

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
          return;
        }
        if (typeof event === 'string' && event.startsWith('{"isCaptureMode')) {
          console.log('isCaptureMode - toggle state');
          console.log(isRemoteCaptureMode);
          setIsRemoteCaptureMode(!isRemoteCaptureMode);
          console.log(isRemoteCaptureMode);
          setIsVideoOpen(!isVideoOpen);
          return;
        }
        if (typeof event === 'string' && event.startsWith('{"isSendingAnnotation')) {
          console.log('isSendingAnnotation - toggle state');
          setIsCaptureSnackOpen(true);
          setSnackMessage(`${!checkIsUser() ? 'User' : 'Agent'} is annotating, please wait...`);
          return;
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
      setIsCaptureSnackOpen(true);
      setSnackMessage(`Host is capturing image, please wait...`);
    }
  }, [isRemoteCaptureMode]);

  const handleClose = () => {
    // setIsBackdropOpen(false);
    setIsCaptureSnackOpen(false);
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

  const [open, setOpen] = useState(true);

  const toggleZoomDrawer = () => {
    setIsZoomMode(false);
    setOpen(!open);
  };

  const toggleDrawer = () => {
    console.log('toggleDrawer');
    setIsOCRMode(false);
  };

  const toggleGalleryDrawer = () => {
    setIsGalleryOpen(false);
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
        message={snackMessage}
        open={isCaptureSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      />

      <Drawer anchor="bottom" open={isZoomMode} onClose={toggleZoomDrawer}>
        <h3 className={classes.drawerTitle}>Zoom</h3>
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

      <Drawer anchor="right" open={isOCRMode} onClose={toggleDrawer}>
        <br></br>
        <br></br>
        <h3 className={classes.drawerTitle}>Captured Text</h3>
        <div className={classes.ocrText}>{OCRText}</div>
        <br></br>
        <br></br>
      </Drawer>

      {isVideoOpen && videoTrack && !isLivePointerOpen && !isRemoteLivePointerOpen && (
        // Main video track
        <div className={classes.preview}>
          <VideoTrack id={'capture-video'} track={videoTrack} />
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

      <Drawer anchor="right" open={isGalleryOpen} onClose={toggleGalleryDrawer}>
        <br></br>
        <br></br>
        <h3 className={classes.drawerTitle}>Saved Images</h3>
        <div className={classes.galleryContainer}>
          <SavedImageGallery></SavedImageGallery>
        </div>
        <br></br>
        <br></br>
      </Drawer>

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
