import express from 'express';
import {
    createCareer,
    getAllCareers,
    getCareer,
    updateCareer,
    deleteCareer,
    getAnalytics,
    getAllUsers,
    toggleUserStatus,
} from '../controllers/careerController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCareers);
router.get('/:id', getCareer);

// Admin routes
router.post('/', verifyToken, authorizeRole('admin'), createCareer);
router.put('/:id', verifyToken, authorizeRole('admin'), updateCareer);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteCareer);
router.get('/analytics/dashboard', verifyToken, authorizeRole('admin'), getAnalytics);
router.get('/users/all', verifyToken, authorizeRole('admin'), getAllUsers);
router.patch('/users/:id/toggle-status', verifyToken, authorizeRole('admin'), toggleUserStatus);

export default router;
