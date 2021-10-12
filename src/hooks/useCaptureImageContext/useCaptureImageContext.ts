import { useContext } from 'react';
import { CaptureImageContext } from '../../components/CaptureImageProvider';

export default function useCaptureImageContext() {
  const context = useContext(CaptureImageContext);
  if (!context) {
    throw new Error('useCaptureImageContext must be used within a CaptureImageProvider');
  }
  return context;
}
