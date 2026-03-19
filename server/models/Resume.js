import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    template: {
        type: String,
        enum: ['modern', 'classic', 'minimal'],
        default: 'modern',
    },
    personalInfo: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        summary: { type: String, default: '' },
    },
    education: [{
        degree: { type: String, default: '' },
        institution: { type: String, default: '' },
        year: { type: String, default: '' },
        description: { type: String, default: '' },
    }],
    skills: [{
        type: String,
    }],
    projects: [{
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: { type: String, default: '' },
    }],
    experience: [{
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' },
    }],
    certifications: [{
        type: String,
    }],
    atsScore: {
        type: Number,
        default: 0,
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

resumeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
