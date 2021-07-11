import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import { getDeviceInfo, isPermissionDenied } from '../../../utils';
import { useCallback, useState } from 'react';
import { RNNoiseNode } from '../../../rnnoise/rnnoisenode';
import Video, {
  LocalVideoTrack,
  LocalAudioTrack,
  CreateLocalTrackOptions,
  CreateLocalTracksOptions,
  LocalTrack,
} from 'twilio-video';

const useRNNNoise = window.location.search.includes('rnnoise');
// const AudioContext = window.AudioContext /* || window.webkitAudioContext */;
async function removeNoiseFromTrack(track: MediaStreamTrack, audio_context?: AudioContext) {
  audio_context = audio_context || new AudioContext({ sampleRate: 48000 });
  await RNNoiseNode.register(audio_context);
  const stream = new MediaStream([track]);

  const sourceNode = audio_context.createMediaStreamSource(stream);
  const rnnoiseNode = new RNNoiseNode(audio_context);
  const destinationNode = audio_context.createMediaStreamDestination();

  sourceNode.connect(rnnoiseNode);
  rnnoiseNode.connect(destinationNode);

  const outputStream = destinationNode.stream;
  return {
    audio_context,
    track: outputStream.getTracks()[0],
    rnnoise: rnnoiseNode,
  };
}

async function removeNoiseFromLocalAudioTrack(localAudioTrack: LocalAudioTrack) {
  if (useRNNNoise) {
    console.warn('!*** Using rnnoise *** !');
    const { track } = await removeNoiseFromTrack(localAudioTrack.mediaStreamTrack);
    return new LocalAudioTrack(track);
  } else {
    console.warn('!*** Not using rnnoise *** !');
    return localAudioTrack;
  }
}

function updateAudioOptions(options: CreateLocalTrackOptions) {
  options.channelCount = { ideal: 1 };
  options.noiseSuppression = { ideal: false };
  options.echoCancellation = { ideal: true };
  options.autoGainControl = { ideal: false };
  options.sampleRate = { ideal: 48000 };
}

async function video_createLocalTracks(options: CreateLocalTracksOptions): Promise<LocalTrack[]> {
  if (options.audio) {
    options.audio = typeof options.audio === 'object' ? options.audio : {};
    updateAudioOptions(options.audio);
  }

  const localTracks = await Video.createLocalTracks(options);
  const localTracks2 = localTracks.map(async track =>
    track.kind === 'audio' ? await removeNoiseFromLocalAudioTrack(track) : track
  );
  return Promise.all(localTracks2);
}

async function video_createLocalAudioTrack(options: CreateLocalTrackOptions) {
  updateAudioOptions(options);
  const localAudioTrack = await Video.createLocalAudioTrack(options);
  return removeNoiseFromLocalAudioTrack(localAudioTrack);
}

export default function useLocalTracks() {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const getLocalAudioTrack = useCallback((deviceId?: string) => {
    const options: CreateLocalTrackOptions = {};

    options.channelCount = { ideal: 1 };
    options.noiseSuppression = { ideal: false };
    options.echoCancellation = { ideal: true };
    options.autoGainControl = { ideal: false };
    options.sampleRate = { ideal: 48000 };

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    return video_createLocalAudioTrack(options);
  }, []);

  const getLocalVideoTrack = useCallback(async () => {
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const { videoInputDevices } = await getDeviceInfo();

    const hasSelectedVideoDevice = videoInputDevices.some(
      device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
    };

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, []);

  const removeLocalAudioTrack = useCallback(() => {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(undefined);
    }
  }, [audioTrack]);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  const getAudioAndVideoTracks = useCallback(async () => {
    const { audioInputDevices, videoInputDevices, hasAudioInputDevices, hasVideoInputDevices } = await getDeviceInfo();

    if (!hasAudioInputDevices && !hasVideoInputDevices) return Promise.resolve();
    if (isAcquiringLocalTracks || audioTrack || videoTrack) return Promise.resolve();

    setIsAcquiringLocalTracks(true);

    const selectedAudioDeviceId = window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY);
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const hasSelectedAudioDevice = audioInputDevices.some(
      device => selectedAudioDeviceId && device.deviceId === selectedAudioDeviceId
    );
    const hasSelectedVideoDevice = videoInputDevices.some(
      device => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    // In Chrome, it is possible to deny permissions to only audio or only video.
    // If that has happened, then we don't want to attempt to acquire the device.
    const isCameraPermissionDenied = await isPermissionDenied('camera');
    const isMicrophonePermissionDenied = await isPermissionDenied('microphone');

    const shouldAcquireVideo = hasVideoInputDevices && !isCameraPermissionDenied;
    const shouldAcquireAudio = hasAudioInputDevices && !isMicrophonePermissionDenied;

    const localTrackConstraints = {
      video: shouldAcquireVideo && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
      },
      audio:
        shouldAcquireAudio &&
        (hasSelectedAudioDevice ? { deviceId: { exact: selectedAudioDeviceId! } } : hasAudioInputDevices),
    };

    return video_createLocalTracks(localTrackConstraints)
      .then(tracks => {
        const newVideoTrack = tracks.find(track => track.kind === 'video') as LocalVideoTrack;
        const newAudioTrack = tracks.find(track => track.kind === 'audio') as LocalAudioTrack;
        if (newVideoTrack) {
          setVideoTrack(newVideoTrack);
          // Save the deviceId so it can be picked up by the VideoInputList component. This only matters
          // in cases where the user's video is disabled.
          window.localStorage.setItem(
            SELECTED_VIDEO_INPUT_KEY,
            newVideoTrack.mediaStreamTrack.getSettings().deviceId ?? ''
          );
        }
        if (newAudioTrack) {
          setAudioTrack(newAudioTrack);
        }

        // These custom errors will be picked up by the MediaErrorSnackbar component.
        if (isCameraPermissionDenied && isMicrophonePermissionDenied) {
          const error = new Error();
          error.name = 'NotAllowedError';
          throw error;
        }

        if (isCameraPermissionDenied) {
          throw new Error('CameraPermissionsDenied');
        }

        if (isMicrophonePermissionDenied) {
          throw new Error('MicrophonePermissionsDenied');
        }
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [audioTrack, videoTrack, isAcquiringLocalTracks]);

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  };
}
