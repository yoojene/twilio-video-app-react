import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack, Room } from 'twilio-video';
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
  const { checkIsUser, scale, isGalleryOpen } = useCaptureImageContext();

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

  let videoTrack;
  if (checkIsUser()) {
    console.log('mobile');
    videoTrack = localVideoTrack;
  } else {
    console.log('desktop');
    videoTrack = remoteVideoTrack;
  }

  // const capabilities = videoTrack!.mediaStreamTrack.getCapabilities()
  // console.log(capabilities)

  // const settings = videoTrack!.mediaStreamTrack.getSettings();
  // console.log(settings)

  // videoTrack!.mediaStreamTrack.applyConstraints({ "advanced": [{ "zoom": 2.0 }]  as any})

  // const media = navigator.mediaDevices.getUserMedia({video: true});

  // media.then(mediaStream => {
  //   console.log(mediaStream);

  //   const track = mediaStream.getVideoTracks()[0];
  //   const capabilities = track.getCapabilities();
  //   const settings = track.getSettings();

  //   console.log(track)
  //   console.log(capabilities)
  //   console.log(settings)

  //   // get current zoom level
  //   const currentZoomLevel = (settings as any).zoom;
  //   console.log(currentZoomLevel)
  //apply new zoom level of '2.0'
  // track.applyConstraints({ advanced: [{ "zoom": 2.0 }] } as any);

  // })

  // if (videoTrack) {
  //   const capabilities = videoTrack.mediaStreamTrack.getCapabilities();
  //   console.log('capabilities')
  //   console.log(capabilities)
  //   const settings = videoTrack.mediaStreamTrack.getSettings();

  //   console.log('settings')
  //   console.log(settings)

  //   // console.log(capabilities.zoom)

  //   // videoTrack.mediaStreamTrack.applyConstraints({ advanced: [{ zoom: 2.0 }] } as any)
  //   // videoTrack.mediaStreamTrack.applyConstraints({ advanced: [{ torch: true }] } as any)
  // }

  // const media = navigator.mediaDevices.getUserMedia({video: true});

  // media.then(mediaStream => {
  //   console.log('in navigator get user media then');
  //   console.log(mediaStream);

  //   const tracks = mediaStream.getVideoTracks();

  //   console.log(tracks)

  //   const track = mediaStream.getVideoTracks()[0];
  //   const capabilities = track.getCapabilities();
  //   const settings = track.getSettings();

  //   console.log(track)
  //   console.log(capabilities)
  //   console.log(settings)

  // get current zoom level
  // const currentZoomLevel = (settings as any).zoom;
  // console.log(currentZoomLevel)
  // apply new zoom level of '2.0'
  // track.applyConstraints({ advanced: [{ "zoom": 2.0 }] } as any);

  // })

  // const performOCR = () => {
  //   // Get element.getBoundingClientRect from image with marker
  //   const boundingBox = document.getElementsByTagName('rect')[0]; // appears to show two rects for rectangle marker
  //   const domRect = boundingBox.getBoundingClientRect();
  //   console.log(domRect);
  // };

  return (
    <>
      <div className={classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {videoTrack && (
              <div className={classes.preview}>
                <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
              </div>
            )}
            <ImagePreview />
            {checkIsUser() ? <RemoteImagePreview /> : ''}
          </Grid>
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
        </Grid>
      </div>
    </>
  );
}
