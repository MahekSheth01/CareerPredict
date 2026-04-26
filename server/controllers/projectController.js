import Assessment from '../models/Assessment.js';
import Project from '../models/Project.js';

const careerRegex = (name) =>
    new RegExp(`^${name.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');

// @desc    Get project recommendations for user
// @route   GET /api/projects/recommend
// @access  Private (Student)
export const getProjectRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        const assessment = await Assessment.findOne({ userId });
        if (!assessment || !assessment.predictionResult) {
            return res.status(200).json({
                success: true,
                data: { recommended_projects: [], top_career: null, total: 0 },
                message: 'Please complete your career assessment to get project recommendations.',
            });
        }

        const { topCareers } = assessment.predictionResult;
        if (!topCareers || topCareers.length === 0) {
            return res.status(200).json({
                success: true,
                data: { recommended_projects: [], top_career: null, total: 0 },
            });
        }

        // User skills — normalized lowercase
        const userSkills = new Set(
            (assessment.technicalSkills || []).map(s => s.toLowerCase().trim())
        );

        // Fetch projects matching any of top careers — case-insensitive
        const careerFilters = topCareers.map(c => ({ career_category: careerRegex(c.careerName) }));
        let projects = await Project.find({ $or: careerFilters });

        // Fallback: return all projects if nothing matched
        if (projects.length === 0) {
            projects = await Project.find({}).limit(16);
        }

        // Score by skill overlap
        const scored = projects.map((project, idx) => {
            const required = project.required_skills.map(s => s.toLowerCase().trim());
            const matched = required.filter(s => userSkills.has(s));
            const matchScore = required.length > 0
                ? Math.round((matched.length / required.length) * 100)
                : 0;

            // Career priority: projects matching top career rank higher
            const careerPriorityIdx = topCareers.findIndex(
                c => c.careerName.toLowerCase() === project.career_category.toLowerCase()
            );
            const careerPriority = careerPriorityIdx >= 0 ? topCareers.length - careerPriorityIdx : 0;

            return {
                _id: project._id,
                title: project.project_title,
                career_category: project.career_category,
                difficulty_level: project.difficulty_level,
                required_skills: project.required_skills,
                description: project.description,
                github_example: project.github_example,
                estimated_duration: project.estimated_duration,
                matched_skills: matched.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                match_score: matchScore,
                career_priority: careerPriority,
            };
        });

        // Sort by career priority then match score
        scored.sort((a, b) => b.career_priority - a.career_priority || b.match_score - a.match_score);

        res.status(200).json({
            success: true,
            data: {
                recommended_projects: scored,
                top_career: topCareers[0]?.careerName || null,
                total: scored.length,
            },
        });
    } catch (error) {
        console.error('Project recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project recommendations',
            error: error.message,
        });
    }
};

// @desc    Get all projects (admin listing)
// @route   GET /api/projects
// @access  Private (Admin)
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching projects', error: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res) => {
    try {
        const { project_title, career_category, difficulty_level, required_skills, description, github_example, estimated_duration } = req.body;
        if (!project_title || !career_category) {
            return res.status(400).json({ success: false, message: 'Title and career category are required.' });
        }
        const project = await Project.create({
            project_title, career_category,
            difficulty_level: difficulty_level || 'Beginner',
            required_skills: required_skills || [],
            description: description || '',
            github_example: github_example || '#',
            estimated_duration: estimated_duration || '1-2 weeks',
        });
        res.status(201).json({ success: true, data: project, message: 'Project created successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        res.status(200).json({ success: true, data: project, message: 'Project updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        res.status(200).json({ success: true, message: 'Project deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
    }
};
