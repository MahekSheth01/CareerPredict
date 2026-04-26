import express from 'express';
import { getProjectRecommendations, getAllProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Student route
router.get('/recommend', verifyToken, getProjectRecommendations);

// Admin CRUD routes
router.get('/', verifyToken, authorizeRole('admin'), getAllProjects);
router.post('/', verifyToken, authorizeRole('admin'), createProject);
router.put('/:id', verifyToken, authorizeRole('admin'), updateProject);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteProject);

export default router;
