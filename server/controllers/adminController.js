import User from '../models/User.js';
import Assessment from '../models/Assessment.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import Project from '../models/Project.js';
import LearningResource from '../models/LearningResource.js';

// @desc    Get complete system stats
// @route   GET /api/admin/system-stats
// @access  Private (Admin)
export const getSystemStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalStudents,
            totalAdmins,
            activeUsers,
            inactiveUsers,
            verifiedUsers,
            totalAssessments,
            totalResumes,
            totalJobs,
            totalProjects,
            totalResources,
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ isActive: true }),
            User.countDocuments({ isActive: false }),
            User.countDocuments({ verified: true }),
            Assessment.countDocuments({}),
            Resume.countDocuments({}),
            Job.countDocuments({}),
            Project.countDocuments({}),
            LearningResource.countDocuments({}),
        ]);

        // Users registered in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Assessments in last 30 days
        const newAssessmentsThisMonth = await Assessment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalAdmins,
                activeUsers,
                inactiveUsers,
                verifiedUsers,
                unverifiedUsers: totalUsers - verifiedUsers,
                totalAssessments,
                totalResumes,
                totalJobs,
                totalProjects,
                totalResources,
                newUsersThisMonth,
                newAssessmentsThisMonth,
                assessmentCompletionRate: totalStudents > 0
                    ? Math.round((totalAssessments / totalStudents) * 100)
                    : 0,
            },
        });
    } catch (error) {
        console.error('System stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching system stats', error: error.message });
    }
};

// @desc    Get monthly summary (last 12 months)
// @route   GET /api/admin/monthly-summary
// @access  Private (Admin)
export const getMonthlySummary = async (req, res) => {
    try {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
            const label = start.toLocaleString('default', { month: 'short', year: '2-digit' });

            const [users, assessments] = await Promise.all([
                User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                Assessment.countDocuments({ createdAt: { $gte: start, $lte: end } }),
            ]);

            months.push({ month: label, users, assessments, start: start.toISOString() });
        }

        res.status(200).json({ success: true, data: months });
    } catch (error) {
        console.error('Monthly summary error:', error);
        res.status(500).json({ success: false, message: 'Error fetching monthly summary', error: error.message });
    }
};

// @desc    Get skill gap report grouped by career
// @route   GET /api/admin/skill-gap
// @access  Private (Admin)
export const getSkillGapReport = async (req, res) => {
    try {
        const assessments = await Assessment.find({})
            .select('predictionResult')
            .lean();

        const careerSkillGap = {};

        assessments.forEach(assessment => {
            if (assessment.predictionResult?.skillGap) {
                assessment.predictionResult.skillGap.forEach(({ career, missingSkills }) => {
                    if (!careerSkillGap[career]) {
                        careerSkillGap[career] = {};
                    }
                    (missingSkills || []).forEach(skill => {
                        careerSkillGap[career][skill] = (careerSkillGap[career][skill] || 0) + 1;
                    });
                });
            }
        });

        // Format: array of { career, skills: [{skill, count}] }
        const report = Object.entries(careerSkillGap).map(([career, skillObj]) => ({
            career,
            skills: Object.entries(skillObj)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([skill, count]) => ({ skill, count })),
            totalGaps: Object.values(skillObj).reduce((s, c) => s + c, 0),
        })).sort((a, b) => b.totalGaps - a.totalGaps);

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error('Skill gap error:', error);
        res.status(500).json({ success: false, message: 'Error fetching skill gap report', error: error.message });
    }
};

// @desc    Get top careers report with probability stats
// @route   GET /api/admin/top-careers
// @access  Private (Admin)
export const getTopCareersReport = async (req, res) => {
    try {
        const assessments = await Assessment.find({ 'predictionResult.topCareers': { $exists: true } })
            .select('predictionResult userId createdAt')
            .populate('userId', 'name email')
            .lean();

        const careerStats = {};

        assessments.forEach(a => {
            (a.predictionResult?.topCareers || []).forEach((c, idx) => {
                if (!careerStats[c.careerName]) {
                    careerStats[c.careerName] = { count: 0, totalProb: 0, topPicks: 0 };
                }
                careerStats[c.careerName].count++;
                careerStats[c.careerName].totalProb += c.probability || 0;
                if (idx === 0) careerStats[c.careerName].topPicks++;
            });
        });

        const report = Object.entries(careerStats).map(([career, stats]) => ({
            career,
            totalMatches: stats.count,
            topPicks: stats.topPicks,
            avgProbability: stats.count > 0 ? Math.round((stats.totalProb / stats.count) * 100) / 100 : 0,
        })).sort((a, b) => b.topPicks - a.topPicks);

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error('Top careers error:', error);
        res.status(500).json({ success: false, message: 'Error fetching top careers', error: error.message });
    }
};

// @desc    Get resume statistics
// @route   GET /api/admin/resume-stats
// @access  Private (Admin)
export const getResumeStats = async (req, res) => {
    try {
        const resumes = await Resume.find({})
            .select('userId skills atsScore template createdAt')
            .populate('userId', 'name email')
            .sort('-createdAt')
            .lean();

        const totalResumes = resumes.length;
        const totalSkills = resumes.reduce((sum, r) => sum + (r.skills?.length || 0), 0);
        const avgSkillsPerResume = totalResumes > 0 ? Math.round((totalSkills / totalResumes) * 10) / 10 : 0;
        const avgAtsScore = totalResumes > 0
            ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / totalResumes)
            : 0;

        const templateDist = resumes.reduce((acc, r) => {
            acc[r.template || 'modern'] = (acc[r.template || 'modern'] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                totalResumes,
                avgSkillsPerResume,
                avgAtsScore,
                templateDistribution: templateDist,
                recent: resumes.slice(0, 20).map(r => ({
                    _id: r._id,
                    userName: r.userId?.name || 'Unknown',
                    userEmail: r.userId?.email || '',
                    skills: r.skills?.length || 0,
                    atsScore: r.atsScore || 0,
                    template: r.template || 'modern',
                    createdAt: r.createdAt,
                })),
            },
        });
    } catch (error) {
        console.error('Resume stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching resume stats', error: error.message });
    }
};

// @desc    Get all users with assessment counts (enriched)
// @route   GET /api/admin/users-enriched
// @access  Private (Admin)
export const getUsersEnriched = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort('-createdAt').lean();

        // Get assessment count per user
        const assessmentCounts = await Assessment.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 }, lastAssessment: { $max: '$createdAt' } } }
        ]);
        const countMap = {};
        assessmentCounts.forEach(a => { countMap[a._id.toString()] = { count: a.count, lastAssessment: a.lastAssessment }; });

        // Get top career per user
        const assessmentsWithCareer = await Assessment.find({ 'predictionResult.topCareers.0': { $exists: true } })
            .select('userId predictionResult.topCareers predictionResult.readinessScore')
            .lean();
        const careerMap = {};
        assessmentsWithCareer.forEach(a => {
            careerMap[a.userId.toString()] = {
                topCareer: a.predictionResult?.topCareers?.[0]?.careerName || 'N/A',
                readinessScore: a.predictionResult?.readinessScore || 0,
            };
        });

        const enriched = users.map(u => ({
            ...u,
            assessmentCount: countMap[u._id.toString()]?.count || 0,
            lastAssessment: countMap[u._id.toString()]?.lastAssessment || null,
            topCareer: careerMap[u._id.toString()]?.topCareer || 'No Assessment',
            readinessScore: careerMap[u._id.toString()]?.readinessScore || 0,
        }));

        res.status(200).json({ success: true, count: enriched.length, data: enriched });
    } catch (error) {
        console.error('Users enriched error:', error);
        res.status(500).json({ success: false, message: 'Error fetching enriched users', error: error.message });
    }
};
