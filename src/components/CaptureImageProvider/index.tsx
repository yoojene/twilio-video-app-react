import React, { createContext, useCallback, useState } from 'react';
import { Storage } from 'aws-amplify';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageToStorage: () => void;
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

  const saveImageToStorage = useCallback(async () => {
    const photoFileName = `UserImage_${Date.now()}.png`;
    console.log(photoFileName);

    const photoURI = document.getElementById('photo')!.getAttribute('src')!;

    const file = dataURIToBlob(photoURI);

    console.log(file);

    const result = await Storage.put(photoFileName, file);
    console.log(result);

    // const downloadLink = document.createElement('a');
    // downloadLink.setAttribute('download', photo);
    // downloadLink.href = document.getElementById('photo')!.getAttribute('src')!;
    // console.log(downloadLink.href)
    // console.log(document.getElementById('photo'))
    // downloadLink.click();
  }, []);

  const dataURIToBlob = (dataURI: string) => {
    var arr = dataURI.split(','),
      mime = arr[0]!.match(/:(.*?);/)![1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <CaptureImageContext.Provider
      value={{
        isCaptureImageDialogOpen,
        setIsCaptureImageDialogOpen,
        isCaptureImageOpen,
        setIsCaptureImageOpen,
        getVideoElementFromDialog,
        setVideoOnCanvas,
        saveImageToStorage,
        setPhoto,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
