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

type CaptureImageContextType = {
  checkIsUser: () => boolean;
  captureImage: (isAnnotating?: boolean) => void;
  getVideoElementFromDialog: () => HTMLElement | null;
  isCaptureImageOpen: boolean;
  setIsCaptureImageOpen: (isCaptureImageOpen: boolean) => void;
  setVideoOnCanvas: (video: HTMLElement) => HTMLCanvasElement | undefined;
  saveImageToStorage: () => void;
  sendCanvasDimensionsOnDataTrack: (canvas: HTMLCanvasElement) => Promise<unknown>;
  sendImageOnDataTrack: (canvas: HTMLCanvasElement) => void;
  showPhoto: (canvas: HTMLCanvasElement) => void;
  annotateImage: () => void;
  createMarkerArea: (
    imageRef: React.MutableRefObject<HTMLImageElement> | null,
    isRemote: boolean
  ) => markerjs2.MarkerArea;
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
  isAnnotating: boolean;
  setIsAnnotating: (isAnnotating: boolean) => void;
  setRemoteImageFromCanvas: () => void;
  setImageFromCanvas: () => void;
  isRemoteCanvasOpen: boolean;
  setIsRemoteCanvasOpen: (isRemoteCanvasOpen: boolean) => void;
  isRemoteImageOpen: boolean;
  setIsRemoteImageOpen: (isRemoteImageOpen: boolean) => void;
  isLivePointerOpen: boolean;
  setIsLivePointerOpen: (isLivePointerOpen: boolean) => void;
  isRemoteLivePointerOpen: boolean;
  setIsRemoteLivePointerOpen: (isRemoteLivePointerOpen: boolean) => void;
  drawLivePointer: (canvas: HTMLCanvasElement, mouseX: number, mouseY: number, color: string) => void;
  getPosition: (element: any) => { x: number; y: number };
  sendMouseCoordsAndCanvasSize: (
    e: MouseEvent | Touch,
    canvas: HTMLCanvasElement,
    canvasPos: { x: number; y: number },
    color: string
  ) => {
    mouseCoords: {
      mouseX: number;
      mouseY: number;
    };
  };
  drawVideoToCanvas: (canvas: HTMLCanvasElement, video: HTMLVideoElement) => void;
  isCaptureMode: boolean;
  setIsCaptureMode: (isCaptureMode: boolean) => void;
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
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [isRemoteCanvasOpen, setIsRemoteCanvasOpen] = useState(true);
  const [isRemoteImageOpen, setIsRemoteImageOpen] = useState(false);
  const [isLivePointerOpen, setIsLivePointerOpen] = useState(false);
  const [isRemoteLivePointerOpen, setIsRemoteLivePointerOpen] = useState(false);
  const [isCaptureMode, setIsCaptureMode] = useState(false);

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

  const captureImage = async (isAnnotating = false) => {
    console.log('in cappture image');
    const video = getVideoElementFromDialog();
    if (video) {
      const canvas = setVideoOnCanvas(video);
      if (canvas) {
        if (!isAnnotating) {
          await sendCanvasDimensionsOnDataTrack(canvas);
          await sendImageOnDataTrack(canvas);
        }
        showPhoto(canvas);
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
      setIsAnnotating(false);
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

  const setImageFromCanvas = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(canvas);
    const photo = document.getElementById('photo');
    console.log(photo);
    const data = canvas.toDataURL('image/png');
    console.log(data);
    photo!.setAttribute('src', data);
    console.log('end of setImageFromCanvas');
  };
  const setRemoteImageFromCanvas = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(canvas);
    const photo = document.getElementById('remotephoto');
    console.log(photo);
    const data = canvas.toDataURL('image/png');
    console.log(data);
    photo!.setAttribute('src', data);
    console.log('end of setRemoteImageFromCanvas');
  };

  const sendCanvasDimensionsOnDataTrack = async (canvas: HTMLCanvasElement) => {
    const canvasSizes = `canvas width:${canvas.width}, height:${canvas.height}`;

    return new Promise(resolve => {
      resolve(localDataTrackPublication.track.send(canvasSizes));
    });
  };

  const sendImageOnDataTrack = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    const CHUNK_LEN = 64000;
    const img = ctx?.getImageData(0, 0, canvas.width, canvas.height);
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
  };

  const showPhoto = (canvas: HTMLCanvasElement) => {
    const photo = document.getElementById('photo');
    const data = canvas.toDataURL('image/png');
    photo!.setAttribute('src', data);
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
    console.log(imageRef!.current);

    // create a marker.js MarkerArea
    const markerArea = new markerjs2.MarkerArea(imageRef!.current!);

    // TODO change this to just FrameMarker for OCR "mode"
    markerArea.availableMarkerTypes = [...markerArea.BASIC_MARKER_TYPES];

    markerArea.settings.displayMode = 'popup';
    markerArea.renderTarget = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(markerArea.renderTarget);

    // attach an event handler to assign annotated image back to our image element
    markerArea.addEventListener('render', async event => {
      console.log(imageRef);
      console.log(imageRef!.current);
      console.log(event);
      if (imageRef!.current) {
        imageRef!.current.src = event.dataUrl;

        console.log('about to send annotated canvas on datatrack');
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        await sendCanvasDimensionsOnDataTrack(canvas!);
        await sendImageOnDataTrack(canvas!);
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
    }
  };

  // *** Draw Live Pointer *** /

  const drawLivePointer = (canvas: HTMLCanvasElement, mouseX: number, mouseY: number, color: string) => {
    // console.log('using draw live pointer fn');
    const ctx = canvas.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    ctx!.beginPath();
    ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
    // ctx!.fillStyle = '#FF6A6A'; // TODO toggle based on local/remote user
    ctx!.fillStyle = color; // TODO toggle based on local/remote user
    ctx!.fill();
    requestAnimationFrame(() => drawLivePointer(canvas, mouseX, mouseY, color));
  };

  const drawRemoteLivePointer = (canvas: HTMLCanvasElement, mouseX: number, mouseY: number) => {
    console.log('using draw live pointer fn');
    const ctx = canvas.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    ctx!.beginPath();
    ctx!.arc(mouseX, mouseY, 10, 0, 2 * Math.PI, true);
    ctx!.fillStyle = '#0000FF'; // TODO toggle based on local/remote user
    ctx!.fill();
    requestAnimationFrame(() => drawRemoteLivePointer(canvas, mouseX, mouseY));
  };

  // Canvas position calculation fn
  const getPosition = (el: any) => {
    let xPos = 0;
    let yPos = 0;

    while (el) {
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
      el = el.offsetParent;
    }

    return {
      x: xPos,
      y: yPos,
    };
  };

  // Send mouse position and coords over DataTrack
  const sendMouseCoordsAndCanvasSize = (
    e: MouseEvent | Touch,
    canvas: HTMLCanvasElement,
    canvasPos: { x: number; y: number },
    color: string
  ): {
    mouseCoords: {
      mouseX: number;
      mouseY: number;
    };
  } => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    let mouseX = 0;
    let mouseY = 0;
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;
    const mouseCoords = { mouseX, mouseY };
    const canvasSize = { canvasWidth, canvasHeight };
    const trackColor = { color };
    localDataTrackPublication.track.send(
      JSON.stringify({
        mouseCoords,
        canvasSize,
        trackColor,
      })
    );

    return {
      mouseCoords,
    };
  };

  const drawVideoToCanvas = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas!.getContext('2d');

    // draw the current frame of localVideo onto the canvas,
    // starting at 0, 0 (top-left corner) and covering its full
    // width and heigth
    ctx!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    //repeat this every time a new frame becomes available using
    //the browser's build-in requestAnimationFrame method
    requestAnimationFrame(() => drawVideoToCanvas(canvas, video));
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
        sendCanvasDimensionsOnDataTrack,
        sendImageOnDataTrack,
        showPhoto,
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
        isAnnotating,
        setIsAnnotating,
        setRemoteImageFromCanvas,
        setImageFromCanvas,
        isRemoteCanvasOpen,
        setIsRemoteCanvasOpen,
        isRemoteImageOpen,
        setIsRemoteImageOpen,
        isLivePointerOpen,
        setIsLivePointerOpen,
        isRemoteLivePointerOpen,
        setIsRemoteLivePointerOpen,
        drawLivePointer,
        getPosition,
        sendMouseCoordsAndCanvasSize,
        drawVideoToCanvas,
        isCaptureMode,
        setIsCaptureMode,
      }}
    >
      {children}
    </CaptureImageContext.Provider>
  );
};
