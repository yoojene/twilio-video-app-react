import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useDevices from '../../../hooks/useDevices/useDevices';
// import CameraIcon from '../../../icons/CameraIcon';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

const useStyles = makeStyles({
  iconContainer: {
    position: 'relative',
    display: 'flex',
  },
});

export default function ToggleCaptureImageButton(props: { disabled?: boolean; className?: string }) {
  const classes = useStyles();
  const { hasVideoInputDevices } = useDevices();
  const { isCaptureImageOpen, setIsCaptureImageOpen } = useCaptureImageContext();

  const openCaptureImage = () => {
    console.log('capture image clicked!!!');
    setIsCaptureImageOpen(!isCaptureImageOpen);
  };

  return (
    <Button
      className={props.className}
      onClick={openCaptureImage}
      disabled={!hasVideoInputDevices || props.disabled}
      startIcon={
        <div className={classes.iconContainer}>
          <CameraIcon />
        </div>
      }
    >
      Capture Image
    </Button>
  );
}
