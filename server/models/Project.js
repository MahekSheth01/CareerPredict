import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    project_title: { type: String, required: true, trim: true },
    career_category: { type: String, required: true },
    difficulty_level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    required_skills: [{ type: String }],
    description: { type: String },
    github_example: { type: String, default: '#' },
    estimated_duration: { type: String, default: '1-2 weeks' },
    createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
