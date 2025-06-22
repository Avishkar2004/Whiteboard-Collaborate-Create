import express from "express";
const router = express.Router();
import {
  createWhiteboard,
  deleteWhiteboard,
  getUserWhiteboards,
  getWhiteboard,
  toggleStarWhiteboard,
  updateWhiteboard,
  getStarredBoards,
  shareWhiteboard,
  removeCollaborator,
  getCollaborators,
} from "../controllers/whiteboardController.js";
import auth from "../middleware/auth.js";

// All routes are protected with authentication
router.use(auth);

// Create a new whiteboard
router.post("/", createWhiteboard);

// Get all whiteboards for the authenticated user
router.get("/my-whiteboards", getUserWhiteboards);

// Get all starred boards
router.get("/starred", getStarredBoards);

// Get a specific whiteboard
router.get("/:id", getWhiteboard);

// Update whiteboard content
router.put("/:id", updateWhiteboard);

// Delete whiteboard
router.delete("/:id", deleteWhiteboard);

// Star or unstar a whiteboard
router.put("/star/:id", toggleStarWhiteboard);

// Share whiteboard with another user
router.post("/share/:id", shareWhiteboard);

// Remove collaborator from whiteboard
router.delete("/collaborator/:id", removeCollaborator);

// Get whiteboard collaborators
router.get("/collaborators/:id", getCollaborators);

export default router;
