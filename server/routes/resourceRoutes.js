import express from 'express';
import { getLearningResources } from '../controllers/resourceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommend', verifyToken, getLearningResources);

export default router;
