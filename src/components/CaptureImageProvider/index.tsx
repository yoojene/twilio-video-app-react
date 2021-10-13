import React, { createContext, useCallback, useState } from 'react';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);

  const getVideoElementFromDialog = useCallback(() => {
    const video = document.getElementById('capture-video');
    console.log(video);

    return video;
  }, []);

  return (
    <CaptureImageContext.Provider
      value={{ isCaptureImageDialogOpen, setIsCaptureImageDialogOpen, getVideoElementFromDialog }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
