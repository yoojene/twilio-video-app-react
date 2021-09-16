const errors = {
  not_ready: 'Not initialized, first run Krisp.init()',
  no_stream: 'No stream, run Krisp.getStream(stream)',
  no_support: 'Platform not supported',
  already_ready: 'Krisp already initialized',
  invalid_stream: 'Invalid MediaStream',
};

const errorLog = code => {
  throw new Error(errors[code] || 'Unspecified error');
};

const loadModuleData = async module => {
  return new Promise((resolve, reject) => {
    const api = new XMLHttpRequest();
    api.onload = res => {
      res ? resolve(res.target.response) : reject();
    };
    api.responseType = 'arraybuffer';
    api.open('GET', module, true);
    api.send();
  });
};

const addWorkletAndModel = async (audioCtx, { workletNodeName, workletScript, model8, model16, model_vad }) => {
    await audioCtx.audioWorklet.addModule(workletScript);
    const filter = new AudioWorkletNode(audioCtx, workletNodeName);
    if (workletNodeName === 'krisp-nc-processor') {
        const model = audioCtx.sampleRate <= 8000 ? model8 : model16;
        const moduleData = await loadModuleData(model);
        filter.port.postMessage({ type: 'init', data: moduleData });
    } else if (workletNodeName === 'krisp-vad-processor') {
        const moduleDataVAD = await loadModuleData(model_vad);
        filter.port.postMessage({ type: 'init-vad', data: moduleDataVAD });  
    } else {
        console.log("Unexpected workletNodeName:", workletNodeName);
    }
    return filter;
};

const checkCompatibility = () => {
  var AudioContext = window.AudioContext || window.webkitAudioContext || false;
  if (AudioContext) {
    const ctx = new AudioContext();
    if (!ctx.audioWorklet || !ctx.audioWorklet.addModule) return false;
  } else return false;
  return true;
};

export function Krisp({ workletScriptNC, workletScriptVAD, model8, model16, model_vad }) {
  let isSupported = checkCompatibility();
  let ready = false;
  let hasStream = false;
  let filter;
  let audioCtx;
  let _isVad = false;

  const isReady = () => {
    return ready ? 'active' : 'inactive';
  };

  const isRequired = name => {
    throw new Error(`${name || 'param'} is required`);
  };

  const isEnabled = () => {
    if (!ready) return errorLog('not_ready');
    return filter.parameters.get('enabled').value;
  };

  const init = async (isVad) => {
    console.log("krispsdk.mjs ---- init ------");
    if (!isSupported) return errorLog('no_support');
    if (ready) return errorLog('already_ready');

        //audioCtx = new AudioContext();
        audioCtx = new AudioContext({sampleRate: 32000});
        let workletNodeName = "krisp-nc-processor";
        let workletScript = workletScriptNC;
        if (isVad) {
            _isVad = isVad;
            workletNodeName = "krisp-vad-processor";
            workletScript = workletScriptVAD;
        }
        filter = await addWorkletAndModel(audioCtx, { workletNodeName, workletScript, model8, model16, model_vad });
        ready = true;
        return true;
  };

  const filterTrack = track => {
    const trackStream = new MediaStream([track]);
    const source = audioCtx.createMediaStreamSource(trackStream);
    const output = audioCtx.createMediaStreamDestination();
    source.connect(filter);
    filter.connect(output);
    return output.stream.getAudioTracks()[0];
  };

  const getStream = (stream = isRequired('stream')) => {
    if (!ready) return errorLog('not_ready');
    if (stream.constructor.name !== 'MediaStream') return errorLog('invalid_stream');

    if (audioCtx.state !== 'running') audioCtx.resume();
    const cleanStream = new MediaStream();

    stream.getAudioTracks().forEach(t => cleanStream.addTrack(filterTrack(t)));
    stream.getVideoTracks().forEach(t => cleanStream.addTrack(t));

    hasStream = true;
    //cleanStream.on('data', console.log)
    return cleanStream;
  };

  const toggle = (bool = isRequired('boolean')) => {
    if (!ready) return errorLog('not_ready');
    if (!hasStream) return errorLog('no_stream');
    filter.parameters.get('enabled').value = bool ? 1 : 0;
    return bool ? 1 : 0;
  };

  return {
    isSupported,
    isReady,
    isEnabled,
    init,
    getStream,
    toggle,
  };
}
