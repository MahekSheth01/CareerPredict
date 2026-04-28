import axios from 'axios';
import Assessment from '../models/Assessment.js';
import Career from '../models/Career.js';

// @desc    Submit assessment and get prediction
// @route   POST /api/assessments
// @access  Private (Student)
export const submitAssessment = async (req, res) => {
    try {
        const userId = req.user._id;
        const assessmentData = req.body;

        // Check if user already has an assessment
        let assessment = await Assessment.findOne({ userId });

        if (assessment) {
            // Update existing assessment
            Object.assign(assessment, assessmentData);
        } else {
            // Create new assessment
            assessment = new Assessment({
                userId,
                ...assessmentData,
            });
        }

        // Call AI service for prediction
        try {
            const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, {
                technicalSkills: assessmentData.technicalSkills || [],
                softSkills: assessmentData.softSkills || [],
                interests: assessmentData.interests || {},
                gpa: assessmentData.gpa || 0,
                strongSubjects: assessmentData.strongSubjects || [],
                projectsCompleted: assessmentData.projectsCompleted || 0,
                internshipExperience: assessmentData.internshipExperience || 'none',
                preferredWorkStyle: assessmentData.preferredWorkStyle || 'flexible',
            });

            // Get career data for skill gap analysis
            const careers = await Career.find({});
            const careerMap = {};
            careers.forEach(career => {
                careerMap[career.careerName] = career.requiredSkills;
            });

            // Calculate skill gaps
            const skillGaps = [];
            const userSkills = new Set([
                ...(assessmentData.technicalSkills || []),
                ...(assessmentData.softSkills || []),
            ]);

            aiResponse.data.predictions.forEach(prediction => {
                const requiredSkills = careerMap[prediction.career] || [];
                const missingSkills = requiredSkills.filter(skill => !userSkills.has(skill));

                skillGaps.push({
                    career: prediction.career,
                    missingSkills,
                });
            });

            // Store prediction results
            assessment.predictionResult = {
                topCareers: aiResponse.data.predictions.map(p => ({
                    careerName: p.career,
                    probability: p.probability,
                })),
                clusterGroup: aiResponse.data.cluster,
                skillGap: skillGaps,
                readinessScore: aiResponse.data.readiness_score,
                predictedAt: new Date(),
            };
        } catch (aiError) {
            console.error('AI service error:', aiError.message);
            // Save assessment without prediction if AI service fails
            assessment.predictionResult = {
                topCareers: [],
                clusterGroup: 'Unknown',
                skillGap: [],
                readinessScore: 0,
                predictedAt: new Date(),
            };
        }

        await assessment.save();

        res.status(200).json({
            success: true,
            message: 'Assessment submitted successfully',
            data: assessment,
        });
    } catch (error) {
        console.error('Submit assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting assessment',
            error: error.message,
        });
    }
};

// @desc    Get user's assessment
// @route   GET /api/assessments/me
// @access  Private (Student)
export const getMyAssessment = async (req, res) => {
    try {
        const userId = req.user._id;

        const assessment = await Assessment.findOne({ userId });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'No assessment found. Please complete your assessment first.',
            });
        }

        res.status(200).json({
            success: true,
            data: assessment,
        });
    } catch (error) {
        console.error('Get assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment',
            error: error.message,
        });
    }
};

// @desc    Get roadmap for a specific career
// @route   GET /api/assessments/roadmap/:careerName
// @access  Private (Student)
export const getCareerRoadmap = async (req, res) => {
    try {
        const { careerName } = req.params;
        const userId = req.user._id;

        // Get user's assessment
        const assessment = await Assessment.findOne({ userId });
        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Please complete your assessment first',
            });
        }

        // Get career details
        const career = await Career.findOne({ careerName });
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
            });
        }

        // Find skill gap for this career
        const skillGap = assessment.predictionResult.skillGap.find(
            sg => sg.career === careerName
        );

        res.status(200).json({
            success: true,
            data: {
                career: career.careerName,
                description: career.description,
                roadmap: career.roadmap,
                certifications: career.certifications,
                averageSalary: career.averageSalary,
                skillGap: skillGap ? skillGap.missingSkills : [],
            },
        });
    } catch (error) {
        console.error('Get roadmap error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching roadmap',
            error: error.message,
        });
    }
};

// @desc    Get all assessments (Admin)
// @route   GET /api/assessments
// @access  Private (Admin)
export const getAllAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find({})
            .populate('userId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: assessments.length,
            data: assessments,
        });
    } catch (error) {
        console.error('Get all assessments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessments',
            error: error.message,
        });
    }
};

// @desc    Guest career prediction (no login, no DB save)
// @route   POST /api/assessments/guest
// @access  Public
export const guestPredict = async (req, res) => {
    try {
        const assessmentData = req.body;

        // Call AI service
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, {
            technicalSkills: assessmentData.technicalSkills || [],
            softSkills: assessmentData.softSkills || [],
            interests: assessmentData.interests || {},
            gpa: assessmentData.gpa || 0,
            strongSubjects: assessmentData.strongSubjects || [],
            projectsCompleted: assessmentData.projectsCompleted || 0,
            internshipExperience: assessmentData.internshipExperience || 'none',
            preferredWorkStyle: assessmentData.preferredWorkStyle || 'flexible',
        });

        // Get career data for skill gap analysis
        const careers = await Career.find({});
        const careerMap = {};
        careers.forEach(career => {
            careerMap[career.careerName] = career.requiredSkills;
        });

        const userSkills = new Set([
            ...(assessmentData.technicalSkills || []),
            ...(assessmentData.softSkills || []),
        ]);

        const skillGap = aiResponse.data.predictions.map(prediction => {
            const requiredSkills = careerMap[prediction.career] || [];
            return {
                career: prediction.career,
                missingSkills: requiredSkills.filter(skill => !userSkills.has(skill)),
            };
        });

        res.status(200).json({
            success: true,
            data: {
                topCareers: aiResponse.data.predictions.map(p => ({
                    careerName: p.career,
                    probability: p.probability,
                })),
                clusterGroup: aiResponse.data.cluster,
                skillGap,
                readinessScore: aiResponse.data.readiness_score,
            },
        });
    } catch (error) {
        console.error('Guest predict error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error generating prediction. Please try again.',
            error: error.message,
        });
    }
};
