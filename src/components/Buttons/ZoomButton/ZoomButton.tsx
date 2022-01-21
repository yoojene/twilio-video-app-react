import { Button, createStyles, makeStyles, Popover, Theme, Typography } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as ZoomIcon } from '../../../icons/search-outline.svg';

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
export default function ZoomButton() {
  const classes = useStyles();

  const { setIsZoomMode, isZoomMode } = useCaptureImageContext();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const doToggleZoom = () => {
    setIsZoomMode(!isZoomMode);
  };

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        className={classes.button}
        onClick={doToggleZoom}
        color={isZoomMode ? 'secondary' : undefined}
        onMouseEnter={handlePopoverOpen}
        // onMouseLeave={handlePopoverClose}
        startIcon={
          <div className={classes.iconContainer}>
            <ZoomIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'zoom-mouse-over-popover'}
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
        <Typography>Zoom</Typography>
      </Popover>
    </>
  );
}
