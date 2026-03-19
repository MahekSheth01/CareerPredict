import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Technical Skills (no enum restriction — accepts custom skills)
    technicalSkills: [{
        type: String,
    }],

    // Soft Skills
    softSkills: [{
        type: String,
        enum: [
            'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
            'Critical Thinking', 'Time Management', 'Adaptability',
            'Creativity', 'Attention to Detail', 'Presentation Skills',
        ],
    }],

    // Interests (1-5 scale)
    interests: {
        coding: { type: Number, min: 1, max: 5 },
        design: { type: Number, min: 1, max: 5 },
        analytics: { type: Number, min: 1, max: 5 },
        management: { type: Number, min: 1, max: 5 },
        research: { type: Number, min: 1, max: 5 },
    },

    // Academic Info
    gpa: {
        type: Number,
        min: 0,
        max: 10,
    },

    strongSubjects: [String],

    // Experience
    projectsCompleted: {
        type: Number,
        default: 0,
    },

    internshipExperience: {
        type: String,
        enum: ['none', '1-3 months', '3-6 months', '6+ months'],
        default: 'none',
    },

    // Work Preferences
    preferredWorkStyle: {
        type: String,
        enum: ['remote', 'office', 'hybrid', 'flexible'],
        default: 'flexible',
    },

    // Prediction Results
    predictionResult: {
        topCareers: [{
            careerName: String,
            probability: Number,
        }],
        clusterGroup: String,
        skillGap: [{
            career: String,
            missingSkills: [String],
        }],
        readinessScore: Number,
        predictedAt: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

assessmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;
