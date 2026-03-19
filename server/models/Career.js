import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
    careerName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    requiredSkills: [{
        type: String,
        required: true,
    }],
    roadmap: {
        months_0_3: [{
            title: String,
            description: String,
            resources: [String],
        }],
        months_3_6: [{
            title: String,
            description: String,
            resources: [String],
        }],
        months_6_9: [{
            title: String,
            description: String,
            resources: [String],
        }],
        months_9_12: [{
            title: String,
            description: String,
            resources: [String],
        }],
    },
    certifications: [String],
    averageSalary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD',
        },
    },
    demandLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very high'],
        default: 'medium',
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

careerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Career = mongoose.model('Career', careerSchema);

export default Career;
