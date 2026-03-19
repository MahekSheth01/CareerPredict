import Career from '../models/Career.js';
import Assessment from '../models/Assessment.js';
import User from '../models/User.js';

// @desc    Create new career
// @route   POST /api/careers
// @access  Private (Admin)
export const createCareer = async (req, res) => {
    try {
        const career = await Career.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Career created successfully',
            data: career,
        });
    } catch (error) {
        console.error('Create career error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating career',
            error: error.message,
        });
    }
};

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
export const getAllCareers = async (req, res) => {
    try {
        const careers = await Career.find({}).sort('careerName');

        res.status(200).json({
            success: true,
            count: careers.length,
            data: careers,
        });
    } catch (error) {
        console.error('Get careers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching careers',
            error: error.message,
        });
    }
};

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public
export const getCareer = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);

        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
            });
        }

        res.status(200).json({
            success: true,
            data: career,
        });
    } catch (error) {
        console.error('Get career error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching career',
            error: error.message,
        });
    }
};

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private (Admin)
export const updateCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Career updated successfully',
            data: career,
        });
    } catch (error) {
        console.error('Update career error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating career',
            error: error.message,
        });
    }
};

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private (Admin)
export const deleteCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id);

        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Career deleted successfully',
        });
    } catch (error) {
        console.error('Delete career error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting career',
            error: error.message,
        });
    }
};

// @desc    Get analytics data
// @route   GET /api/careers/analytics/dashboard
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
    try {
        // Total users
        const totalUsers = await User.countDocuments({ role: 'student' });

        // Total assessments
        const totalAssessments = await Assessment.countDocuments({});

        // Career distribution
        const assessments = await Assessment.find({}).select('predictionResult');
        const careerDistribution = {};

        assessments.forEach(assessment => {
            if (assessment.predictionResult && assessment.predictionResult.topCareers) {
                assessment.predictionResult.topCareers.forEach((career, index) => {
                    if (index === 0) { // Count only top prediction
                        careerDistribution[career.careerName] =
                            (careerDistribution[career.careerName] || 0) + 1;
                    }
                });
            }
        });

        // Cluster distribution
        const clusterDistribution = {};
        assessments.forEach(assessment => {
            if (assessment.predictionResult && assessment.predictionResult.clusterGroup) {
                const cluster = assessment.predictionResult.clusterGroup;
                clusterDistribution[cluster] = (clusterDistribution[cluster] || 0) + 1;
            }
        });

        // Average readiness score
        let totalReadiness = 0;
        let readinessCount = 0;
        assessments.forEach(assessment => {
            if (assessment.predictionResult && assessment.predictionResult.readinessScore) {
                totalReadiness += assessment.predictionResult.readinessScore;
                readinessCount++;
            }
        });
        const averageReadiness = readinessCount > 0 ? totalReadiness / readinessCount : 0;

        // Top skills
        const skillCounts = {};
        const allAssessments = await Assessment.find({}).select('technicalSkills softSkills');
        allAssessments.forEach(assessment => {
            [...(assessment.technicalSkills || []), ...(assessment.softSkills || [])].forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });

        const topSkills = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAssessments,
                careerDistribution,
                clusterDistribution,
                averageReadiness: Math.round(averageReadiness * 100) / 100,
                topSkills,
            },
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message,
        });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/careers/users/all
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' })
            .select('-password')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

// @desc    Toggle user active status
// @route   PATCH /api/careers/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message,
        });
    }
};
