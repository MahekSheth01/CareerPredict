import express from 'express';
import {
    submitAssessment,
    getMyAssessment,
    getCareerRoadmap,
    getAllAssessments,
} from '../controllers/assessmentController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/', verifyToken, authorizeRole('student'), submitAssessment);
router.get('/me', verifyToken, authorizeRole('student'), getMyAssessment);
router.get('/roadmap/:careerName', verifyToken, authorizeRole('student'), getCareerRoadmap);

// Admin routes
router.get('/', verifyToken, authorizeRole('admin'), getAllAssessments);

export default router;
