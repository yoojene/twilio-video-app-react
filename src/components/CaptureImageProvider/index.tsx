import React, { createContext, useCallback, useState } from 'react';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageAndOpen: () => void;
  setPhoto: (canvas: HTMLCanvasElement) => HTMLElement | null;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);
  const [isCaptureImageOpen, setIsCaptureImageOpen] = useState(false);

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
      canvas.width = 640;
      canvas.height = 1200;
      ctx?.drawImage(video as CanvasImageSource, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
  }, []);

  const setPhoto = useCallback(canvas => {
    const photo = document.getElementById('photo');
    const data = canvas.toDataURL('image/png');
    photo!.setAttribute('src', data);

    return photo;
  }, []);

  const saveImageAndOpen = useCallback(() => {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'UserImage.png');
    downloadLink.href = document.getElementById('photo')!.getAttribute('src')!;
    downloadLink.click();
  }, []);

  return (
    <CaptureImageContext.Provider
      value={{
        isCaptureImageDialogOpen,
        setIsCaptureImageDialogOpen,
        isCaptureImageOpen,
        setIsCaptureImageOpen,
        getVideoElementFromDialog,
        setVideoOnCanvas,
        saveImageAndOpen,
        setPhoto,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
