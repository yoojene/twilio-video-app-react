import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Predictions, Storage } from 'aws-amplify';
import * as markerjs2 from 'markerjs2';
import { S3ProviderListOutputItem, S3ProviderListOutput } from '@aws-amplify/storage';
import { Room, LocalDataTrack, LocalDataTrackPublication } from 'twilio-video';
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
  sendImageOnDataTrackAndShowPhoto: (canvas: HTMLCanvasElement) => void;
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
};

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

export const CaptureImageContext = createContext<CaptureImageContextType>(null!);

export const CaptureImageProvider: React.FC = ({ children }) => {
  const [isCaptureImageOpen, setIsCaptureImageOpen] = useState(false);
  const [isMarkupPanelOpen, setMarkupPanelOpen] = useState(false);
  const [annotatedPhoto, setAnnotatedPhoto] = useState('');
  const [imgRef, setImageRef] = useState<React.MutableRefObject<HTMLImageElement> | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>(defaultBase64Image);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [scale, setScale] = useState(1);
  const { room } = useVideoContext();

  let localDataTrackPublication: LocalDataTrackPublication;

  if (room) {
    [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];
  }

  // For now, assumption is that Remote User will be on mobile device and Agent will be on desktop
  const checkIsUser = () => {
    let isUser: boolean;
    window.navigator.appVersion.includes('Mobile') ? (isUser = true) : (isUser = false);
    return isUser;
  };

  const captureImage = async () => {
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        sendImageOnDataTrackAndShowPhoto(canvas);
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
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

  const sendImageOnDataTrackAndShowPhoto = async (canvas: HTMLCanvasElement) => {
    const photo = document.getElementById('photo');
    const data = canvas.toDataURL('image/png');
    const ctx = canvas.getContext('2d');

    const CHUNK_LEN = 64000;
    const img = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    console.log(canvas.width);
    console.log(canvas.height);
    console.log(img?.data);
    console.log(img?.data.byteLength);
    const len = img?.data.byteLength;
    const n = (len! / CHUNK_LEN) | 0;

    len?.toString();

    console.log('Sending a total of ' + len + ' byte(s)');

    localDataTrackPublication.track.send(len!.toString());
    for (let i = 0; i < n; i++) {
      const start = i * CHUNK_LEN,
        end = (i + 1) * CHUNK_LEN;
      console.log(start + ' - ' + (end - 1));

      localDataTrackPublication.track.send(img?.data.subarray(start, end) as ArrayBuffer);
      console.log('i is - ' + i);
    }

    // send the reminder, if any

    if (len! % CHUNK_LEN) {
      console.log('last ' + (len! % CHUNK_LEN) + ' byte(s)');
      localDataTrackPublication.track.send(img?.data.subarray(n * CHUNK_LEN) as ArrayBuffer);
    }

    photo!.setAttribute('src', data);
    console.log('saving image to DataStore');

    const file = dataURIToBlob(data) as File;

    console.log(file);
    console.log(await file.arrayBuffer());

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
    markerArea.renderTarget = document.getElementById('canvas') as HTMLCanvasElement;

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
        sendImageOnDataTrackAndShowPhoto,
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
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
