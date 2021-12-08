import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Predictions, Storage } from 'aws-amplify';
import * as markerjs2 from 'markerjs2';
import { S3ProviderListOutputItem, S3ProviderListOutput } from '@aws-amplify/storage';
import { Room } from 'twilio-video';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { defaultBase64Image } from '../RemoteImagePreview/RemoteImagePreviewData';
import { DataStore } from '@aws-amplify/datastore';
import { Image } from '../../models';
import axios from 'axios';
import { SyncClient } from 'twilio-sync';
type CaptureImageContextType = {
  checkIsUser: () => boolean;
  captureImage: () => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageToStorage: () => void;
  setPhotoFromCanvas: (canvas: HTMLCanvasElement) => void;
  annotateImage: () => void;
  createMarkerArea: (imageRef: React.MutableRefObject<HTMLImageElement> | null) => markerjs2.MarkerArea;
  isMarkupPanelOpen: boolean;
  setMarkupPanelOpen: (isMarkupPanelOpen: boolean) => void;
  annotatedPhoto: string;
  setAnnotatedPhoto: (annotatedPhoto: string) => void;
  imgRef: React.MutableRefObject<HTMLImageElement> | null;
  setImageRef: (imgRef: React.MutableRefObject<HTMLImageElement> | null) => void;
  scale: number;
  setScale: (scale: number) => void;
  photoBase64: string;
  setPhotoBase64: (photoBase64: string) => void;
  isGalleryOpen: boolean;
  setIsGalleryOpen: (isGalleryOpen: boolean) => void;
  getImagesFromDataStore: () => void;
  retrieveSyncToken: () => Promise<string>;
  createSyncClient: (token: string) => SyncClient | null;
  client: SyncClient | null;
};

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageOpen, setIsCaptureImageOpen] = useState(false);
  const [isMarkupPanelOpen, setMarkupPanelOpen] = useState(false);
  const [annotatedPhoto, setAnnotatedPhoto] = useState('');
  const [imgRef, setImageRef] = useState<React.MutableRefObject<HTMLImageElement> | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>(defaultBase64Image);
  const [client, setSyncClient] = useState<SyncClient | null>(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [scale, setScale] = useState(1);
  const { room } = useVideoContext();

  // For now, assumption is that Remote User will be on mobile device and Agent will be on
  const checkIsUser = () => {
    let isUser: boolean;
    window.navigator.appVersion.includes('Mobile') ? (isUser = true) : (isUser = false);
    return isUser;
  };

  const captureImage = async () => {
    const accessToken = await retrieveSyncToken();
    createSyncClient(accessToken);
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        setPhotoFromCanvas(canvas);
      }
    }
  };

  const annotateImage = () => {
    console.log('annotate image');
    console.log(imgRef);
    const markerArea = createMarkerArea(imgRef);
    console.log(markerArea);
    console.log(isMarkupPanelOpen);

    if (!isMarkupPanelOpen) {
      markerArea.show();
    } else {
      markerArea.close();
    }
  };

  const getVideoElementFromDialog = useCallback(() => {
    const video = document.getElementById('capture-video');
    return video;
  }, []);

  const setVideoOnCanvas = useCallback(
    video => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        // Canvas setup for device in landscape mode
        // TODO change this based on phone orientation
        canvas.width = 1000;
        canvas.height = 600;
        if (scale) {
          ctx?.scale(scale, scale);
        }

        const x = (canvas.width / scale - video.offsetWidth) / 2;
        const y = (canvas.height / scale - video.offsetHeight) / 2;

        if (scale === 1) {
          ctx?.drawImage(video as CanvasImageSource, 0, 0);
        } else {
          ctx?.drawImage(video as CanvasImageSource, x, y);
        }

        return canvas;
      }
    },
    [scale]
  );

  const setPhotoFromCanvas = async (canvas: HTMLCanvasElement) => {
    const photo = document.getElementById('photo');
    const data = canvas.toDataURL('image/png');

    photo!.setAttribute('src', data);
    console.log('saving image to DataStore');
    if (!client) {
      return;
    }

    const file = dataURIToBlob(data) as File;

    console.log(file);

    client?.document('dude').then(doc => {
      doc.set({ Blob: file }); // too large!
    });
    // await DataStore.save(new Image({ name: 'test', base64Data: file }));

    // return photo;
  };

  const saveImageToStorage = async () => {
    // Temporarily also pass to Rekognition here for text searching
    const photoFileName = `UserImage_${Date.now()}.png`;
    const textFileName = `UserImage_${Date.now()}.txt`;

    // Create path for files in S3
    const path = `${room?.name}/${room?.sid}`;
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
        const photoRes = await Storage.put(`${path}/${photoFileName}`, file, {});
        console.log(photoRes);

        const textRes = await Storage.put(`${path}/${textFileName}`, text);
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
  };

  const dataURIToBlob = (dataURI: string) => {
    const arr = dataURI.split(','),
      mime = arr[0]!.match(/:(.*?);/)![1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const createTextFile = (text: string) => {
    return new Blob([text], { type: 'text/plain' });
  };

  const createMarkerArea = (imageRef: React.MutableRefObject<HTMLImageElement> | null) => {
    console.log(imageRef);
    // create a marker.js MarkerArea
    const markerArea = new markerjs2.MarkerArea(imageRef!.current!);

    // TODO change this to just FrameMarker for OCR "mode"
    markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

    markerArea.settings.displayMode = 'popup';

    // attach an event handler to assign annotated image back to our image element
    markerArea.addEventListener('render', async event => {
      console.log(imageRef);
      console.log(imageRef!.current);
      console.log(event);
      // (document.getElementsByClassName('__markerjs2_')[0] as HTMLElement).style.top = '296px';
      if (imageRef!.current) {
        imageRef!.current.src = event.dataUrl;
        console.log('saving annotated image to DataStore');
        await DataStore.save(new Image({ name: 'test', base64Data: event.dataUrl }));
        setPhotoBase64(event.dataUrl);
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

  const getImagesFromDataStore = async () => {
    console.log('getting Images from datastore');
    const images = await DataStore.query(Image);
    console.log(images);
    if (images.length > 0) {
      console.log('returning new image');
      console.log(photoBase64);
      console.log(images[images.length - 1].base64Data);
      setPhotoBase64(images[images.length - 1].base64Data);
      // return images[images.length - 1].base64Data;
    }
  };

  const retrieveSyncToken = async () => {
    console.log('trying to get token from server');
    const result = await axios.get('/synctoken/' + 'dude'); // TODO use a real identiy from participants.  Not sure if needed
    const accessToken = result.data.token;
    console.log(accessToken);
    return accessToken;
  };

  const createSyncClient = (token: string) => {
    setSyncClient(new SyncClient(token, { logLevel: 'info' }));
    console.log(client);
    return client;
  };

  return (
    <CaptureImageContext.Provider
      value={{
        checkIsUser,
        captureImage,
        isCaptureImageOpen,
        setIsCaptureImageOpen,
        getVideoElementFromDialog,
        setVideoOnCanvas,
        saveImageToStorage,
        setPhotoFromCanvas,
        annotateImage,
        createMarkerArea,
        isMarkupPanelOpen,
        setMarkupPanelOpen,
        annotatedPhoto,
        setAnnotatedPhoto,
        imgRef,
        setImageRef,
        scale,
        setScale,
        photoBase64,
        setPhotoBase64,
        isGalleryOpen,
        setIsGalleryOpen,
        getImagesFromDataStore,
        retrieveSyncToken,
        createSyncClient,
        client,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
