import { Button, createStyles, makeStyles, Popover, Theme, Typography } from '@material-ui/core';

import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as GalleryIcon } from '../../../icons/images-outline.svg';
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

export default function ToggleGalleryButton() {
  const classes = useStyles();

  const { isGalleryOpen, setIsGalleryOpen } = useCaptureImageContext();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };
  return (
    <>
      <Button
        className={classes.button}
        onClick={toggleGallery}
        onMouseEnter={handlePopoverOpen}
        startIcon={
          <div className={classes.iconContainer}>
            <GalleryIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'gallery-mouse-over-popover'}
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
        <Typography>View Gallery</Typography>
      </Popover>
    </>
  );
}
