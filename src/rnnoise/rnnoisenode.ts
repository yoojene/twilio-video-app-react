async function fetchAndCompileWebAssemblyModule(moduleUrl: string) {
  const response = await fetch(moduleUrl);
  const buffer = await response.arrayBuffer();
  const mod = await WebAssembly.compile(buffer);
  return mod;
}

export class RNNoiseNode extends AudioWorkletNode {
  static webModule: WebAssembly.Module | null = null;
  private _onUpdate?: () => void;
  private _vadProb: number = 0;
  private _isActive: boolean = true;
  static async register(context: AudioContext) {
    RNNoiseNode.webModule = await fetchAndCompileWebAssemblyModule('/rnnoise-processor.wasm');
    await context.audioWorklet.addModule('/processor.js');
  }

  constructor(context: BaseAudioContext) {
    super(context, 'rnnoise', {
      channelCountMode: 'explicit',
      channelCount: 1,
      channelInterpretation: 'speakers',
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      processorOptions: {
        module: RNNoiseNode.webModule,
      },
    });
    console.log('RNNoiseNode constructor');
    this.port.onmessage = ({ data }) => {
      if (data.vadProb) {
        this._vadProb = data.vadProb;
        this._isActive = data.isActive;
        if (this._onUpdate) {
          this._onUpdate();
        }
      }
    };
  }

  onUpdate(onupdate: () => void) {
    this._onUpdate = onupdate;
  }

  getVadProb() {
    return this._vadProb;
  }

  getIsActive() {
    return this._isActive;
  }

  update(keepalive: boolean) {
    this.port.postMessage(keepalive);
  }
}
