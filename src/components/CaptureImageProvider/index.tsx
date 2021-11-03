import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Predictions, Storage } from 'aws-amplify';
import * as markerjs2 from 'markerjs2';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageToStorage: () => void;
  setPhoto: (canvas: HTMLCanvasElement) => HTMLElement | null;
  createMarkerArea: (imageRef: React.RefObject<HTMLImageElement>) => markerjs2.MarkerArea;
  isMarkupPanelOpen: boolean;
  setMarkupPanelOpen: (isMarkupPanelOpen: boolean) => void;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);
  const [isCaptureImageOpen, setIsCaptureImageOpen] = useState(false);
  const [isMarkupPanelOpen, setMarkupPanelOpen] = useState(false);

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
    // Temporarily also pass to Rekognition here for text searching
    const photoFileName = `UserImage_${Date.now()}.png`;
    const textFileName = `UserImage_${Date.now()}.txt`;

    const photoURI = document.getElementById('photo')!.getAttribute('src')!;

    const file = dataURIToBlob(photoURI) as File;

    console.log(file);

    // Pass file to Predictions API
    Predictions.identify({
      text: {
        source: {
          file,
        },
        format: 'PLAIN',
      },
    })
      .then(async response => {
        console.log({ response });

        // Create text file of Predictions response
        const text = createTextFile(JSON.stringify(response.text));

        // Save image and text file on S3
        const photoRes = await Storage.put(photoFileName, file);
        console.log(photoRes);

        const textRes = await Storage.put(textFileName, text);
        console.log(textRes);
      })
      .catch(error => console.error(error));

    // return result

    // Download image from S3 to check
    // const downloadResult = await Storage.get(result.key, { download: true });
    // console.log(downloadResult);

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

  const createTextFile = (text: string) => {
    return new Blob([text], { type: 'text/plain' });
  };

  const createMarkerArea = (imageRef: React.RefObject<HTMLImageElement>) => {
    // create a marker.js MarkerArea
    const markerArea = new markerjs2.MarkerArea(imageRef.current!);

    // TODO change this to just FrameMarker for OCR "mode"
    markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

    // attach an event handler to assign annotated image back to our image element
    markerArea.addEventListener('render', event => {
      if (imageRef.current) {
        imageRef.current.src = event.dataUrl;
      }
    });

    markerArea.addEventListener('close', () => {
      setMarkupPanelOpen(false);
    });

    markerArea.addEventListener('show', () => {
      setMarkupPanelOpen(true);
    });

    return markerArea;
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
        createMarkerArea,
        isMarkupPanelOpen,
        setMarkupPanelOpen,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
