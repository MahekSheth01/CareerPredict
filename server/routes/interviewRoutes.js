import express from 'express';
import { getInterviewQuestions, getQuestionsByCareer } from '../controllers/interviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', verifyToken, getInterviewQuestions);
router.get('/questions/:career', verifyToken, getQuestionsByCareer);

export default router;
