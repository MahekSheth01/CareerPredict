import axios from 'axios';
import FormData from 'form-data';
import Resume from '../models/Resume.js';
import Career from '../models/Career.js';
import Assessment from '../models/Assessment.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// POST /api/resume-builder/create
export const createResume = async (req, res) => {
    try {
        const {
            template,
            personalInfo,
            education,
            skills,
            projects,
            experience,
            certifications,
        } = req.body;

        const resume = await Resume.create({
            userId: req.user._id,
            template: template || 'modern',
            personalInfo: personalInfo || {},
            education: education || [],
            skills: skills || [],
            projects: projects || [],
            experience: experience || [],
            certifications: certifications || [],
        });

        return res.status(201).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error('Create resume error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create resume.',
        });
    }
};

// GET /api/resume-builder/my-resumes
export const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ updatedAt: -1 })
            .limit(20);

        return res.status(200).json({
            success: true,
            data: resumes,
        });
    } catch (error) {
        console.error('Fetch resumes error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch resumes.',
        });
    }
};

// GET /api/resume-builder/:id
export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error('Get resume error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch resume.',
        });
    }
};

// PUT /api/resume-builder/update/:id
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found.',
            });
        }

        const allowedFields = [
            'template',
            'personalInfo',
            'education',
            'skills',
            'projects',
            'experience',
            'certifications',
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                resume[field] = req.body[field];
            }
        }

        await resume.save();

        return res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error('Update resume error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update resume.',
        });
    }
};

// DELETE /api/resume-builder/delete/:id
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Resume deleted successfully.',
        });
    } catch (error) {
        console.error('Delete resume error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete resume.',
        });
    }
};

// POST /api/resume-builder/extract  (multipart PDF upload)
export const extractResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please upload a PDF file.',
            });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        let aiResponse;
        try {
            const { data } = await axios.post(
                `${AI_SERVICE_URL}/extract-resume`,
                form,
                { headers: form.getHeaders(), timeout: 30000 },
            );
            aiResponse = data;
        } catch (aiError) {
            console.error('AI extract error:', aiError.response?.data || aiError.message);
            return res.status(502).json({
                success: false,
                message: 'AI extraction service is unavailable. Please try again later.',
            });
        }

        return res.status(200).json({
            success: true,
            data: aiResponse.data || aiResponse,
        });
    } catch (error) {
        console.error('Extract resume error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while extracting resume data.',
        });
    }
};

// POST /api/resume-builder/generate-pdf
export const generatePdf = async (req, res) => {
    try {
        const { resumeData, template } = req.body;

        if (!resumeData) {
            return res.status(400).json({
                success: false,
                message: 'Resume data is required.',
            });
        }

        let pdfResponse;
        try {
            pdfResponse = await axios.post(
                `${AI_SERVICE_URL}/generate-pdf`,
                { resumeData, template: template || 'modern' },
                { responseType: 'arraybuffer', timeout: 30000 },
            );
        } catch (aiError) {
            console.error('AI PDF generation error:', aiError.response?.data || aiError.message);
            return res.status(502).json({
                success: false,
                message: 'PDF generation service is unavailable. Please try again later.',
            });
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
        });

        return res.send(Buffer.from(pdfResponse.data));
    } catch (error) {
        console.error('Generate PDF error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while generating the PDF.',
        });
    }
};

// POST /api/resume-builder/ats-score
export const getAtsScore = async (req, res) => {
    try {
        const { skills: resumeSkills } = req.body;

        if (!resumeSkills || !Array.isArray(resumeSkills)) {
            return res.status(400).json({
                success: false,
                message: 'Resume skills array is required.',
            });
        }

        // Get the user's latest predicted career
        const assessment = await Assessment.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 });

        if (!assessment || !assessment.predictionResult) {
            return res.status(400).json({
                success: false,
                message: 'Please complete a career assessment first.',
            });
        }

        const predictedCareer =
            assessment.predictionResult.topCareers?.[0]?.careerName ||
            assessment.predictionResult.topCareers?.[0]?.career ||
            'Unknown';

        // Fetch required skills from Career collection
        const career = await Career.findOne({
            careerName: { $regex: new RegExp(predictedCareer, 'i') },
        });

        const requiredSkills = career?.requiredSkills || [];

        if (requiredSkills.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    atsScore: 0,
                    predictedCareer,
                    matchedSkills: [],
                    missingSkills: [],
                    optimizationSuggestions: [
                        'No required skills data found for your predicted career.',
                    ],
                },
            });
        }

        // Compare skills (case-insensitive)
        const resumeLower = resumeSkills.map((s) => s.toLowerCase().trim());
        const matchedSkills = requiredSkills.filter((rs) =>
            resumeLower.includes(rs.toLowerCase()),
        );
        const missingSkills = requiredSkills.filter(
            (rs) => !resumeLower.includes(rs.toLowerCase()),
        );

        const atsScore =
            requiredSkills.length > 0
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;

        // Build optimization suggestions
        const optimizationSuggestions = [];

        if (missingSkills.length > 0) {
            optimizationSuggestions.push(
                `Add these missing keywords to your resume: ${missingSkills.slice(0, 5).join(', ')}.`,
            );
        }

        if (atsScore < 50) {
            optimizationSuggestions.push(
                'Your resume has a low ATS match. Focus on adding the most critical missing skills.',
            );
            optimizationSuggestions.push(
                'Consider tailoring your resume specifically for the target role.',
            );
        } else if (atsScore < 75) {
            optimizationSuggestions.push(
                'Good progress! Add a few more relevant keywords to strengthen your match.',
            );
        }

        optimizationSuggestions.push(
            'Use strong action verbs like "developed", "implemented", "optimized", "led".',
        );
        optimizationSuggestions.push(
            'Include measurable achievements (e.g., "Improved performance by 30%").',
        );

        if (missingSkills.length > 3) {
            optimizationSuggestions.push(
                `Prioritize learning: ${missingSkills.slice(0, 3).join(', ')}.`,
            );
        }

        return res.status(200).json({
            success: true,
            data: {
                atsScore,
                predictedCareer,
                matchedSkills,
                missingSkills,
                optimizationSuggestions,
                totalRequired: requiredSkills.length,
                totalMatched: matchedSkills.length,
            },
        });
    } catch (error) {
        console.error('ATS score error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while calculating ATS score.',
        });
    }
};
