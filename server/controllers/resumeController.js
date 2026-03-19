import axios from 'axios';
import FormData from 'form-data';
import Career from '../models/Career.js';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import Assessment from '../models/Assessment.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ── Helper: get predicted career ─────────────────────────────────────
async function _getPredictedCareer(userId) {
    const assessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });
    return (
        assessment?.predictionResult?.topCareers?.[0]?.careerName ||
        assessment?.predictionResult?.topCareers?.[0]?.career ||
        null
    );
}

// ══════════════════════════════════════════════════════════════════════
//  RESUME ANALYZER (existing)
// ══════════════════════════════════════════════════════════════════════

// POST /api/resume/upload
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please upload a PDF file.',
            });
        }

        const predictedCareer = await _getPredictedCareer(req.user._id);
        if (!predictedCareer) {
            return res.status(400).json({
                success: false,
                message: 'Please complete a career assessment first before analysing your resume.',
            });
        }

        // Send PDF to AI microservice
        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        let aiResponse;
        try {
            const { data } = await axios.post(
                `${AI_SERVICE_URL}/analyze-resume`,
                form,
                { headers: form.getHeaders(), timeout: 30000 },
            );
            aiResponse = data;
        } catch (aiError) {
            console.error('AI service error:', aiError.response?.data || aiError.message);
            return res.status(502).json({
                success: false,
                message: 'AI analysis service is unavailable. Please try again later.',
            });
        }

        const extractedSkills = aiResponse.extracted_skills || [];

        // Fetch required skills
        const career = await Career.findOne({
            careerName: { $regex: new RegExp(predictedCareer, 'i') },
        });
        const requiredSkills = career?.requiredSkills || [];

        // Skill comparison — case-insensitive with partial/word-contains fallback
        // e.g. 'machine learning' from AI matches 'Machine Learning' from DB
        const extractedLower = extractedSkills.map((s) => s.toLowerCase().trim());

        const skillMatches = (requiredSkill) => {
            const rsLower = requiredSkill.toLowerCase().trim();
            // 1. Exact match
            if (extractedLower.includes(rsLower)) return true;
            // 2. Required skill is contained in any extracted skill (handles 'node.js' vs 'node')
            if (extractedLower.some((es) => es.includes(rsLower) || rsLower.includes(es))) return true;
            // 3. Word-by-word: every word in the required skill appears in some extracted skill
            const requiredWords = rsLower.split(/\s+/).filter(w => w.length > 2);
            if (requiredWords.length > 1) {
                const allText = extractedLower.join(' ');
                return requiredWords.every((w) => allText.includes(w));
            }
            return false;
        };

        const matchedSkills = requiredSkills.filter(skillMatches);
        const missingSkills = requiredSkills.filter((rs) => !skillMatches(rs));

        const matchScore =
            requiredSkills.length > 0
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;

        // Suggestions
        const suggestions = missingSkills.map(
            (skill) => `Learn ${skill} to strengthen your profile for ${predictedCareer}.`,
        );
        if (matchScore < 50) {
            suggestions.unshift(
                'Consider building projects that combine multiple required skills.',
            );
        }
        if (missingSkills.length > 0) {
            suggestions.push(
                `Focus on the top 3 missing skills: ${missingSkills.slice(0, 3).join(', ')}.`,
            );
        }

        // Save analysis
        const analysis = await ResumeAnalysis.create({
            userId: req.user._id,
            extractedSkills,
            missingSkills,
            matchScore,
            predictedCareer,
            suggestions,
            skillDetails: aiResponse.skill_details || {},
            fileName: req.file.originalname,
        });

        return res.status(200).json({
            success: true,
            data: {
                id: analysis._id,
                extractedSkills,
                missingSkills,
                matchScore,
                predictedCareer,
                suggestions,
                skillDetails: aiResponse.skill_details || {},
                confidenceScore: aiResponse.confidence_score,
                fileName: req.file.originalname,
                createdAt: analysis.createdAt,
            },
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while analysing your resume.',
        });
    }
};

// GET /api/resume/my-analyses
export const getMyAnalyses = async (req, res) => {
    try {
        const analyses = await ResumeAnalysis.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({ success: true, data: analyses });
    } catch (error) {
        console.error('Fetch analyses error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch resume analyses.',
        });
    }
};

// ══════════════════════════════════════════════════════════════════════
//  RESUME BUILDER – CRUD
// ══════════════════════════════════════════════════════════════════════

// POST /api/resume/create
export const createResume = async (req, res) => {
    try {
        const { template, personalInfo, education, skills, projects, experience, certifications } = req.body;

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

        return res.status(201).json({ success: true, data: resume });
    } catch (error) {
        console.error('Create resume error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create resume.' });
    }
};

// GET /api/resume/my-resumes
export const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ updatedAt: -1 })
            .limit(20);
        return res.status(200).json({ success: true, data: resumes });
    } catch (error) {
        console.error('Fetch resumes error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch resumes.' });
    }
};

// GET /api/resume/:id
export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found.' });
        }
        return res.status(200).json({ success: true, data: resume });
    } catch (error) {
        console.error('Get resume error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch resume.' });
    }
};

// PUT /api/resume/update/:id
export const updateResume = async (req, res) => {
    try {
        const { template, personalInfo, education, skills, projects, experience, certifications } = req.body;

        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            {
                $set: {
                    ...(template && { template }),
                    ...(personalInfo && { personalInfo }),
                    ...(education && { education }),
                    ...(skills && { skills }),
                    ...(projects && { projects }),
                    ...(experience && { experience }),
                    ...(certifications && { certifications }),
                    updatedAt: Date.now(),
                },
            },
            { new: true },
        );

        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found.' });
        }

        return res.status(200).json({ success: true, data: resume });
    } catch (error) {
        console.error('Update resume error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update resume.' });
    }
};

// DELETE /api/resume/delete/:id
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found.' });
        }
        return res.status(200).json({ success: true, message: 'Resume deleted.' });
    } catch (error) {
        console.error('Delete resume error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete resume.' });
    }
};

// ══════════════════════════════════════════════════════════════════════
//  RESUME EDITOR – Extract structured data from PDF
// ══════════════════════════════════════════════════════════════════════

// POST /api/resume/extract
export const extractResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const { data } = await axios.post(
            `${AI_SERVICE_URL}/extract-resume`,
            form,
            { headers: form.getHeaders(), timeout: 30000 },
        );

        return res.status(200).json({ success: true, data: data.data });
    } catch (error) {
        console.error('Extract resume error:', error.response?.data || error.message);
        return res.status(502).json({
            success: false,
            message: 'Failed to extract resume data. Is the AI service running?',
        });
    }
};

// ══════════════════════════════════════════════════════════════════════
//  PDF GENERATION – Forward to AI service
// ══════════════════════════════════════════════════════════════════════

// POST /api/resume/generate-pdf
export const generatePdf = async (req, res) => {
    try {
        const { resumeData, template } = req.body;
        if (!resumeData) {
            return res.status(400).json({ success: false, message: 'resumeData is required.' });
        }

        const { data } = await axios.post(
            `${AI_SERVICE_URL}/generate-pdf`,
            { resumeData, template: template || 'modern' },
            { responseType: 'arraybuffer', timeout: 30000 },
        );

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
        });
        return res.send(Buffer.from(data));
    } catch (error) {
        console.error('Generate PDF error:', error.response?.data || error.message);
        return res.status(502).json({
            success: false,
            message: 'Failed to generate PDF. Is the AI service running?',
        });
    }
};

// ══════════════════════════════════════════════════════════════════════
//  ATS SCORE
// ══════════════════════════════════════════════════════════════════════

// POST /api/resume/ats-score
export const getAtsScore = async (req, res) => {
    try {
        const { skills } = req.body; // array of skill strings from resume

        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({ success: false, message: 'skills array is required.' });
        }

        const predictedCareer = await _getPredictedCareer(req.user._id);
        if (!predictedCareer) {
            return res.status(400).json({
                success: false,
                message: 'Complete a career assessment first.',
            });
        }

        const career = await Career.findOne({
            careerName: { $regex: new RegExp(predictedCareer, 'i') },
        });
        const requiredSkills = career?.requiredSkills || [];

        const skillsLower = skills.map((s) => s.toLowerCase());
        const matchedSkills = requiredSkills.filter((rs) =>
            skillsLower.includes(rs.toLowerCase()),
        );
        const missingSkills = requiredSkills.filter(
            (rs) => !skillsLower.includes(rs.toLowerCase()),
        );

        const atsScore =
            requiredSkills.length > 0
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;

        // Optimization suggestions
        const suggestions = [];
        if (missingSkills.length > 0) {
            suggestions.push(
                `Add these missing keywords to your resume: ${missingSkills.slice(0, 5).join(', ')}.`,
            );
        }
        if (atsScore < 40) {
            suggestions.push('Your resume lacks many required keywords. Consider tailoring it specifically for this career.');
        }
        suggestions.push('Use strong action verbs like "developed", "implemented", "optimised".');
        suggestions.push('Include measurable achievements (e.g. "increased performance by 30%").');
        if (missingSkills.length > 3) {
            suggestions.push(`Focus on learning the top 3 missing skills: ${missingSkills.slice(0, 3).join(', ')}.`);
        }

        return res.status(200).json({
            success: true,
            data: {
                atsScore,
                predictedCareer,
                matchedSkills,
                missingSkills,
                optimizationSuggestions: suggestions,
            },
        });
    } catch (error) {
        console.error('ATS score error:', error);
        return res.status(500).json({ success: false, message: 'Failed to calculate ATS score.' });
    }
};
