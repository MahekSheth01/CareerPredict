import express from 'express';
import { getLearningResources, getAllResources, createResource, updateResource, deleteResource } from '../controllers/resourceController.js';
import { verifyToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Student route
router.get('/recommend', verifyToken, getLearningResources);

// Admin CRUD routes
router.get('/', verifyToken, authorizeRole('admin'), getAllResources);
router.post('/', verifyToken, authorizeRole('admin'), createResource);
router.put('/:id', verifyToken, authorizeRole('admin'), updateResource);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteResource);

export default router;
