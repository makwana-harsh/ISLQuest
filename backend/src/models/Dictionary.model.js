import mongoose from 'mongoose';

const DictionarySchema = new mongoose.Schema(
  {
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
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    sourceType: {
      type: String,
      enum: ['organization', 'user'],
      required: true,
    },

    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

DictionarySchema.index({
  signName: 'text',
  meaning: 'text',
  usage: 'text',
});

export default mongoose.model('Dictionary', DictionarySchema);