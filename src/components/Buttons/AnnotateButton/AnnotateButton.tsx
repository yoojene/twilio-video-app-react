import { makeStyles, Theme, createStyles, Button, Popover, Typography } from '@material-ui/core';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import { ReactComponent as PencilIcon } from '../../../icons/pencil-outline.svg';

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

export default function AnnotateButton() {
  const classes = useStyles();

  const { isMarkupPanelOpen, isCaptureMode, annotateImage, setIsAnnotationMode } = useCaptureImageContext();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const doAnnotateImage = async () => {
    setIsAnnotationMode(true);
    annotateImage();
  };

  return (
    <>
      <Button
        className={classes.button}
        onClick={doAnnotateImage}
        disabled={isMarkupPanelOpen || !isCaptureMode}
        color={isMarkupPanelOpen ? 'secondary' : undefined}
        onMouseEnter={handlePopoverOpen}
        startIcon={
          <div className={classes.iconContainer}>
            <PencilIcon />
          </div>
        }
      ></Button>
      <Popover
        id={'annotate-mouse-over-popover'}
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
        <Typography>Annotate</Typography>
      </Popover>
    </>
  );
}
