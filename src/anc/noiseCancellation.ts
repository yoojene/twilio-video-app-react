import { RNNoiseNode } from '../rnnoise/rnnoisenode';

export interface NoiseCancellation {
  isActive: () => boolean; // is noise cancellation currently active?
  turnOn: () => void;
  turnOff: () => void;
  kind: () => string;
}

export interface NoiseCancellationWithTrack {
  track: MediaStreamTrack;
  noiseCancellation: NoiseCancellation | null;
}

const useRNNNoise = window.location.search.includes('rnnoise');
export async function removeNoiseFromMSTrack(msTrack: MediaStreamTrack): Promise<NoiseCancellationWithTrack> {
  if (useRNNNoise) {
    console.warn('!*** Using rnnoise *** !');
    const noiseCancellationAndTrack = await rnnNoise_removeNoiseFromTrack(msTrack);
    return noiseCancellationAndTrack;
  } else {
    console.warn('!*** Not using rnnoise *** !');
    return {
      track: msTrack,
      noiseCancellation: null,
    };
  }
}

async function rnnNoise_removeNoiseFromTrack(
  track: MediaStreamTrack,
  audio_context?: AudioContext
): Promise<NoiseCancellationWithTrack> {
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
    noiseCancellation: {
      isActive: () => rnnoiseNode && rnnoiseNode.getIsActive(),
      turnOn: () => rnnoiseNode && rnnoiseNode.update(true),
      turnOff: () => rnnoiseNode && rnnoiseNode.update(false),
      kind: () => 'rnNoise',
    },
    track: outputStream.getTracks()[0],
  };
}
