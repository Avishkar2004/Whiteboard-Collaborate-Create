import express from "express";
const router = express.Router();
import {
  createWhiteboard,
  deleteWhiteboard,
  getUserWhiteboards,
  getWhiteboard,
  updateWhiteboard,
    } from "../controllers/whiteboardController.js";
import auth from "../middleware/auth.js";

// All routes are protected with authentication
router.use(auth);

// Create a new whiteboard
router.post("/", createWhiteboard);

// Get all whiteboards for the authenticated user
router.get("/my-whiteboards", getUserWhiteboards);

// Get a specific whiteboard
router.get("/:id", getWhiteboard);

// Update whiteboard content
router.put("/:id", updateWhiteboard);

// Delete whiteboard
router.delete("/:id", deleteWhiteboard);

export default router;
