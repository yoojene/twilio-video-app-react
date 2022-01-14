/* eslint-disable no-var */
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack, Room, LocalDataTrackPublication } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Button, DialogActions, DialogTitle, Grid } from '@material-ui/core';
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
    marginLeft: '16px',
    '@media (max-width: 1600px)': {
      width: '500px',
    },
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
      };
      dataTrack.on('message', handleMessage);
      return () => {
        dataTrack.off('message', handleMessage);
      };
    }
  });

  return (
    <div className={classes.container}>
      {!isLivePointerOpen && !isRemoteLivePointerOpen && videoTrack && (
        // Main video track for Agent
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
      !checkIsUser() && !isLivePointerOpen ? <ImagePreview track={dataTrack} /> : ''}
      {// User Image Preview
      checkIsUser() && !isRemoteLivePointerOpen && dataTrack ? <RemoteImagePreview track={dataTrack} /> : ''}

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
