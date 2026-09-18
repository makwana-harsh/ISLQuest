import * as tf from '@tensorflow/tfjs';

let cachedModel = null;

export async function loadISLModel() {
  if (cachedModel) return cachedModel;

  await tf.ready();
  // Loads from public/Isl_model/model.json
  cachedModel = await tf.loadLayersModel('../../../public/Isl_model/model.json');
  return cachedModel;
}