import * as tf from '@tensorflow/tfjs';
import { preprocessFrames } from './preprocessing';
import {
  SEQUENCE_LENGTH,
  THRESHOLD,
  SMOOTHING_WINDOW,
  SIGN_NAMES,
  LEFT_HAND_START
} from './constants';

export class PredictorEngine {
  constructor(model) {
    this.model = model;
    this.sequenceBuffer = [];
    this.predSmoothing = [];
  }

  reset() {
    this.sequenceBuffer = [];
    this.predSmoothing = [];
  }

  processFrame(landmarks) {
    // Hands exist from index 5 to 46
    const hasHandData = landmarks.slice(LEFT_HAND_START).some(
      pt => Math.abs(pt[0]) > 1e-6 || Math.abs(pt[1]) > 1e-6 || Math.abs(pt[2]) > 1e-6
    );

    if (!hasHandData) {
      this.reset();
      return { status: 'no_hands', sign: null, confidence: 0 };
    }

    this.sequenceBuffer.push(landmarks);

    // Keep sliding window size fixed
    if (this.sequenceBuffer.length > SEQUENCE_LENGTH) {
      this.sequenceBuffer.shift();
    }

    if (this.sequenceBuffer.length < SEQUENCE_LENGTH) {
      return {
        status: 'buffering',
        progress: this.sequenceBuffer.length,
        total: SEQUENCE_LENGTH,
        sign: null,
        confidence: 0
      };
    }

    return tf.tidy(() => {
      const preprocessed = preprocessFrames(this.sequenceBuffer); // [50, 225]
      const inputTensor = tf.tensor3d([preprocessed]); // [1, 50, 225]

      const predictionTensor = this.model.predict(inputTensor);
      const prediction = Array.from(predictionTensor.dataSync());

      this.predSmoothing.push(prediction);
      if (this.predSmoothing.length > SMOOTHING_WINDOW) {
        this.predSmoothing.shift();
      }

      // Mean smoothing over SMOOTHING_WINDOW
      const numClasses = prediction.length;
      const smoothed = new Array(numClasses).fill(0);
      for (const pred of this.predSmoothing) {
        for (let c = 0; c < numClasses; c++) {
          smoothed[c] += pred[c] / this.predSmoothing.length;
        }
      }

      let maxIdx = 0;
      let maxConf = smoothed[0];
      for (let c = 1; c < numClasses; c++) {
        if (smoothed[c] > maxConf) {
          maxConf = smoothed[c];
          maxIdx = c;
        }
      }

      if (maxConf > THRESHOLD) {
        return {
          status: 'detected',
          sign: SIGN_NAMES[maxIdx],
          confidence: Number(maxConf.toFixed(2))
        };
      }

      return {
        status: 'listening',
        sign: null,
        confidence: Number(maxConf.toFixed(2))
      };
    });
  }
}