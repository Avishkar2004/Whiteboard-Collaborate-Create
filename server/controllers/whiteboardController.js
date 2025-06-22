import Whiteboard from "../models/Whiteboard.js";
import User from "../models/User.js";

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

    // Add isStarred property to each whiteboard
    const whiteboardsWithStarStatus = whiteboards.map((whiteboard) => {
      const whiteboardObj = whiteboard.toObject();
      whiteboardObj.isStarred = whiteboard.starredBy.includes(req.user._id);
      return whiteboardObj;
    });

    res.json(whiteboardsWithStarStatus);
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

// Star or unstar a whiteboard
export const toggleStarWhiteboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { isStarred } = req.body; // true to star, false to unstar
    const userId = req.user._id;

    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    // Only allow owner or collaborators to star
    if (
      whiteboard.owner.toString() !== userId.toString() &&
      !whiteboard.collaborators.includes(userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (isStarred) {
      // Add user to starredBy if not already present
      if (!whiteboard.starredBy.includes(userId)) {
        whiteboard.starredBy.push(userId);
      }
    } else {
      // Remove user from starredBy
      whiteboard.starredBy = whiteboard.starredBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    }

    await whiteboard.save();
    res.json({
      ...whiteboard.toObject(),
      isStarred: whiteboard.starredBy.includes(userId),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starring whiteboard", error: error.message });
  }
};

// Get all starred boards for a user
export const getStarredBoards = async (req, res) => {
  try {
    const userId = req.user._id;
    const starredBoards = await Whiteboard.find({ starredBy: userId }).sort({
      lastModified: -1,
    });
    res.json(starredBoards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching starred boards", error: error.message });
  }
};

// Share whiteboard with another user
export const shareWhiteboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { collaboratorEmail } = req.body;
    const userId = req.user._id;

    // Validate whiteboard ID
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

    // Only owner can share
    if (whiteboard.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can share this whiteboard",
      });
    }

    // Find user by email
    const collaborator = await User.findOne({ email: collaboratorEmail });
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Can't share with yourself
    if (collaborator._id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot share a whiteboard with yourself",
      });
    }

    // Check if already shared
    if (whiteboard.collaborators.includes(collaborator._id)) {
      return res.status(400).json({
        success: false,
        message: "Whiteboard is already shared with this user",
      });
    }

    // Add collaborator
    whiteboard.collaborators.push(collaborator._id);
    await whiteboard.save();

    // Return updated whiteboard with collaborator info
    const updatedWhiteboard = await Whiteboard.findById(id)
      .populate("collaborators", "username email")
      .populate("owner", "username email");

    res.json({
      success: true,
      message: `Whiteboard shared successfully with ${collaborator.username}`,
      whiteboard: updatedWhiteboard,
    });
  } catch (error) {
    console.error("Error in shareWhiteboard:", error);
    res.status(500).json({
      success: false,
      message: "Error sharing whiteboard",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Remove collaborator from whiteboard
export const removeCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { collaboratorId } = req.body;
    const userId = req.user._id;

    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    // Only owner can remove collaborators
    if (whiteboard.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can remove collaborators",
      });
    }

    // Remove collaborator
    whiteboard.collaborators = whiteboard.collaborators.filter(
      (cid) => cid.toString() !== collaboratorId
    );
    await whiteboard.save();

    // Return updated whiteboard
    const updatedWhiteboard = await Whiteboard.findById(id)
      .populate("collaborators", "username email")
      .populate("owner", "username email");

    res.json({
      success: true,
      message: "Collaborator removed successfully",
      whiteboard: updatedWhiteboard,
    });
  } catch (error) {
    console.error("Error in removeCollaborator:", error);
    res.status(500).json({
      success: false,
      message: "Error removing collaborator",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get whiteboard collaborators
export const getCollaborators = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const whiteboard = await Whiteboard.findById(id)
      .populate("collaborators", "username email")
      .populate("owner", "username email");

    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    // Check if user has access
    if (
      whiteboard.owner.toString() !== userId.toString() &&
      !whiteboard.collaborators.some(
        (c) => c._id.toString() === userId.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied to get collaborators",
      });
    }

    res.json({
      success: true,
      collaborators: whiteboard.collaborators,
      owner: whiteboard.owner,
    });
  } catch (error) {
    console.error("Error in getCollaborators:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching collaborators",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
