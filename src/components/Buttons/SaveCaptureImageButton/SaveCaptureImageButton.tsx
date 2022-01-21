import { Button, createStyles, makeStyles, Popover, Theme, Typography } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as SaveIcon } from '../../../icons/save-outline.svg';

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
export default function SaveCaptureImageButton() {
  const classes = useStyles();

  const { saveImageToStorage } = useCaptureImageContext();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const saveImage = async () => {
    saveImageToStorage();
  };

  return (
    <>
      <Button
        className={classes.button}
        onClick={saveImage}
        onMouseEnter={handlePopoverOpen}
        startIcon={
          <div className={classes.iconContainer}>
            <SaveIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'saveimage-mouse-over-popover'}
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
        <Typography>Save</Typography>
      </Popover>
    </>
  );
}
