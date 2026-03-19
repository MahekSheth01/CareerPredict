import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
    career_category: { type: String, required: true },
    difficulty_level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    question_text: { type: String, required: true },
    question_type: {
        type: String,
        enum: ['Technical', 'Behavioral', 'Situational', 'Conceptual'],
        default: 'Technical',
    },
    hint: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
