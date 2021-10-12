import React, { createContext, useState } from 'react';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);

  return (
    <CaptureImageContext.Provider value={{ isCaptureImageDialogOpen, setIsCaptureImageDialogOpen }}>
      {children}
    </CaptureImageContext.Provider>
  );
};
