import React, { ChangeEvent, useState, FormEvent, useEffect, useCallback } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import { InputLabel, Link, Theme } from '@material-ui/core';
import IntroContainer from '../IntroContainer/IntroContainer';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import useUser from '../../utils/useUser/useUser';
const useStyles = makeStyles((theme: Theme) => ({
  googleButton: {
    background: 'white',
    color: 'rgb(0, 94, 166)',
    borderRadius: '4px',
    border: '2px solid rgb(2, 122, 197)',
    margin: '1.8em 0 0.7em',
    textTransform: 'none',
    boxShadow: 'none',
    padding: '0.3em 1em',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    '&:hover': {
      background: 'white',
      boxShadow: 'none',
    },
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
  gutterBottom: {
    marginBottom: '1em',
  },
  passcodeContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  submitButton: {
    borderRadius: '16px',
    marginTop: '20px',
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
  },
  passcodeLabel: {
    textAlign: 'center',
    paddingBottom: '10px',
  },
  passcodeInput: {
    border: '10px',
  },
  ppLink: {
    marginTop: '20px',
  },
}));

interface JoinCallResponse {
  sessionId: string;
  roomName: string;
  agentName: string;
  userName: string;
  error?: any;
}
export default function LoginPage() {
  const classes = useStyles();
  const { signIn, isAuthReady } = useAppState();
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);

  const checkIsUser = useUser();

  const isAuthEnabled = Boolean(process.env.REACT_APP_SET_AUTH);

  const login = () => {
    setAuthError(null);
    signIn?.(passcode)
      .then(() => {
        history.replace(location?.state?.from || { pathname: '/' });
      })
      .catch(err => setAuthError(err));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  // if (user || !isAuthEnabled) {
  //   console.log(user);
  //   console.log(isAuthEnabled);

  //   if (checkIsUser()) {
  //     history.replace('/room/101/name/User');
  //   } else {
  //     history.replace('/room/101/name/Agent');
  //   }
  // }

  const fetchCallDetails = useCallback(async () => {
    try {
      const response = await fetch(process.env.REACT_APP_JOIN_ENDPOINT!);
      const body: JoinCallResponse = await response.json();
      console.log(body);
      return body;
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCallDetails()
      .then(res => {
        console.log(res);

        // TODO handle error from API, this should be in the .catch ()
        if (res!.error) {
          // setAuthError(new Error(res!.error.message));
          throw new Error(res!.error.message);
        }

        localStorage.setItem('sessionId', res!.sessionId);
        localStorage.setItem('agentName', res!.agentName);
        localStorage.setItem('userName', res!.userName);
        localStorage.setItem('roomName', res!.roomName);

        setPasscode(res!.sessionId);
      })
      .catch(err => console.error(err));
  }, []);

  if (!isAuthReady) {
    return null;
  }

  return (
    <IntroContainer>
      {process.env.REACT_APP_SET_AUTH === 'firebase' && (
        <>
          <Typography variant="h5" className={classes.gutterBottom}>
            Sign in to join a room
          </Typography>
          <Typography variant="body1">Sign in using your Twilio Google Account</Typography>
          <Button variant="contained" className={classes.googleButton} onClick={login} startIcon={<GoogleLogo />}>
            Sign in with Google
          </Button>
        </>
      )}

      {process.env.REACT_APP_SET_AUTH === 'passcode' && (
        <>
          <form onSubmit={handleSubmit}>
            <Grid container justifyContent="space-between">
              <div className={classes.passcodeContainer}>
                <InputLabel className={classes.passcodeLabel} htmlFor="input-passcode">
                  SESSION ID
                </InputLabel>
                <TextField
                  className={classes.passcodeInput}
                  id="input-passcode"
                  value={passcode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasscode(e.target.value)}
                  type="password"
                  variant="outlined"
                  size="small"
                />
                <div>
                  {authError && (
                    <Typography variant="caption" className={classes.errorMessage}>
                      <ErrorOutlineIcon />
                      {authError.message}
                    </Typography>
                  )}
                </div>
              </div>
            </Grid>
            <Grid container justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!passcode.length}
                className={classes.submitButton}
              >
                CONNECT
              </Button>
            </Grid>
          </form>
          <Typography className={classes.ppLink} variant="body1" align="center">
            By proceeding you agree to our&nbsp;
            <Link href="https://www.hostcomm.co.uk/support/privacy-policy">Privacy Policy</Link>
          </Typography>
        </>
      )}
    </IntroContainer>
  );
}
