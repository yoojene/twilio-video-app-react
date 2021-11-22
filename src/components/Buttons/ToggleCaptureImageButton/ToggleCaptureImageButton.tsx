import Button from '@material-ui/core/Button';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useDevices from '../../../hooks/useDevices/useDevices';
// import CameraIcon from '../../../icons/CameraIcon';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

export default function ToggleCaptureImageButton(props: { disabled?: boolean; className?: string }) {
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
      startIcon={<CameraIcon />}
    >
      Capture Image
    </Button>
  );
}
