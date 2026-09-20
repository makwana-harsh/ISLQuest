import * as tf from '@tensorflow/tfjs';

let cachedModel = null;
const MODEL_URL = '/Isl_models/model.json';

export async function loadISLModel() {
  if (cachedModel) return cachedModel;

  await tf.ready();
  // Loads from public/Isl_model/model.json
  cachedModel = await tf.loadLayersModel(MODEL_URL);
  return cachedModel;
}