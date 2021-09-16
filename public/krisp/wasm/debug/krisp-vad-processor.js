/** ***********************************************************************
 *
 * KRISP TECHNOLOGIES, INC
 * __________________
 *
 * [2018] - [2020] Krisp Technologies, Inc
 * All Rights Reserved.
 *
 * NOTICE: By accessing this programming code, you acknowledge that you have read, understood, and agreed to the User Agreement available at
 *  https://krisp.ai/terms-of-use.

 * Please note that ALL information contained herein is and remains the property of Krisp Technologies, Inc., and its affiliates or assigns, if any. The intellectual property
 * contained herein is proprietary to Krisp Technologies, Inc. and may be covered by pending and granted U.S. and Foreign Patents, and is further protected by
 * copyright, trademark and/or other forms of intellectual property protection.

 * Dissemination of this information or reproduction of this material IS STRICTLY FORBIDDEN.

*************************************************************************/

import Module from './dsp-vad.wasmmodule.js';
import { RENDER_QUANTUM_FRAMES, MAX_CHANNEL_COUNT, HeapAudioBuffer } from './wasm-audio-helper.js';

/**
 * A simple demonstration of WASM-powered AudioWorkletProcessor.
 *
 * @class WASMWorkletProcessor
 * @extends AudioWorkletProcessor
 */
class WASMWorkletProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'enabled',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: 'a-rate',
      },
    ];
  }

  /**
   * @constructor
   */
  constructor() {
    super();

    // Allocate the buffer for the heap access. Start with stereo, but it can
    // be expanded up to 32 channels.
    this._heapInputBuffer = new HeapAudioBuffer(
      Module,
      RENDER_QUANTUM_FRAMES,
      2,
      MAX_CHANNEL_COUNT,
    );
    this._heapOutputBuffer = new HeapAudioBuffer(
      Module,
      RENDER_QUANTUM_FRAMES,
      2,
      MAX_CHANNEL_COUNT,
    );
    
    this._kernel = new Module.KRISP_VAD();

    this.port.onmessage = ({ data }) => {
      if (data.type === 'init') {
        this.initModel(data.data, sampleRate);
      }
      if (data.type === 'init-vad') {
        this.initModelVAD(data.data, sampleRate);
      }
      if (data.type === 'change') {
        this.changeModel(data.data, sampleRate);
      }
      if (data.type === 'change-vad') {
        this.changeModelVAD(data.data, sampleRate);
      }
    };
  }
  
  initModelVAD(data, rate) {
    console.log("initModelVAD");
    const weights = new Uint8Array(data);
    const weightsPtr = Module._malloc(weights.byteLength);

    const weightsArray = Module.HEAPU8.subarray(weightsPtr, weightsPtr + weights.byteLength);
    weightsArray.set(weights);

    this._kernel.init_weights_vad(weightsPtr, weights.byteLength);
    this._kernel.open_session_vad(rate);

    this._modelInitVAD = true;
  }

  initModel(data, rate) {
    const weights = new Uint8Array(data);
    const weightsPtr = Module._malloc(weights.byteLength);

    const weightsArray = Module.HEAPU8.subarray(weightsPtr, weightsPtr + weights.byteLength);
    weightsArray.set(weights);

    this._kernel.init_weights(weightsPtr, weights.byteLength);
    this._kernel.open_session(rate);

    this._modelInit = true;
  }

  changeModel(data, rate) {
    this._modelInit = false;
    this._kernel.close_session();
    this.initModel(data, rate);
  }
  
  changeModelVAD(data, rate) {
    this._modelInitVAD = false;
    this._kernel.close_session_vad();
    this.initModelVAD(data, rate);
  }

  processDisabled(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    for (let channel = 0; channel < output.length; ++channel) {
      if (input[channel]) output[channel].set(input[channel]);
    }
    return true;
  }

  /**
   * System-invoked process callback function.
   * @param  {Array} inputs Incoming audio stream.
   * @param  {Array} outputs Outgoing audio stream.
   * @param  {Object} parameters AudioParam data.
   * @return {Boolean} Active source flag.
   */
  process(inputs, outputs, parameters) {
    if (parameters.enabled == 0 || !this._modelInitVAD) {
      return this.processDisabled(inputs, outputs);
    }

    // Use the 1st input and output only to make the example simpler. |input|
    // and |output| here have the similar structure with the AudioBuffer
    // interface. (i.e. An array of Float32Array)
    const input = inputs[0];
    const output = outputs[0];
    //const output_vad = outputs[1];

    // For this given render quantum, the channel count of the node is fixed
    // and identical for the input and the output.
    const channelCount = input.length;

    // Prepare HeapAudioBuffer for the channel count change in the current
    // render quantum.
    this._heapInputBuffer.adaptChannel(channelCount);
    this._heapOutputBuffer.adaptChannel(channelCount);

    // Copy-in, process and copy-out.
    for (let channel = 0; channel < channelCount; ++channel) {
      this._heapInputBuffer.getChannelData(channel).set(input[channel]);
    }
    this._kernel.process_vad(
      this._heapInputBuffer.getHeapAddress(),
      this._heapOutputBuffer.getHeapAddress(),
      channelCount,
    );
    for (let channel = 0; channel < channelCount; ++channel) {
        //console.log("VAD Score for channel: ", channel);
        /*
        for (let sample = 0; sample < RENDER_QUANTUM_FRAMES; sample++)
            console.log(" ", this._heapOutputBuffer.getChannelData(channel)[sample]);
        */
      output[channel].set(this._heapOutputBuffer.getChannelData(channel));
      //output[channel].set(this._heapInputBuffer.getChannelData(channel));
      //output[channel].set(input[channel]);
    }

    return true;
  }
}

registerProcessor('krisp-vad-processor', WASMWorkletProcessor);
