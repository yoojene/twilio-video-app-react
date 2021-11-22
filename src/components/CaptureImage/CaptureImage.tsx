import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';

import { LocalVideoTrack, Participant, RemoteVideoTrack, Room } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import imagePlaceholder from '../../images/import_placeholder-90.png';
import * as markerjs2 from 'markerjs2';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import { Button, DialogActions, DialogTitle, Grid } from '@material-ui/core';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import SavedImageGallery from '../SavedImageGallery/SavedImageGallery';
import ChatWindow from '../ChatWindow/ChatWindow';
import useChatContext from '../../hooks/useChatContext/useChatContext';

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
    '@media (max-width: 1600px)': {
      width: '500px',
    },
    maxHeight: '600px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '600px',
    },
  },
  photoPreview: {
    '@media (max-width: 1600px)': {
      width: '500px',
    },
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
  photoContainer: {
    width: '100%',
    textAlign: 'center',
  },
  galleryTitle: {
    textAlign: 'center',
  },
  galleryContainer: {
    // display: 'flex',
    justifyContent: 'center',
  },
}));

export default function CaptureImage() {
  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const classes = useStyles();
  const { createMarkerArea, isMarkupPanelOpen, setImageRef, scale } = useCaptureImageContext();

  setImageRef(imgRef);

  const { isChatWindowOpen } = useChatContext();

  // Local track for testing - uncomment for browser testing

  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;

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

  // Remote track
  // const participants = useParticipants();
  // const participant = participants[0];
  // const publications = usePublications(participant);
  // const videoPublication = publications.find(p => !p.trackName.includes('screen') && p.kind === 'video');
  // const videoTrack = useTrack(videoPublication) as RemoteVideoTrack;

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
        <DialogTitle>Capture Image</DialogTitle>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            {videoTrack && (
              <div className={classes.preview}>
                <VideoTrack id={'capture-video'} track={videoTrack} scale={scale} />
              </div>
            )}

            <div className={classes.canvasContainer}>
              <canvas id="canvas" className={classes.canvas}></canvas>
            </div>
            <div className={classes.photoContainer}>
              <img
                id="photo"
                src={imagePlaceholder}
                alt="The screen capture will appear in this box."
                className={classes.photoPreview}
                ref={imgRef}
              />
            </div>
          </Grid>
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
          {isChatWindowOpen ? (
            <Grid item xs={3}>
              <ChatWindow />
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </div>
      <div className={classes.buttonContainer}>
        {/* <Button color="primary" variant="contained" className={classes.button} onClick={performOCR}>
          OCR
        </Button> */}
      </div>
    </>
  );
}
