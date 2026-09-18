import mongoose from 'mongoose';

const LearnSignSchema = new mongoose.Schema(
  {
    moduleNumber: {
      type: Number,
      required: true,
    },

    moduleName: {
      type: String,
      required: true,
      trim: true,
    },

    signName: {
      type: String,
      required: true,
      trim: true,
    },

    meaning: {
      type: String,
      required: true,
      trim: true,
    },

    usage: {
      type: String,
      default: '',
      trim: true,
    },

    videoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

LearnSignSchema.index(
  { moduleNumber: 1, signName: 1 },
  { unique: true }
);

export default mongoose.model('LearnSign', LearnSignSchema);