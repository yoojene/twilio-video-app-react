import React, { createContext, useCallback, useState } from 'react';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);

  const getVideoElementFromDialog = useCallback(() => {
    const video = document.getElementById('capture-video');
    console.log(video);

    return video;
  }, []);

  const setVideoOnCanvas = useCallback(video => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // canvas.style = 'display:none'

    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 600;
      ctx?.drawImage(video as CanvasImageSource, 0, 0, canvas.width, canvas.height);

      return canvas;
      // const data = canvas.toDataURL('image/png');
      // const photo = document.getElementById('photo');
      // photo?.setAttribute('src', data);
    }
  }, []);

  return (
    <CaptureImageContext.Provider
      value={{ isCaptureImageDialogOpen, setIsCaptureImageDialogOpen, getVideoElementFromDialog, setVideoOnCanvas }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
