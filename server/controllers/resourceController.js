import Assessment from '../models/Assessment.js';
import LearningResource from '../models/LearningResource.js';

// @desc    Get learning resource recommendations based on skill gaps
// @route   GET /api/resources/recommend
// @access  Private (Student)
export const getLearningResources = async (req, res) => {
    try {
        const userId = req.user._id;

        const assessment = await Assessment.findOne({ userId });
        if (!assessment || !assessment.predictionResult) {
            return res.status(200).json({
                success: true,
                data: { missing_skills: [], resources_by_skill: {}, total_resources: 0 },
                message: 'Please complete your career assessment to get learning recommendations.',
            });
        }

        const { skillGap, topCareers } = assessment.predictionResult;

        // Collect all missing skills across all top careers (deduplicated, normalized)
        const missingSkillsSet = new Set();
        (skillGap || []).forEach(gap => {
            (gap.missingSkills || []).forEach(skill => missingSkillsSet.add(skill.trim()));
        });

        // Also use user's own technical skills as "learning interests" when skill gap is empty
        const missingSkills = [...missingSkillsSet];
        const hasGap = missingSkills.length > 0;

        let resources = [];

        if (hasGap) {
            // Find resources for missing skills — case-insensitive
            resources = await LearningResource.find({
                skill_name: {
                    $in: missingSkills.map(s => new RegExp(`^${s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i')),
                },
            });
        }

        // Fallback 1: if skill gap returned nothing but user has skills, show resources for user's known skills
        if (resources.length === 0 && assessment.technicalSkills?.length > 0) {
            const userSkillNames = assessment.technicalSkills.map(s => s.trim());
            resources = await LearningResource.find({
                skill_name: {
                    $in: userSkillNames.map(s => new RegExp(`^${s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i')),
                },
            });
        }

        // Fallback 2: just return all resources (10 per page) so page is never empty
        if (resources.length === 0) {
            resources = await LearningResource.find({}).limit(20);
        }

        // Group resources by skill
        const grouped = {};
        resources.forEach(r => {
            const skill = r.skill_name;
            if (!grouped[skill]) grouped[skill] = [];
            grouped[skill].push({
                _id: r._id,
                title: r.title,
                platform: r.platform,
                resource_type: r.resource_type,
                link: r.link,
                is_free: r.is_free,
                duration: r.duration,
            });
        });

        res.status(200).json({
            success: true,
            data: {
                missing_skills: missingSkills,
                resources_by_skill: grouped,
                total_resources: resources.length,
                top_career: topCareers?.[0]?.careerName || '',
                has_skill_gap: hasGap,
            },
        });
    } catch (error) {
        console.error('Learning resources error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching learning resources',
            error: error.message,
        });
    }
};
