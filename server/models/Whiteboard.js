import mongoose from "mongoose";

const whiteboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: Object,
      default: {
        elements: [],
        version: 1,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
whiteboardSchema.index({ owner: 1, lastModified: -1 });
whiteboardSchema.index({ collaborators: 1, lastModified: -1 });

const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);

export default Whiteboard;
