import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    signName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
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

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    llmReview: {
      approved: {
        type: Boolean,
        default: null,
      },

      issues: {
        type: [String],
        default: [],
      },

      suggestion: {
        type: String,
        default: "",
      },
    },

    moderatorFeedback: {
      type: String,
      default: "",
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    moderatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contribution", ContributionSchema);