import Button from '@material-ui/core/Button';
import React from 'react';
import useCaptureImageContext from '../../../hooks/useCaptureImageContext/useCaptureImageContext';
import useDevices from '../../../hooks/useDevices/useDevices';
// import CameraIcon from '../../../icons/CameraIcon';
import { ReactComponent as CameraIcon } from '../../../icons/camera-outline.svg';

export default function CaptureImageButton(props: { disabled?: boolean; className?: string }) {
  const { hasVideoInputDevices } = useDevices();
  // const [captureOpen, setCaptureOpen] = useState(false)
  const { isCaptureImageDialogOpen, setIsCaptureImageDialogOpen } = useCaptureImageContext();

  const openCaptureImageDialog = () => {
    console.log('capture image clicked!!!');
    setIsCaptureImageDialogOpen(!isCaptureImageDialogOpen);
  };

  return (
    <Button
      className={props.className}
      onClick={openCaptureImageDialog}
      disabled={!hasVideoInputDevices || props.disabled}
      startIcon={<CameraIcon />}
    >
      Capture Image
    </Button>
  );
}
