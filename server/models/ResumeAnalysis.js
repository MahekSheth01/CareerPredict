import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    extractedSkills: [{
        type: String,
    }],
    missingSkills: [{
        type: String,
    }],
    matchScore: {
        type: Number,
        default: 0,
    },
    predictedCareer: {
        type: String,
        required: true,
    },
    suggestions: [{
        type: String,
    }],
    skillDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    fileName: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
