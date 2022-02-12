import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Typography,
  makeStyles,
  TextField,
  Grid,
  Button,
  InputLabel,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useUser from '../../../utils/useUser/useUser';
import useRoomState from '../../../hooks/useRoomState/useRoomState';
import { AGENTNAME, ROOMNAME, USERNAME } from '../../../constants';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user, getToken } = useAppState();
  const roomState = useRoomState();

  const { connect: videoConnect } = useVideoContext();
  const { connect: chatConnect } = useChatContext();

  const [isLoading, setIsLoading] = useState(false);

  const checkIsUser = useUser();

  // const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  // const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setRoomName(event.target.value);
  // };

  // const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // if (!window.location.origin.includes('twil.io')) {
    //   window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    // }
    // setStep(Steps.deviceSelectionStep);

    setIsLoading(true);
    getToken(name, roomName).then(({ token }) => {
      videoConnect(token);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);

      // Add slight delay so screen transition happens without button reappearing
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  const connectVideoSession = () => {
    getToken(name, roomName).then(({ token }) => {
      videoConnect(token);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);

      // Add slight delay so screen transition happens without button reappearing
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  // Repopulate default name and roomName params which are lost after a refresh or disconnection
  useEffect(() => {
    setIsLoading(true);

    if (!name) {
      checkIsUser() ? (name = USERNAME) : (name = AGENTNAME);
    }
    if (!roomName) {
      roomName = ROOMNAME;
    }

    // NB this will auto log back in the room after 2.5s being disonnected, need better solution
    setTimeout(() => {
      connectVideoSession();
    }, 2500);
  }, []);

  return (
    <>
      <Typography variant="body1"></Typography>
      <form onSubmit={handleSubmit}>
        <Grid container justifyContent="center" alignItems="center">
          {isLoading && roomState === 'disconnected' ? <CircularProgress /> : ''}
        </Grid>
      </form>
    </>
  );
}
