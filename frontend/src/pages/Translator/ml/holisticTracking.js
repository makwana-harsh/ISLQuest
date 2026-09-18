import { Holistic } from '@mediapipe/holistic';
import { POSE_LANDMARK_MAP } from './constants';

let holisticInstance = null;

export function initHolistic(onResultsCallback) {
  if (holisticInstance) return holisticInstance;

  holisticInstance = new Holistic({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
  });

  holisticInstance.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  holisticInstance.onResults((results) => {
    const formattedLandmarks = extractLandmarks(results);
    onResultsCallback({ rawResults: results, landmarks: formattedLandmarks });
  });

  return holisticInstance;
}

export function extractLandmarks(results) {
  const pose = Array.from({ length: 5 }, () => [0, 0, 0]);
  if (results.poseLandmarks) {
    POSE_LANDMARK_MAP.forEach((idx, i) => {
      const lm = results.poseLandmarks[idx];
      if (lm) pose[i] = [lm.x, lm.y, lm.z];
    });
  }

  const lh = Array.from({ length: 21 }, () => [0, 0, 0]);
  if (results.leftHandLandmarks) {
    results.leftHandLandmarks.forEach((lm, i) => {
      lh[i] = [lm.x, lm.y, lm.z];
    });
  }

  const rh = Array.from({ length: 21 }, () => [0, 0, 0]);
  if (results.rightHandLandmarks) {
    results.rightHandLandmarks.forEach((lm, i) => {
      rh[i] = [lm.x, lm.y, lm.z];
    });
  }

  return [...pose, ...lh, ...rh]; // Exactly 47 landmarks x 3 coords
}