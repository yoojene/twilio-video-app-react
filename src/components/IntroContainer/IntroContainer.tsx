import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';
import HostcommImg from '../../images/hostcomm/Hostcomm_Logo_trans.png';
const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    height: '100%',
  },
  topBanner: {
    position: 'absolute',
    top: '0',
    height: '40%',
    backgroundColor: `${theme.palette.primary.main}`,
    width: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    width: '50%',
    height: '379px',
    borderRadius: '25px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    flexDirection: 'column',
    maxWidth: '500px',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '300px',
    },
  },
  swooshContainer: {
    backgroundColor: 'white',

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    padding: '40px',
    width: '90%',
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0px',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  hostcommLogo: {
    width: '100%',
  },
  twilioLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '20px',
  },
  content: {
    background: 'white',
    width: '100%',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  title: {
    color: 'white',
    margin: '1em 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: '1.1rem',
    },
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();

  return (
    <div className={classes.background}>
      <div className={classes.topBanner}></div>
      {user && location.pathname !== '/login' && <UserMenu />}
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.swooshContainer}>
            <div className={classes.logoContainer}>
              <img className={classes.hostcommLogo} src={HostcommImg}></img>
            </div>
          </div>
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default IntroContainer;
