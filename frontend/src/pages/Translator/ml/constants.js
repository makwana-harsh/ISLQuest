export const SEQUENCE_LENGTH = 50;
export const THRESHOLD = 0.75;
export const SMOOTHING_WINDOW = 5;

// Landmark indices within the 47-point array
export const NOSE = 0;
export const LEFT_SHOULDER = 1;
export const RIGHT_SHOULDER = 2;
export const LEFT_ELBOW = 3;
export const RIGHT_ELBOW = 4;

export const LEFT_HAND_START = 5;
export const LEFT_HAND_END = 26; // 21 points (5 to 25)

export const RIGHT_HAND_START = 26;
export const RIGHT_HAND_END = 47; // 21 points (26 to 46)

// MediaPipe holistic landmark indices mapping to the 5 pose points
export const POSE_LANDMARK_MAP = [0, 11, 12, 13, 14];

export const SIGN_NAMES = [
  'blood', 'bye', 'call', 'cold', 'come', 'cough', 'fever', 'go', 'headache',
  'hello', 'help', 'here', 'i', 'medicine', 'mouth', 'no', 'okay', 'pain', 'repeat',
  'rest', 'sit', 'sorry', 'stand', 'thank_you', 'today', 'tomorrow', 'understand',
  'wait', 'walk', 'yes'
];