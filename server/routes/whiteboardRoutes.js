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
  shareElements,
  getSharedElements,
  getSharedElement,
  deleteSharedElement,
  updateSharedElement,
  syncSharedElement,
  testSharedElement,
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

// Get shared elements (MUST come before /:id routes)
router.get("/shared-elements", getSharedElements);

// Test SharedElement model
router.get("/test-shared-element", testSharedElement);

// Get a specific shared element
router.get("/shared-elements/:id", getSharedElement);

// Update a shared element
router.put("/shared-elements/:id", updateSharedElement);

// Sync a shared element with source whiteboard
router.post("/shared-elements/:id/sync", syncSharedElement);

// Delete a shared element
router.delete("/shared-elements/:id", deleteSharedElement);

// Get whiteboard collaborators
router.get("/collaborators/:id", getCollaborators);

// Share specific elements from a whiteboard
router.post("/share-elements/:id", shareElements);

// Star or unstar a whiteboard
router.put("/star/:id", toggleStarWhiteboard);

// Share whiteboard with another user
router.post("/share/:id", shareWhiteboard);

// Remove collaborator from whiteboard
router.delete("/collaborator/:id", removeCollaborator);

// Get a specific whiteboard (MUST come after specific routes)
router.get("/:id", getWhiteboard);

// Update whiteboard content
router.put("/:id", updateWhiteboard);

// Delete whiteboard
router.delete("/:id", deleteWhiteboard);

export default router;
