import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import {
    uploadResume,
    getMyAnalyses,
    createResume,
    getMyResumes,
    getResume,
    updateResume,
    deleteResume,
    extractResume,
    generatePdf,
    getAtsScore,
} from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for in-memory PDF uploads (max 5 MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'), false);
        }
    },
});

// Multer error handler wrapper
const handleUpload = (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size must not exceed 5 MB.',
                });
            }
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// ── Resume Analyzer (existing) ──────────────────────────────────────
router.post('/upload', verifyToken, handleUpload, uploadResume);
router.get('/my-analyses', verifyToken, getMyAnalyses);

// ── Resume Builder CRUD ─────────────────────────────────────────────
router.post('/create', verifyToken, createResume);
router.get('/my-resumes', verifyToken, getMyResumes);
router.get('/:id', verifyToken, getResume);
router.put('/update/:id', verifyToken, updateResume);
router.delete('/delete/:id', verifyToken, deleteResume);

// ── Resume Editor (extract) ─────────────────────────────────────────
router.post('/extract', verifyToken, handleUpload, extractResume);

// ── PDF Generation ──────────────────────────────────────────────────
router.post('/generate-pdf', verifyToken, generatePdf);

// ── ATS Score ───────────────────────────────────────────────────────
router.post('/ats-score', verifyToken, getAtsScore);

export default router;
