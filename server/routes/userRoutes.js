import express from 'express';
const router = express.Router();
import { register, login, logout, getProfile, updateProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(auth);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router; 