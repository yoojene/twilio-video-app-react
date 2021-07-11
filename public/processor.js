/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/processor.ts":
/*!**************************!*\
  !*** ./src/processor.ts ***!
  \**************************/
/***/ (() => {

eval("let heapFloat32;\nlet requestNumber = 0;\nlet instance;\nconsole.log('Processor loaded');\nclass RNNNoiseProcessor extends AudioWorkletProcessor {\n    constructor(options) {\n        super(Object.assign(Object.assign({}, options), { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] }));\n        if (!instance) {\n            // @ts-ignore\n            instance = new WebAssembly.Instance(options.processorOptions.module).exports;\n            // @ts-ignore\n            heapFloat32 = new Float32Array(instance.memory.buffer);\n        }\n        console.log('processor creating state');\n        this.state = instance.newState();\n        this.port.onmessage = ({ data: keepalive }) => {\n            if (keepalive) {\n                if (this.state === null) {\n                    console.log('processor creating state again');\n                    this.state = instance.newState();\n                }\n                this.port.postMessage({ vadProb: instance.getVadProb(this.state) });\n            }\n            else if (this.state) {\n                console.log('processor deleting state');\n                instance.deleteState(this.state);\n                this.state = null;\n            }\n        };\n    }\n    process(inputs, outputs, parameters) {\n        if (this.state) {\n            heapFloat32.set(inputs[0][0], instance.getInput(this.state) / 4);\n            const o = outputs[0][0];\n            const ptr4 = instance.pipe(this.state, o.length) / 4;\n            if (ptr4) {\n                o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));\n            }\n        }\n        else {\n            // rnnoise is turned off.\n            outputs[0][0].set(inputs[0][0]);\n        }\n        return true;\n    }\n}\nregisterProcessor(\"rnnoise\", RNNNoiseProcessor);\n\n\n//# sourceURL=webpack://rnnoise_wasm/./src/processor.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/processor.ts"]();
/******/ 	
/******/ })()
;