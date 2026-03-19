import express from 'express';
import { getJobRecommendations } from '../controllers/jobController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommend', verifyToken, getJobRecommendations);

export default router;
