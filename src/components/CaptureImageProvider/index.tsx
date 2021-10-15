import React, { createContext, useCallback, useState } from 'react';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageAndOpen: () => void;
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
      canvas.width = 640;
      canvas.height = 1200;
      ctx?.drawImage(video as CanvasImageSource, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
  }, []);

  const saveImageAndOpen = useCallback(() => {
    // const image = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'UserImage.png');
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.toBlob((blob: Blob | null) => {
      const url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
  }, []);

  return (
    <CaptureImageContext.Provider
      value={{
        isCaptureImageDialogOpen,
        setIsCaptureImageDialogOpen,
        getVideoElementFromDialog,
        setVideoOnCanvas,
        saveImageAndOpen,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
