import Assessment from '../models/Assessment.js';
import Job from '../models/Job.js';

// Normalize career name to case-insensitive regex for MongoDB query
const careerRegex = (name) => new RegExp(`^${name.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');

// @desc    Get job recommendations for user
// @route   GET /api/jobs/recommend
// @access  Private (Student)
export const getJobRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        const assessment = await Assessment.findOne({ userId });
        if (!assessment || !assessment.predictionResult) {
            return res.status(200).json({
                success: true,
                data: { recommended_jobs: [], top_career: null, total: 0 },
                message: 'Please complete your career assessment to get job recommendations.',
            });
        }

        const { topCareers } = assessment.predictionResult;
        if (!topCareers || topCareers.length === 0) {
            return res.status(200).json({
                success: true,
                data: { recommended_jobs: [], top_career: null, total: 0 },
            });
        }

        // User skills set — normalized lowercase
        const userSkills = new Set([
            ...(assessment.technicalSkills || []).map(s => s.toLowerCase().trim()),
            ...(assessment.softSkills || []).map(s => s.toLowerCase().trim()),
        ]);

        // Fetch jobs for all top careers — case-insensitive match
        const careerFilters = topCareers.map(c => ({ career_category: careerRegex(c.careerName) }));
        const jobs = await Job.find({ $or: careerFilters });

        // Also fetch all jobs as fallback if nothing matched
        let jobList = jobs;
        if (jobList.length === 0) {
            jobList = await Job.find({}).limit(20);
        }

        // Score each job
        const scored = jobList.map(job => {
            const required = job.required_skills.map(s => s.toLowerCase().trim());
            const matched = required.filter(s => userSkills.has(s));
            const matchScore = required.length > 0
                ? Math.round((matched.length / required.length) * 100)
                : 0;

            return {
                _id: job._id,
                title: job.job_title,
                company: job.company_name,
                career_category: job.career_category,
                location: job.location,
                experience_level: job.experience_level,
                job_description: job.job_description,
                job_link: job.job_link,
                required_skills: job.required_skills,
                matched_skills: matched.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                match_score: matchScore,
            };
        });

        // Sort by match score descending
        scored.sort((a, b) => b.match_score - a.match_score);

        res.status(200).json({
            success: true,
            data: {
                recommended_jobs: scored,
                top_career: topCareers[0]?.careerName || null,
                total: scored.length,
            },
        });
    } catch (error) {
        console.error('Job recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job recommendations',
            error: error.message,
        });
    }
};
