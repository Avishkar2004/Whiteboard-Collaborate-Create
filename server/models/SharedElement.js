import mongoose from "mongoose";

const sharedElementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    elements: {
      type: [Object],
      required: true,
    },
    elementIds: {
      type: [Number], // Store the original indices of shared elements
      required: true,
    },
    sourceWhiteboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Whiteboard",
      required: true,
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    autoUpdate: {
      type: Boolean,
      default: true, // Whether to auto-update when source changes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for shared elements
sharedElementSchema.index({ sharedBy: 1, createdAt: -1 });
sharedElementSchema.index({ sharedWith: 1, createdAt: -1 });
sharedElementSchema.index({ isPublic: 1, createdAt: -1 });
sharedElementSchema.index({ tags: 1 });
sharedElementSchema.index({ sourceWhiteboard: 1 });

const SharedElement = mongoose.model("SharedElement", sharedElementSchema);

export default SharedElement; 