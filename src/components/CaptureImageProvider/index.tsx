import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Predictions, Storage } from 'aws-amplify';
import * as markerjs2 from 'markerjs2';

type CaptureImageContextType = {
  isCaptureImageDialogOpen: boolean;
  setIsCaptureImageDialogOpen: (isCaptureImageDialogOpen: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement, scale?: number) => HTMLCanvasElement | undefined;
  saveImageToStorage: () => void;
  setPhotoFromCanvas: (canvas: HTMLCanvasElement) => HTMLElement | null;
  createMarkerArea: (imageRef: React.MutableRefObject<HTMLImageElement>) => markerjs2.MarkerArea;
  isMarkupPanelOpen: boolean;
  setMarkupPanelOpen: (isMarkupPanelOpen: boolean) => void;
  annotatedPhoto: string;
  setAnnotatedPhoto: (annotatedPhoto: string) => void;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageDialogOpen, setIsCaptureImageDialogOpen] = useState(false);
  const [isCaptureImageOpen, setIsCaptureImageOpen] = useState(false);
  const [isMarkupPanelOpen, setMarkupPanelOpen] = useState(false);
  const [annotatedPhoto, setAnnotatedPhoto] = useState('');

  const getVideoElementFromDialog = useCallback(() => {
    const video = document.getElementById('capture-video');
    return video;
  }, []);

  const setVideoOnCanvas = useCallback((video, scale) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;
      canvas.height = 1200;
      if (scale) {
        ctx?.scale(scale, scale);
      }
      if (!scale) scale = 1;
      const x = (canvas.width / scale - video.offsetWidth) / 2;
      const y = (canvas.height / scale - video.offsetHeight) / 2;
      ctx?.drawImage(video as CanvasImageSource, x, y);

      return canvas;
    }
  }, []);

  const setPhotoFromCanvas = useCallback(canvas => {
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

  const createMarkerArea = (imageRef: React.MutableRefObject<HTMLImageElement>) => {
    console.log(imageRef);
    // create a marker.js MarkerArea
    const markerArea = new markerjs2.MarkerArea(imageRef.current!);

    // TODO change this to just FrameMarker for OCR "mode"
    markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

    // attach an event handler to assign annotated image back to our image element
    markerArea.addEventListener('render', event => {
      console.log(imageRef);
      console.log(imageRef.current);
      console.log(event);
      if (imageRef.current) {
        imageRef.current.src = event.dataUrl;
      }
    });

    markerArea.addEventListener('close', () => {
      console.log('close');
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
        setPhotoFromCanvas,
        createMarkerArea,
        isMarkupPanelOpen,
        setMarkupPanelOpen,
        annotatedPhoto,
        setAnnotatedPhoto,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
