import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    job_title: { type: String, required: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    career_category: { type: String, required: true },
    required_skills: [{ type: String }],
    experience_level: {
        type: String,
        enum: ['Internship', 'Entry Level', 'Mid Level', 'Senior Level'],
        default: 'Entry Level',
    },
    job_description: { type: String },
    job_link: { type: String, default: '#' },
    location: { type: String, default: 'Remote' },
    createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
