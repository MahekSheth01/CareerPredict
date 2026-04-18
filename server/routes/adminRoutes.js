import express from 'express';
import {
    getSystemStats,
    getMonthlySummary,
    getSkillGapReport,
    getTopCareersReport,
    getResumeStats,
    getUsersEnriched,
} from '../controllers/adminController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, authorizeRole('admin'));

router.get('/system-stats', getSystemStats);
router.get('/monthly-summary', getMonthlySummary);
router.get('/skill-gap', getSkillGapReport);
router.get('/top-careers', getTopCareersReport);
router.get('/resume-stats', getResumeStats);
router.get('/users-enriched', getUsersEnriched);

export default router;
