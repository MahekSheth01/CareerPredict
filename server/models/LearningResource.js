import mongoose from 'mongoose';

const learningResourceSchema = new mongoose.Schema({
    skill_name: { type: String, required: true, trim: true },
    resource_type: {
        type: String,
        enum: ['course', 'video', 'article', 'book', 'tutorial'],
        default: 'course',
    },
    platform: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, default: '#' },
    is_free: { type: Boolean, default: true },
    duration: { type: String, default: 'Self-paced' },
    createdAt: { type: Date, default: Date.now },
});

const LearningResource = mongoose.model('LearningResource', learningResourceSchema);
export default LearningResource;
