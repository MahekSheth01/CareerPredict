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

// @desc    Get all jobs (for admin listing)
// @route   GET /api/jobs
// @access  Private (Admin)
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching jobs', error: error.message });
    }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin)
export const createJob = async (req, res) => {
    try {
        const { job_title, company_name, career_category, required_skills, experience_level, job_description, job_link, location } = req.body;
        if (!job_title || !company_name || !career_category) {
            return res.status(400).json({ success: false, message: 'Title, company, and career category are required.' });
        }
        const job = await Job.create({
            job_title, company_name, career_category,
            required_skills: required_skills || [],
            experience_level: experience_level || 'Entry Level',
            job_description: job_description || '',
            job_link: job_link || '#',
            location: location || 'Remote',
        });
        res.status(201).json({ success: true, data: job, message: 'Job created successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating job', error: error.message });
    }
};

// @desc    Update an existing job
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
        res.status(200).json({ success: true, data: job, message: 'Job updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating job', error: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
        res.status(200).json({ success: true, message: 'Job deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting job', error: error.message });
    }
};
