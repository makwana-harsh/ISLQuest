import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    mobileNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profilePic: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['user', 'moderator'],
      default: 'user',
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedUntil: {
      type: Date,
      default: null,
    },

    moduleScores: [
      {
        moduleNumber: {
          type: Number,
          required: true,
        },

        bestScore: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },

        lastAttemptedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);