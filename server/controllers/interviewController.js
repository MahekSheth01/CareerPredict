import Assessment from '../models/Assessment.js';
import InterviewQuestion from '../models/InterviewQuestion.js';

const careerRegex = (name) =>
    new RegExp(`^${name.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');

// @desc    Get interview questions for user's predicted career
// @route   GET /api/interview/questions
// @access  Private (Student)
export const getInterviewQuestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { difficulty, count = 10 } = req.query;

        const assessment = await Assessment.findOne({ userId });
        if (!assessment || !assessment.predictionResult) {
            return res.status(200).json({
                success: true,
                data: { career: null, questions: [], by_type: {}, total: 0 },
                message: 'Please complete your career assessment to get interview questions.',
            });
        }

        const topCareer = assessment.predictionResult.topCareers?.[0]?.careerName;

        let questions = [];

        if (topCareer) {
            // Case-insensitive career match
            const query = { career_category: careerRegex(topCareer) };
            if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
                query.difficulty_level = difficulty;
            }
            questions = await InterviewQuestion.find(query);
        }

        // Fallback: try partial word match (e.g. "Cybersecurity Analyst" matches "Cybersecurity")
        if (questions.length === 0 && topCareer) {
            const keyword = topCareer.split(' ')[0]; // e.g. "Cybersecurity"
            const query = { career_category: new RegExp(keyword, 'i') };
            if (difficulty) query.difficulty_level = difficulty;
            questions = await InterviewQuestion.find(query);
        }

        // Fallback 2: return a mix of all questions
        if (questions.length === 0) {
            questions = await InterviewQuestion.find(
                difficulty ? { difficulty_level: difficulty } : {}
            ).limit(parseInt(count) * 2);
        }

        // Shuffle for randomness
        const shuffled = questions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, parseInt(count));

        // Group by type for display
        const byType = {};
        selected.forEach(q => {
            if (!byType[q.question_type]) byType[q.question_type] = [];
            byType[q.question_type].push({
                _id: q._id,
                question: q.question_text,
                difficulty: q.difficulty_level,
                type: q.question_type,
                hint: q.hint,
            });
        });

        res.status(200).json({
            success: true,
            data: {
                career: topCareer || 'General',
                questions: selected.map(q => ({
                    _id: q._id,
                    question: q.question_text,
                    difficulty: q.difficulty_level,
                    type: q.question_type,
                    hint: q.hint,
                })),
                by_type: byType,
                total: selected.length,
            },
        });
    } catch (error) {
        console.error('Interview questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview questions',
            error: error.message,
        });
    }
};

// @desc    Get interview questions for a specific career (public)
// @route   GET /api/interview/questions/:career
// @access  Private (Student)
export const getQuestionsByCareer = async (req, res) => {
    try {
        const { career } = req.params;
        const { difficulty, count = 10 } = req.query;

        const query = { career_category: careerRegex(career) };
        if (difficulty) query.difficulty_level = difficulty;

        const questions = await InterviewQuestion.find(query);
        const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, parseInt(count));

        res.status(200).json({
            success: true,
            data: {
                career,
                questions: shuffled.map(q => ({
                    _id: q._id,
                    question: q.question_text,
                    difficulty: q.difficulty_level,
                    type: q.question_type,
                    hint: q.hint,
                })),
                total: shuffled.length,
            },
        });
    } catch (error) {
        console.error('Questions by career error:', error);
        res.status(500).json({ success: false, message: 'Error fetching questions' });
    }
};
