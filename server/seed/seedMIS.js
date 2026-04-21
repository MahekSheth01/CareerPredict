/**
 * Seed script: Generates 60 realistic student users + 120 assessments
 * for a populated Admin MIS dashboard demo.
 * Run: node server/seed/seedMIS.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Assessment from '../models/Assessment.js';

const CAREERS = [
    'Data Scientist', 'Backend Developer', 'Frontend Developer',
    'DevOps Engineer', 'UI/UX Designer', 'Business Analyst',
    'Cybersecurity Analyst', 'AI Engineer', 'Product Manager',
];

const TECH_SKILLS_POOL = [
    'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB',
    'Docker', 'Kubernetes', 'AWS', 'TensorFlow', 'PyTorch', 'Figma',
    'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Linux', 'Git',
    'REST APIs', 'GraphQL', 'Redis', 'PostgreSQL', 'Vue.js', 'Angular',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'Cybersecurity', 'Penetration Testing', 'Agile', 'Scrum', 'JIRA',
    'Excel', 'Power BI', 'Tableau', 'Hadoop', 'Spark', 'Kafka',
];

const SOFT_SKILLS = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Adaptability',
    'Creativity', 'Attention to Detail', 'Presentation Skills',
];

const SUBJECTS = [
    'Data Structures', 'Algorithms', 'Operating Systems', 'DBMS',
    'Computer Networks', 'Machine Learning', 'AI', 'Software Engineering',
    'Computer Architecture', 'Mathematics', 'Statistics', 'Economics',
];

const NAMES = [
    'Aarav Shah', 'Priya Patel', 'Rohan Mehta', 'Anjali Singh', 'Vikram Nair',
    'Kavya Reddy', 'Arjun Kumar', 'Pooja Sharma', 'Rahul Verma', 'Sneha Joshi',
    'Akash Gupta', 'Riya Agarwal', 'Dev Malhotra', 'Nisha Iyer', 'Karan Sinha',
    'Sita Pillai', 'Raj Bose', 'Amita Rao', 'Nikhil Desai', 'Trisha Ghosh',
    'Varun Mishra', 'Deepa Saxena', 'Suhail Ahmed', 'Prachi Kulkarni', 'Ashwin Chander',
    'Monika Das', 'Gaurav Kapoor', 'Simran Arora', 'Tarun Yadav', 'Pallavi Ojha',
    'Shubham Tiwari', 'Kritika Roy', 'Aman Sethi', 'Jyoti Patil', 'Harish Negi',
    'Ritu Bhatt', 'Sanket Pandey', 'Khushi Jain', 'Abhinav Chauhan', 'Meera Bajaj',
    'Yash Tripathi', 'Aditi Chopra', 'Lakshmi Rajan', 'Nitin Wadhwa', 'Divya Srivastava',
    'Chetan Bhatia', 'Mansi Luthra', 'Sameer Kaur', 'Isha Bhardwaj', 'Ankit Bansal',
    'Tanvi Soni', 'Rohit Grover', 'Sakshi Nanda', 'Mihir Trivedi', 'Neha Tomar',
    'Piyush Rastogi', 'Shruti Anand', 'Vishal Modi', 'Bhavna Thakur', 'Kunal Dubey',
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

const randomDate = (monthsBack) => {
    const now = new Date();
    const past = new Date();
    past.setMonth(past.getMonth() - monthsBack);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const generatePrediction = (career) => {
    const readinessScore = randInt(30, 98);
    const careers = [career, ...CAREERS.filter(c => c !== career).sort(() => 0.5 - Math.random()).slice(0, 3)];
    const probs = [0.65 + Math.random() * 0.3];
    let remaining = 1 - probs[0];
    for (let i = 1; i < careers.length - 1; i++) {
        const p = Math.random() * remaining * 0.6;
        probs.push(p);
        remaining -= p;
    }
    probs.push(remaining);

    const missingSkillsPool = TECH_SKILLS_POOL.filter(() => Math.random() < 0.3);
    const skillGap = CAREERS.slice(0, 3).map(c => ({
        career: c,
        missingSkills: pickN(missingSkillsPool, randInt(1, 4)),
    }));

    return {
        topCareers: careers.map((c, i) => ({ careerName: c, probability: Math.round(probs[i] * 100) / 100 })),
        clusterGroup: ['Technical', 'Analytical', 'Creative', 'Managerial'][randInt(0, 3)],
        skillGap,
        readinessScore,
        predictedAt: new Date(),
    };
};

const seedMIS = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Remove previously seeded demo users (identified by email pattern)
        await User.deleteMany({ email: { $regex: '@misDemo\\.dev$' } });
        console.log('🧹 Cleaned old demo users');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Demo@1234', salt);

        const createdUsers = [];

        for (let i = 0; i < NAMES.length; i++) {
            const name = NAMES[i];
            const email = name.toLowerCase().replace(/\s/g, '.') + '@misDemo.dev';
            const career = rand(CAREERS);
            const createdAt = randomDate(12);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'student',
                verified: Math.random() > 0.1, // 90% verified
                isActive: Math.random() > 0.08, // 92% active
                createdAt,
            });

            createdUsers.push({ user, career });
            process.stdout.write(`\r👤 Created ${i + 1}/${NAMES.length} users`);
        }

        console.log('\n');

        // Create 1-2 assessments per user
        let assessmentCount = 0;
        for (const { user, career } of createdUsers) {
            const numAssessments = Math.random() > 0.3 ? 1 : 2;
            for (let j = 0; j < numAssessments; j++) {
                const assessmentDate = new Date(user.createdAt.getTime() + randInt(1, 30) * 24 * 60 * 60 * 1000);
                await Assessment.create({
                    userId: user._id,
                    technicalSkills: pickN(TECH_SKILLS_POOL, randInt(4, 10)),
                    softSkills: pickN(SOFT_SKILLS, randInt(2, 5)),
                    interests: {
                        coding: randInt(1, 5),
                        design: randInt(1, 5),
                        analytics: randInt(1, 5),
                        management: randInt(1, 5),
                        research: randInt(1, 5),
                    },
                    gpa: Math.round((Math.random() * 4 + 6) * 10) / 10,
                    strongSubjects: pickN(SUBJECTS, randInt(2, 4)),
                    projectsCompleted: randInt(0, 8),
                    internshipExperience: rand(['none', '1-3 months', '3-6 months', '6+ months']),
                    preferredWorkStyle: rand(['remote', 'office', 'hybrid', 'flexible']),
                    predictionResult: generatePrediction(career),
                    createdAt: assessmentDate,
                    updatedAt: assessmentDate,
                });
                assessmentCount++;
            }
        }

        console.log(`✅ Created ${createdUsers.length} users and ${assessmentCount} assessments`);
        console.log('🎉 MIS demo data seeded successfully!');
        console.log('\nDemo login: any email like aarav.shah@misDemo.dev / Demo@1234');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seedMIS();
