import Whiteboard from "../models/Whiteboard.js";

// Create a new whiteboard
export const createWhiteboard = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const whiteboard = new Whiteboard({
      name,
      owner: req.user._id,
      isPublic,
    });
    await whiteboard.save();
    res.status(201).json(whiteboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating whiteboard", error: error.message });
  }
};

// Get all whiteboards for a user
export const getUserWhiteboards = async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find({
      $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
    }).sort({ lastModified: -1 });
    res.json(whiteboards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching whiteboards", error: error.message });
  }
};

// Get a single whiteboard
export const getWhiteboard = async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    // Check if user has access
    if (
      !whiteboard.isPublic &&
      whiteboard.owner.toString() !== req.user._id.toString() &&
      !whiteboard.collaborators.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(whiteboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching whiteboard", error: error.message });
  }
};

// Update whiteboard content
export const updateWhiteboard = async (req, res) => {
  try {
    const { content } = req.body;
    const whiteboard = await Whiteboard.findById(req.params.id);

    if (!whiteboard) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    // Check if user has access
    if (
      whiteboard.owner.toString() !== req.user._id.toString() &&
      !whiteboard.collaborators.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    whiteboard.content = content;
    whiteboard.lastModified = Date.now();
    await whiteboard.save();

    res.json(whiteboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating whiteboard", error: error.message });
  }
};

// Delete whiteboard
export const deleteWhiteboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid whiteboard ID format",
      });
    }

    const whiteboard = await Whiteboard.findById(id);

    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    // Only owner can delete
    if (whiteboard.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete this whiteboard",
        currentUser: req.user._id,
        owner: whiteboard.owner,
      });
    }

    // If the whiteboard has collaborators, we might want to notify them
    const collaborators = whiteboard.collaborators || [];

    // Delete the whiteboard
    await Whiteboard.findByIdAndDelete(id);

    // Send success response with additional info
    res.json({
      success: true,
      message: "Whiteboard deleted successfully",
      deletedWhiteboard: {
        id: whiteboard._id,
        name: whiteboard.name,
        collaboratorsCount: collaborators.length,
      },
    });

    // Here you could add additional cleanup tasks if needed:
    // - Delete associated files
    // - Remove references from other collections
    // - Send notifications to collaborators
    // These would typically be handled asynchronously
  } catch (error) {
    console.error("Error in deleteWhiteboard:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting whiteboard",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
