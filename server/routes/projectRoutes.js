import express from 'express';
import { getProjectRecommendations } from '../controllers/projectController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommend', verifyToken, getProjectRecommendations);

export default router;
