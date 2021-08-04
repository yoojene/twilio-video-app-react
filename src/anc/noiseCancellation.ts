import { RNNoiseNode } from './rnnoise/rnnoisenode';
import { makeKrisp } from './krisp/krispsdk';

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

const urlParams = new URLSearchParams(window.location.search);
const ancOption = urlParams.get('anc') || 'krisp';
let anc = ancOption.toLowerCase();

export async function removeNoiseFromMSTrack(msTrack: MediaStreamTrack): Promise<NoiseCancellationWithTrack> {
  if (anc === 'rnnoise') {
    console.warn('!*** Using rnnoise *** !');
    const noiseCancellationAndTrack = await rnnNoise_removeNoiseFromTrack(msTrack);
    return noiseCancellationAndTrack;
  } else if (anc === 'krisp') {
    console.warn('!*** Using krisp *** !');
    const noiseCancellationAndTrack = await krisp_removeNoiseFromTrack(msTrack);
    return noiseCancellationAndTrack;
  } else {
    console.warn('!*** Not using rnnoise *** !');
    return {
      track: msTrack,
      noiseCancellation: null,
    };
  }
}
async function krisp_removeNoiseFromTrack(track: MediaStreamTrack): Promise<NoiseCancellationWithTrack> {
  const KrispModule = makeKrisp({
    workletScriptNC: '/krisp/wasm/debug/krisp-nc-processor.js',
    workletScriptVAD: '/krisp/wasm/debug/krisp-vad-processor.js',
    model8: 'https://cdn.krisp.ai/scripts/ext/models/small_8k.thw',
    model16: 'https://cdn.krisp.ai/scripts/ext/models/small_16k.thw',
    model_vad: '/krisp/VAD_weight.thw',
  });

  await KrispModule.init(false);

  const stream = new MediaStream([track]);
  const cleanStream = KrispModule.getStream(stream);

  return {
    noiseCancellation: {
      isActive: () => KrispModule.isEnabled(),
      turnOn: () => KrispModule.toggle(true),
      turnOff: () => KrispModule.toggle(false),
      kind: () => 'krisp',
    },
    track: cleanStream.getTracks()[0],
  };
}

async function rnnNoise_removeNoiseFromTrack(track: MediaStreamTrack): Promise<NoiseCancellationWithTrack> {
  const audio_context = new AudioContext({ sampleRate: 48000 });
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
