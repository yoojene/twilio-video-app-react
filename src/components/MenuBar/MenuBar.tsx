import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from './Menu/Menu';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid, Hidden } from '@material-ui/core';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleChatButton from '../Buttons/ToggleChatButton/ToggleChatButton';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useCaptureImageContext from '../../hooks/useCaptureImageContext/useCaptureImageContext';
import SaveCaptureImageButton from '../Buttons/SaveCaptureImageButton/SaveCaptureImageButton';
import CaptureImageButton from '../Buttons/CaptureImageButton/CaptureImageButton';
import AnnotateButton from '../Buttons/AnnotateButton/AnnotateButton';
import ZoomButton from '../Buttons/ZoomButton/ZoomButton';
import ToggleGalleryButton from '../Buttons/ToggleGalleryButton/ToggleGalleryButton';
import RemoteAnnotateButton from '../Buttons/RemoteAnnotateButton/RemoteAnnotateButton';
import ToggleLivePointerButton from '../Buttons/ToggleLivePointerButton/ToggleLivePointerButton';
import OCRButton from '../Buttons/OCRButton/OCRButton';
import useUser from '../../utils/useUser/useUser';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.secondary.main,
      bottom: 0,
      left: 0,
      right: 0,
      height: `${theme.footerHeight}px`,
      position: 'fixed',
      display: 'flex',
      padding: '0 1.43em',
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 8,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: '0 2em',
        '&:hover': {
          color: '#600101',
          border: `2px solid #600101`,
          background: '#FFE9E7',
        },
      },
    },
    hideMobile: {
      display: 'initial',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const participants = useParticipants();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const noParticipants = participants.length === 0;
  const { room } = useVideoContext();
  const checkIsUser = useUser();
  const { isRemoteCaptureMode } = useCaptureImageContext();

  // Local testing
  // switch noParticipants to !noParticipants when not testing on single feed

  return (
    <>
      {isSharingScreen && (
        <Grid container justifyContent="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={classes.container}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">{room!.name}</Typography>
            </Grid>
          </Hidden>
          <Grid>
            <ToggleAudioButton disabled={isReconnecting} />
            {!noParticipants ? (
              <>
                {!checkIsUser() ? <CaptureImageButton /> : ''}
                {!checkIsUser() ? <AnnotateButton /> : ''}
                {!checkIsUser() ? <OCRButton /> : ''}
                {!checkIsUser() ? <SaveCaptureImageButton /> : ''}
                {!checkIsUser() ? <ToggleGalleryButton /> : ''}
                {!checkIsUser() ? <ZoomButton /> : ''}
                {!checkIsUser() ? <ToggleLivePointerButton /> : ''}
                {checkIsUser() && isRemoteCaptureMode ? <RemoteAnnotateButton /> : ''}
                {process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && <ToggleChatButton />}
              </>
            ) : (
              ''
            )}
            <Hidden smDown>
              <Menu />
            </Hidden>
          </Grid>
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                <EndCallButton />
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </footer>
    </>
  );
}
