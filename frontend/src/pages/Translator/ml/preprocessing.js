import {
  NOSE,
  LEFT_SHOULDER,
  RIGHT_SHOULDER,
  LEFT_HAND_START,
  LEFT_HAND_END,
  RIGHT_HAND_START,
  RIGHT_HAND_END
} from './constants';

function isMissing(point) {
  return Math.abs(point[0]) < 1e-6 && Math.abs(point[1]) < 1e-6 && Math.abs(point[2]) < 1e-6;
}

function cloneSeq(seq) {
  return seq.map(frame => frame.map(point => [point[0], point[1], point[2]]));
}

function getDistance(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function fixMissing(seq) {
  const frames = seq.length;
  const landmarks = seq[0].length;
  const out = cloneSeq(seq);

  for (let l = 0; l < landmarks; l++) {
    let allMissing = true;
    for (let f = 0; f < frames; f++) {
      if (!isMissing(out[f][l])) {
        allMissing = false;
        break;
      }
    }
    if (allMissing) continue;

    let i = 0;
    while (i < frames) {
      if (isMissing(out[i][l])) {
        const start = i;
        while (i < frames && isMissing(out[i][l])) {
          i++;
        }
        const end = i;
        const gap = end - start;

        const prev = start > 0 ? out[start - 1][l] : null;
        const next = end < frames ? out[end][l] : null;

        if (gap > 4) continue;

        for (let j = 0; j < gap; j++) {
          const idx = start + j;
          if (gap <= 2 && prev !== null && next !== null) {
            const alpha = (j + 1) / (gap + 1);
            for (let d = 0; d < 3; d++) {
              out[idx][l][d] = (1 - alpha) * prev[d] + alpha * next[d];
            }
          } else if ((gap === 3 || gap === 4) && prev !== null && next !== null) {
            if (j < 2) {
              const alpha = (j + 1) / (gap + 1);
              for (let d = 0; d < 3; d++) {
                out[idx][l][d] = (1 - alpha) * prev[d] + alpha * next[d];
              }
            } else {
              for (let d = 0; d < 3; d++) out[idx][l][d] = next[d];
            }
          } else if (prev !== null) {
            for (let d = 0; d < 3; d++) out[idx][l][d] = prev[d];
          } else if (next !== null) {
            for (let d = 0; d < 3; d++) out[idx][l][d] = next[d];
          } else {
            for (let d = 0; d < 3; d++) out[idx][l][d] = 0;
          }
        }
      } else {
        i++;
      }
    }
  }
  return out;
}

function smoothSequenceSafe(seq, alpha = 0.9) {
  const out = cloneSeq(seq);
  const frames = out.length;
  const landmarks = out[0].length;

  for (let i = 1; i < frames; i++) {
    for (let l = 0; l < landmarks; l++) {
      if (!isMissing(out[i][l])) {
        for (let d = 0; d < 3; d++) {
          out[i][l][d] = alpha * seq[i][l][d] + (1 - alpha) * out[i - 1][l][d];
        }
      }
    }
  }
  return out;
}

function removeSpikes(seq, threshold = 0.05) {
  const out = cloneSeq(seq);
  const frames = out.length;
  const landmarks = out[0].length;

  for (let i = 1; i < frames; i++) {
    for (let l = 0; l < landmarks; l++) {
      if (!isMissing(out[i][l])) {
        const diff = getDistance(out[i][l], out[i - 1][l]);
        if (diff > threshold) {
          for (let d = 0; d < 3; d++) {
            out[i][l][d] = (out[i][l][d] + out[i - 1][l][d]) / 2.0;
          }
        }
      }
    }
  }
  return out;
}

export function jitRemove(seq) {
  return removeSpikes(smoothSequenceSafe(seq, 0.9), 0.05);
}

function normalizeSequence(seq) {
  const frames = seq.length;
  const out = cloneSeq(seq);

  for (let i = 0; i < frames; i++) {
    const left = out[i][LEFT_SHOULDER];
    const right = out[i][RIGHT_SHOULDER];

    const chest = [
      (left[0] + right[0]) / 2,
      (left[1] + right[1]) / 2,
      (left[2] + right[2]) / 2
    ];

    for (let l = 0; l < 47; l++) {
      out[i][l][0] -= chest[0];
      out[i][l][1] -= chest[1];
      out[i][l][2] -= chest[2];
    }

    const dx = out[i][LEFT_SHOULDER][0] - out[i][RIGHT_SHOULDER][0];
    const dy = out[i][LEFT_SHOULDER][1] - out[i][RIGHT_SHOULDER][1];
    const dz = out[i][LEFT_SHOULDER][2] - out[i][RIGHT_SHOULDER][2];
    let shoulderDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (shoulderDist <= 1e-6) shoulderDist = 1.0;

    for (let l = 0; l < 47; l++) {
      out[i][l][0] /= shoulderDist;
      out[i][l][1] /= shoulderDist;
      out[i][l][2] /= shoulderDist;
    }
  }
  return out;
}

function alignShoulders(seq) {
  const frames = seq.length;
  const out = cloneSeq(seq);

  for (let i = 0; i < frames; i++) {
    const left = out[i][LEFT_SHOULDER];
    const right = out[i][RIGHT_SHOULDER];

    const dx = right[0] - left[0];
    const dy = right[1] - left[1];
    const norm = Math.sqrt(dx * dx + dy * dy);

    let angle = 0;
    if (norm > 1e-6) {
      angle = Math.atan2(dy, dx);
    }

    const rotAngle = -angle;
    const cosVal = Math.cos(rotAngle);
    const sinVal = Math.sin(rotAngle);

    for (let l = 0; l < 47; l++) {
      const x = out[i][l][0];
      const y = out[i][l][1];
      out[i][l][0] = x * cosVal - y * sinVal;
      out[i][l][1] = x * sinVal + y * cosVal;
    }
  }
  return out;
}

function handExists(handLandmarks) {
  return handLandmarks.some(p => !isMissing(p));
}

function computeDistances(seq) {
  const frames = seq.length;
  const distances = [];

  for (let i = 0; i < frames; i++) {
    const frameDist = new Array(84).fill(0);

    const leftShoulder = seq[i][LEFT_SHOULDER];
    const rightShoulder = seq[i][RIGHT_SHOULDER];
    const chest = [
      (leftShoulder[0] + rightShoulder[0]) / 2,
      (leftShoulder[1] + rightShoulder[1]) / 2,
      (leftShoulder[2] + rightShoulder[2]) / 2
    ];
    const nose = seq[i][NOSE];

    const leftHand = seq[i].slice(LEFT_HAND_START, LEFT_HAND_END);
    const rightHand = seq[i].slice(RIGHT_HAND_START, RIGHT_HAND_END);

    if (handExists(leftHand)) {
      for (let j = 0; j < 21; j++) {
        frameDist[j] = getDistance(leftHand[j], chest);
        frameDist[21 + j] = getDistance(leftHand[j], nose);
      }
    }

    if (handExists(rightHand)) {
      for (let j = 0; j < 21; j++) {
        frameDist[42 + j] = getDistance(rightHand[j], chest);
        frameDist[63 + j] = getDistance(rightHand[j], nose);
      }
    }

    distances.push(frameDist);
  }
  return distances;
}

export function normalizeMain(seq) {
  const frames = seq.length;
  let processed = normalizeSequence(seq);
  processed = alignShoulders(processed);
  const distances = computeDistances(processed);

  const final = [];
  for (let i = 0; i < frames; i++) {
    const frameCoords = [];
    for (let l = 0; l < 47; l++) {
      frameCoords.push(processed[i][l][0], processed[i][l][1], processed[i][l][2]);
    }
    final.push([...frameCoords, ...distances[i]]);
  }
  return final;
}

export function preprocessFrames(seqBuffer) {
  return normalizeMain(jitRemove(fixMissing(seqBuffer)));
}