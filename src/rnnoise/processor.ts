let heapFloat32: Float32Array;
let requestNumber = 0;
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): boolean;
}

type RNNoiseState = number;

let instance: {
  newState: () => RNNoiseState;
  getInput: (state: RNNoiseState) => any;
  getVadProb: (state: RNNoiseState) => number;
  deleteState: (state: RNNoiseState) => void;
  pipe: (state: RNNoiseState, length: number) => number;
};

console.log('Processor loaded');
declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(name: string, cls: any): void;

class RNNNoiseProcessor extends AudioWorkletProcessor {
  state: any;
  constructor(options: AudioWorkletNodeOptions) {
    super({
      ...options,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    if (!instance) {
      // @ts-ignore
      instance = new WebAssembly.Instance(options.processorOptions.module).exports;
      // @ts-ignore
      heapFloat32 = new Float32Array(instance.memory.buffer);
    }
    console.log('processor creating state');
    this.state = instance.newState();
    this.port.onmessage = ({ data: keepalive }) => {
      if (keepalive) {
        if (this.state === null) {
          console.log('processor creating state again');
          this.state = instance.newState();
        }
        this.port.postMessage({ vadProb: instance.getVadProb(this.state) });
      } else if (this.state) {
        console.log('processor deleting state');
        instance.deleteState(this.state);
        this.state = null;
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): boolean {
    if (this.state) {
      heapFloat32.set(inputs[0][0], instance.getInput(this.state) / 4);
      const o = outputs[0][0];
      const ptr4 = instance.pipe(this.state, o.length) / 4;
      if (ptr4) {
        o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));
      }
    } else {
      // rnnoise is turned off.
      outputs[0][0].set(inputs[0][0]);
    }
    return true;
  }
}

registerProcessor('rnnoise', RNNNoiseProcessor);
