import { Button, createStyles, makeStyles, Popover, Theme, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { LocalDataTrackPublication } from 'twilio-video';

import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { ReactComponent as LivePointerIcon } from '../../../icons/color-wand-outline.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    button: {
      textAlign: 'center',
      marginLeft: '8px',
    },
    paper: {
      padding: theme.spacing(1),
    },
  })
);
export default function ToggleLivePointerButton(): ReactElement {
  const classes = useStyles();

  const { setIsLivePointerOpen, isLivePointerOpen } = useCaptureImageContext();
  const { room } = useVideoContext();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }
  const doOpenLivePointer = () => {
    console.log('live pointing');

    setIsLivePointerOpen(!isLivePointerOpen);
    localDataTrackPublication.track.send(
      JSON.stringify({
        isLivePointerOpen: !isLivePointerOpen,
      })
    );
  };

  return (
    <>
      <Button
        className={classes.button}
        onClick={doOpenLivePointer}
        onMouseEnter={handlePopoverOpen}
        color={isLivePointerOpen ? 'secondary' : undefined}
        startIcon={
          <div className={classes.iconContainer}>
            <LivePointerIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'livepointer-mouse-over-popover'}
        open={open}
        classes={{
          paper: classes.paper,
        }}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography>Live Pointer</Typography>
      </Popover>
    </>
  );
}
