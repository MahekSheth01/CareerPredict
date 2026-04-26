import express from 'express';
import { getJobRecommendations, getAllJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Student route
router.get('/recommend', verifyToken, getJobRecommendations);

// Admin CRUD routes
router.get('/', verifyToken, authorizeRole('admin'), getAllJobs);
router.post('/', verifyToken, authorizeRole('admin'), createJob);
router.put('/:id', verifyToken, authorizeRole('admin'), updateJob);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteJob);

export default router;
