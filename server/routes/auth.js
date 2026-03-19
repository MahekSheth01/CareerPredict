import express from 'express';
import {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    uploadProfilePhoto,
    upload,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.put('/profile-photo', verifyToken, upload.single('photo'), uploadProfilePhoto);

export default router;
