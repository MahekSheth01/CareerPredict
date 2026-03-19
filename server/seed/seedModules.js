import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Job from '../models/Job.js';
import Project from '../models/Project.js';
import LearningResource from '../models/LearningResource.js';
import InterviewQuestion from '../models/InterviewQuestion.js';

const jobs = [
    // Data Scientist
    {
        job_title: 'Junior Data Scientist', company_name: 'DataWorks Inc', career_category: 'Data Scientist',
        required_skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Analyze large datasets and build ML models to drive business decisions.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Data%20Scientist&f_E=2'
    },
    {
        job_title: 'Data Science Intern', company_name: 'TechVision', career_category: 'Data Scientist',
        required_skills: ['Python', 'Statistics', 'SQL'], experience_level: 'Internship',
        location: 'New York, USA', job_description: 'Support data science team with EDA, model building, and reporting.',
        job_link: 'https://internshala.com/internships/data-science-internship'
    },
    {
        job_title: 'Machine Learning Engineer', company_name: 'AI Solutions Ltd', career_category: 'Data Scientist',
        required_skills: ['Python', 'TensorFlow', 'Machine Learning', 'Docker'], experience_level: 'Mid Level',
        location: 'San Francisco, USA', job_description: 'Build and deploy ML pipelines in production environments.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer&f_E=3'
    },
    {
        job_title: 'Data Analyst', company_name: 'Metrics Corp', career_category: 'Data Scientist',
        required_skills: ['Python', 'SQL', 'Tableau', 'Excel'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Transform raw data into actionable business insights using visualization tools.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst&f_WT=2&f_E=2'
    },

    // Backend Developer
    {
        job_title: 'Junior Backend Developer', company_name: 'CloudBase', career_category: 'Backend Developer',
        required_skills: ['Node.js', 'Express', 'MongoDB', 'REST API'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Build scalable RESTful APIs using Node.js and Express framework.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Backend%20Developer%20Node.js&f_E=2'
    },
    {
        job_title: 'Backend Engineering Intern', company_name: 'StartupHub', career_category: 'Backend Developer',
        required_skills: ['Node.js', 'SQL', 'Git'], experience_level: 'Internship',
        location: 'Bangalore, India', job_description: 'Assist in developing backend services for a SaaS platform.',
        job_link: 'https://internshala.com/internships/backend-development-internship'
    },
    {
        job_title: 'Python Backend Developer', company_name: 'Pycraft', career_category: 'Backend Developer',
        required_skills: ['Python', 'Django', 'PostgreSQL', 'Docker'], experience_level: 'Mid Level',
        location: 'Remote', job_description: 'Develop and maintain Python-based microservices.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Python%20Backend%20Developer%20Django&f_E=3'
    },

    // Full Stack Developer
    {
        job_title: 'Full Stack Developer', company_name: 'WebForge', career_category: 'Full Stack Developer',
        required_skills: ['React', 'Node.js', 'MongoDB', 'CSS'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Build end-to-end web applications using MERN stack.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer%20MERN&f_E=2'
    },
    {
        job_title: 'MERN Stack Intern', company_name: 'DigitalFactory', career_category: 'Full Stack Developer',
        required_skills: ['React', 'Node.js', 'HTML', 'CSS'], experience_level: 'Internship',
        location: 'Mumbai, India', job_description: 'Work on progressive web apps using MERN stack.',
        job_link: 'https://internshala.com/internships/mern-stack-internship'
    },

    // Frontend Developer
    {
        job_title: 'Frontend Developer', company_name: 'UX Masters', career_category: 'Frontend Developer',
        required_skills: ['React', 'JavaScript', 'CSS', 'Figma'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Create modern, responsive UIs using React and Tailwind CSS.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer%20React&f_WT=2&f_E=2'
    },
    {
        job_title: 'UI Developer Intern', company_name: 'PixelPerfect', career_category: 'Frontend Developer',
        required_skills: ['HTML', 'CSS', 'JavaScript'], experience_level: 'Internship',
        location: 'Delhi, India', job_description: 'Design and code pixel-perfect UI components.',
        job_link: 'https://internshala.com/internships/web-development-internship'
    },

    // DevOps Engineer
    {
        job_title: 'Junior DevOps Engineer', company_name: 'InfraScale', career_category: 'DevOps Engineer',
        required_skills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Manage CI/CD pipelines and cloud infrastructure.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20DevOps%20Engineer&f_E=2'
    },
    {
        job_title: 'Cloud Engineer', company_name: 'CloudOps', career_category: 'DevOps Engineer',
        required_skills: ['AWS', 'Terraform', 'Docker', 'Python'], experience_level: 'Mid Level',
        location: 'Hyderabad, India', job_description: 'Design and maintain AWS cloud infrastructure using IaC.',
        job_link: 'https://www.naukri.com/cloud-engineer-jobs'
    },

    // Cybersecurity Analyst (matches AI service output exactly)
    {
        job_title: 'Security Analyst', company_name: 'SecureIT', career_category: 'Cybersecurity Analyst',
        required_skills: ['Network Security', 'Linux', 'Python', 'Ethical Hacking'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Monitor and analyze security threats and incidents.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Security%20Analyst%20Cybersecurity&f_E=2'
    },
    {
        job_title: 'Cybersecurity Intern', company_name: 'SafeNet', career_category: 'Cybersecurity Analyst',
        required_skills: ['Linux', 'Networking', 'Python'], experience_level: 'Internship',
        location: 'Pune, India', job_description: 'Assist in vulnerability assessments and penetration testing.',
        job_link: 'https://internshala.com/internships/cyber-security-internship'
    },

    // UI/UX Designer
    {
        job_title: 'Junior UI/UX Designer', company_name: 'DesignStudio', career_category: 'UI/UX Designer',
        required_skills: ['Figma', 'UI/UX Design', 'Adobe XD', 'CSS'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Design intuitive user interfaces and create high-fidelity prototypes.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20UI%20UX%20Designer&f_E=2'
    },
    {
        job_title: 'UI/UX Design Intern', company_name: 'CreativeLab', career_category: 'UI/UX Designer',
        required_skills: ['Figma', 'Adobe XD', 'Creativity'], experience_level: 'Internship',
        location: 'Bangalore, India', job_description: 'Assist in wireframing, prototyping, and usability testing.',
        job_link: 'https://internshala.com/internships/ui-ux-design-internship'
    },

    // Business Analyst
    {
        job_title: 'Junior Business Analyst', company_name: 'InsightCorp', career_category: 'Business Analyst',
        required_skills: ['SQL', 'Excel', 'Tableau', 'Problem Solving'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Analyze business processes and turn data into actionable insights.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Business%20Analyst&f_E=2'
    },
    {
        job_title: 'Business Analyst Intern', company_name: 'DataDriven', career_category: 'Business Analyst',
        required_skills: ['Excel', 'SQL', 'Communication'], experience_level: 'Internship',
        location: 'Mumbai, India', job_description: 'Support senior analysts with data gathering and reporting.',
        job_link: 'https://internshala.com/internships/business-analyst-internship'
    },

    // AI Engineer
    {
        job_title: 'AI/ML Engineer', company_name: 'NeuralSoft', career_category: 'AI Engineer',
        required_skills: ['Python', 'TensorFlow', 'Machine Learning', 'PyTorch'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Design and build AI-powered applications and ML pipelines.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=AI%20ML%20Engineer&f_E=2'
    },
    {
        job_title: 'AI Research Intern', company_name: 'DeepMind Labs', career_category: 'AI Engineer',
        required_skills: ['Python', 'Machine Learning', 'Statistics'], experience_level: 'Internship',
        location: 'Remote', job_description: 'Assist in research and development of machine learning algorithms.',
        job_link: 'https://internshala.com/internships/artificial-intelligence-internship'
    },

    // Mobile Developer
    {
        job_title: 'React Native Developer', company_name: 'AppCraft', career_category: 'Mobile App Developer',
        required_skills: ['React Native', 'JavaScript', 'REST API', 'Git'], experience_level: 'Entry Level',
        location: 'Remote', job_description: 'Build cross-platform mobile apps using React Native.',
        job_link: 'https://www.linkedin.com/jobs/search/?keywords=React%20Native%20Developer&f_E=2'
    },
    {
        job_title: 'Android Developer Intern', company_name: 'MobileFirst', career_category: 'Mobile App Developer',
        required_skills: ['Kotlin', 'Android SDK', 'Java'], experience_level: 'Internship',
        location: 'Chennai, India', job_description: 'Develop Android apps and integrate REST APIs.',
        job_link: 'https://internshala.com/internships/android-app-development-internship'
    },
];


const projects = [
    // Data Scientist
    { project_title: 'House Price Prediction', career_category: 'Data Scientist', difficulty_level: 'Intermediate', required_skills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'], description: 'Predict house prices using regression models. Apply feature engineering and model evaluation techniques.', github_example: 'https://github.com/ageron/handson-ml', estimated_duration: '2-3 weeks' },
    { project_title: 'Customer Churn Analysis', career_category: 'Data Scientist', difficulty_level: 'Intermediate', required_skills: ['Python', 'SQL', 'Pandas', 'Visualization'], description: 'Analyze customer data to predict churn probability using classification models.', github_example: 'https://github.com/topics/churn-prediction', estimated_duration: '2 weeks' },
    { project_title: 'Sentiment Analysis on Twitter', career_category: 'Data Scientist', difficulty_level: 'Beginner', required_skills: ['Python', 'NLP', 'Machine Learning'], description: 'Classify tweet sentiments using NLP and train a text classification model.', github_example: 'https://github.com/topics/sentiment-analysis', estimated_duration: '1-2 weeks' },
    { project_title: 'Recommendation Engine', career_category: 'Data Scientist', difficulty_level: 'Advanced', required_skills: ['Python', 'Machine Learning', 'Collaborative Filtering'], description: 'Build a movie or product recommendation system using collaborative filtering.', github_example: 'https://github.com/topics/recommendation-system', estimated_duration: '3-4 weeks' },

    // Backend Developer
    { project_title: 'RESTful Blog API', career_category: 'Backend Developer', difficulty_level: 'Beginner', required_skills: ['Node.js', 'Express', 'MongoDB'], description: 'Build a full CRUD blog API with authentication using JWT, Express, and MongoDB.', github_example: 'https://github.com/topics/rest-api-nodejs', estimated_duration: '1-2 weeks' },
    { project_title: 'E-Commerce Backend', career_category: 'Backend Developer', difficulty_level: 'Intermediate', required_skills: ['Node.js', 'Express', 'MongoDB', 'Stripe'], description: 'Build a scalable e-commerce API with product management, cart, and payment integration.', github_example: 'https://github.com/topics/ecommerce-nodejs', estimated_duration: '3-4 weeks' },
    { project_title: 'Real-Time Chat Server', career_category: 'Backend Developer', difficulty_level: 'Intermediate', required_skills: ['Node.js', 'Socket.io', 'MongoDB'], description: 'Develop a real-time chat application backend using WebSockets and Socket.io.', github_example: 'https://github.com/topics/chat-application', estimated_duration: '2 weeks' },

    // Full Stack Developer
    { project_title: 'Task Management App', career_category: 'Full Stack Developer', difficulty_level: 'Beginner', required_skills: ['React', 'Node.js', 'MongoDB', 'CSS'], description: 'Build a full-stack Kanban board with drag-and-drop, auth, and real-time updates.', github_example: 'https://github.com/topics/task-manager', estimated_duration: '2-3 weeks' },
    { project_title: 'Social Media Platform', career_category: 'Full Stack Developer', difficulty_level: 'Advanced', required_skills: ['React', 'Node.js', 'MongoDB', 'Socket.io'], description: 'Develop a full-featured social platform with posts, likes, comments, and real-time notifications.', github_example: 'https://github.com/topics/mern-social-media', estimated_duration: '5-6 weeks' },

    // Frontend Developer
    { project_title: 'Portfolio Website', career_category: 'Frontend Developer', difficulty_level: 'Beginner', required_skills: ['React', 'CSS', 'JavaScript'], description: 'Create a personal portfolio with animations, project showcase, and contact form.', github_example: 'https://github.com/topics/portfolio-website', estimated_duration: '1 week' },
    { project_title: 'Weather Dashboard', career_category: 'Frontend Developer', difficulty_level: 'Intermediate', required_skills: ['React', 'REST API', 'CSS', 'JavaScript'], description: 'Build a weather app consuming a public API with charts and location search.', github_example: 'https://github.com/topics/weather-app', estimated_duration: '1-2 weeks' },

    // DevOps Engineer
    { project_title: 'CI/CD Pipeline with GitHub Actions', career_category: 'DevOps Engineer', difficulty_level: 'Intermediate', required_skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Linux'], description: 'Set up a complete CI/CD pipeline to auto-build, test, and deploy a Node.js app.', github_example: 'https://github.com/topics/github-actions', estimated_duration: '1-2 weeks' },
    { project_title: 'Kubernetes Cluster Setup', career_category: 'DevOps Engineer', difficulty_level: 'Advanced', required_skills: ['Kubernetes', 'Docker', 'Linux', 'Helm'], description: 'Deploy a multi-service application on a local Kubernetes cluster with monitoring.', github_example: 'https://github.com/topics/kubernetes', estimated_duration: '3-4 weeks' },

    // Cybersecurity Analyst (fixed name)
    { project_title: 'Network Vulnerability Scanner', career_category: 'Cybersecurity Analyst', difficulty_level: 'Intermediate', required_skills: ['Python', 'Networking', 'Linux'], description: 'Build a tool to scan open ports and detect common vulnerabilities in a network.', github_example: 'https://github.com/topics/network-scanner', estimated_duration: '2-3 weeks' },
    { project_title: 'Password Strength Checker', career_category: 'Cybersecurity Analyst', difficulty_level: 'Beginner', required_skills: ['Python', 'Ethical Hacking', 'Network Security'], description: 'Create a tool that evaluates password strength and checks against common wordlists.', github_example: 'https://github.com/topics/password-security', estimated_duration: '1 week' },

    // Mobile Developer
    { project_title: 'Expense Tracker App', career_category: 'Mobile App Developer', difficulty_level: 'Beginner', required_skills: ['React Native', 'JavaScript', 'AsyncStorage'], description: 'Build a cross-platform mobile expense tracking app with local storage.', github_example: 'https://github.com/topics/expense-tracker', estimated_duration: '2 weeks' },
    { project_title: 'Food Delivery App UI', career_category: 'Mobile App Developer', difficulty_level: 'Intermediate', required_skills: ['React Native', 'REST API', 'Figma'], description: 'Develop a feature-rich food delivery app with maps integration and order tracking.', github_example: 'https://github.com/topics/food-app', estimated_duration: '3-4 weeks' },

    // UI/UX Designer
    { project_title: 'E-Commerce App Redesign', career_category: 'UI/UX Designer', difficulty_level: 'Intermediate', required_skills: ['Figma', 'UI/UX Design', 'Adobe XD'], description: 'Redesign an existing e-commerce app with improved UX flows, wireframes and high-fidelity prototypes.', github_example: 'https://www.behance.net/search/projects/ux+design', estimated_duration: '2-3 weeks' },
    { project_title: 'Mobile App Design System', career_category: 'UI/UX Designer', difficulty_level: 'Advanced', required_skills: ['Figma', 'UI/UX Design', 'Creativity'], description: 'Build a complete design system with reusable components, style guide and documentation.', github_example: 'https://www.figma.com/community/file/1142750421700835972', estimated_duration: '3-4 weeks' },

    // Business Analyst
    { project_title: 'Sales Dashboard in Tableau', career_category: 'Business Analyst', difficulty_level: 'Beginner', required_skills: ['Tableau', 'SQL', 'Excel'], description: 'Build an interactive sales dashboard using Tableau with filters, KPIs and trend analysis.', github_example: 'https://public.tableau.com/app/discover', estimated_duration: '1-2 weeks' },
    { project_title: 'Market Basket Analysis', career_category: 'Business Analyst', difficulty_level: 'Intermediate', required_skills: ['Python', 'SQL', 'Machine Learning'], description: 'Use association rule mining to find product purchase patterns in retail transaction data.', github_example: 'https://github.com/topics/market-basket-analysis', estimated_duration: '2 weeks' },

    // AI Engineer
    { project_title: 'Object Detection App', career_category: 'AI Engineer', difficulty_level: 'Intermediate', required_skills: ['Python', 'TensorFlow', 'Machine Learning'], description: 'Build a real-time object detection application using YOLO or Faster R-CNN.', github_example: 'https://github.com/topics/object-detection', estimated_duration: '3-4 weeks' },
    { project_title: 'Chatbot with NLP', career_category: 'AI Engineer', difficulty_level: 'Advanced', required_skills: ['Python', 'NLP', 'Machine Learning', 'TensorFlow'], description: 'Develop an intent-based chatbot using NLP techniques and train it on a custom dataset.', github_example: 'https://github.com/topics/chatbot', estimated_duration: '4-5 weeks' },
];

const learningResources = [
    // ─── Python ──────────────────────────────────────────────────────
    { skill_name: 'Python', resource_type: 'video', platform: 'freeCodeCamp', title: 'Python for Beginners – Full Course', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', is_free: true, duration: '4 hours' },
    { skill_name: 'Python', resource_type: 'course', platform: 'Coursera', title: 'Python for Everybody Specialization', link: 'https://www.coursera.org/specializations/python', is_free: false, duration: '3 months' },
    { skill_name: 'Python', resource_type: 'tutorial', platform: 'W3Schools', title: 'Python Tutorial', link: 'https://www.w3schools.com/python/', is_free: true, duration: 'Self-paced' },

    // ─── Machine Learning ─────────────────────────────────────────────
    { skill_name: 'Machine Learning', resource_type: 'course', platform: 'Coursera', title: 'Machine Learning Specialization – Andrew Ng', link: 'https://www.coursera.org/specializations/machine-learning-introduction', is_free: false, duration: '2 months' },
    { skill_name: 'Machine Learning', resource_type: 'video', platform: 'YouTube', title: 'Machine Learning Full Course – Simplilearn', link: 'https://www.youtube.com/watch?v=9f-GarcDY58', is_free: true, duration: '10 hours' },
    { skill_name: 'Machine Learning', resource_type: 'tutorial', platform: 'Kaggle', title: 'Intro to Machine Learning', link: 'https://www.kaggle.com/learn/intro-to-machine-learning', is_free: true, duration: '3 hours' },

    // ─── SQL ──────────────────────────────────────────────────────────
    { skill_name: 'SQL', resource_type: 'tutorial', platform: 'SQLZoo', title: 'SQL Tutorial (Interactive)', link: 'https://sqlzoo.net/wiki/SQL_Tutorial', is_free: true, duration: 'Self-paced' },
    { skill_name: 'SQL', resource_type: 'course', platform: 'Kaggle', title: 'Intro to SQL', link: 'https://www.kaggle.com/learn/intro-to-sql', is_free: true, duration: '3 hours' },
    { skill_name: 'SQL', resource_type: 'video', platform: 'freeCodeCamp', title: 'SQL Tutorial – Full Database Course', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', is_free: true, duration: '4 hours' },

    // ─── React ────────────────────────────────────────────────────────
    { skill_name: 'React', resource_type: 'video', platform: 'freeCodeCamp', title: 'React Course for Beginners', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8', is_free: true, duration: '8 hours' },
    { skill_name: 'React', resource_type: 'article', platform: 'React Docs', title: 'Official React Documentation', link: 'https://react.dev/learn', is_free: true, duration: 'Self-paced' },
    { skill_name: 'React', resource_type: 'course', platform: 'Scrimba', title: 'Learn React for Free', link: 'https://scrimba.com/learn-react-c0e', is_free: true, duration: '11 hours' },

    // ─── JavaScript ───────────────────────────────────────────────────
    { skill_name: 'JavaScript', resource_type: 'tutorial', platform: 'MDN Web Docs', title: 'JavaScript Guide', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', is_free: true, duration: 'Self-paced' },
    { skill_name: 'JavaScript', resource_type: 'video', platform: 'freeCodeCamp', title: 'JavaScript Full Course for Beginners', link: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', is_free: true, duration: '3.5 hours' },
    { skill_name: 'JavaScript', resource_type: 'course', platform: 'The Odin Project', title: 'JavaScript Path', link: 'https://www.theodinproject.com/paths/full-stack-javascript', is_free: true, duration: 'Self-paced' },

    // ─── HTML ─────────────────────────────────────────────────────────
    { skill_name: 'HTML', resource_type: 'tutorial', platform: 'W3Schools', title: 'HTML Tutorial', link: 'https://www.w3schools.com/html/', is_free: true, duration: 'Self-paced' },
    { skill_name: 'HTML', resource_type: 'video', platform: 'freeCodeCamp', title: 'HTML Full Course – Build a Website', link: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', is_free: true, duration: '2 hours' },

    // ─── CSS ──────────────────────────────────────────────────────────
    { skill_name: 'CSS', resource_type: 'tutorial', platform: 'W3Schools', title: 'CSS Tutorial', link: 'https://www.w3schools.com/css/', is_free: true, duration: 'Self-paced' },
    { skill_name: 'CSS', resource_type: 'video', platform: 'freeCodeCamp', title: 'CSS Tutorial – Zero to Hero', link: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', is_free: true, duration: '6 hours' },
    { skill_name: 'CSS', resource_type: 'tutorial', platform: 'Flexbox Froggy', title: 'Flexbox Froggy – Learn Flexbox', link: 'https://flexboxfroggy.com', is_free: true, duration: '1 hour' },

    // ─── Node.js ──────────────────────────────────────────────────────
    { skill_name: 'Node.js', resource_type: 'video', platform: 'freeCodeCamp', title: 'Node.js and Express.js Full Course', link: 'https://www.youtube.com/watch?v=Oe421EPjeBE', is_free: true, duration: '8 hours' },
    { skill_name: 'Node.js', resource_type: 'article', platform: 'Node.js Docs', title: 'Official Node.js Getting Started Guide', link: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', is_free: true, duration: 'Self-paced' },

    // ─── Express ──────────────────────────────────────────────────────
    { skill_name: 'Express', resource_type: 'article', platform: 'Express Docs', title: 'Express.js Official Guide', link: 'https://expressjs.com/en/guide/routing.html', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Express', resource_type: 'video', platform: 'Traversy Media', title: 'Express JS Crash Course', link: 'https://www.youtube.com/watch?v=L72fhGm1tfE', is_free: true, duration: '1.5 hours' },

    // ─── MongoDB ──────────────────────────────────────────────────────
    { skill_name: 'MongoDB', resource_type: 'course', platform: 'MongoDB University', title: 'MongoDB for Node.js Developers', link: 'https://learn.mongodb.com/learning-paths/mongodb-nodejs-developer-path', is_free: true, duration: 'Self-paced' },
    { skill_name: 'MongoDB', resource_type: 'video', platform: 'freeCodeCamp', title: 'MongoDB Crash Course', link: 'https://www.youtube.com/watch?v=ofme2o29ngU', is_free: true, duration: '2 hours' },

    // ─── REST API ─────────────────────────────────────────────────────
    { skill_name: 'REST API', resource_type: 'video', platform: 'freeCodeCamp', title: 'REST API Design – Best Practices', link: 'https://www.youtube.com/watch?v=-MTSQjw5DrM', is_free: true, duration: '3 hours' },
    { skill_name: 'REST API', resource_type: 'article', platform: 'REST API Tutorial', title: 'RESTful Web Services Tutorial', link: 'https://restfulapi.net', is_free: true, duration: 'Self-paced' },

    // ─── Git ──────────────────────────────────────────────────────────
    { skill_name: 'Git', resource_type: 'video', platform: 'freeCodeCamp', title: 'Git and GitHub for Beginners – Crash Course', link: 'https://www.youtube.com/watch?v=RGOj5yH7evk', is_free: true, duration: '1 hour' },
    { skill_name: 'Git', resource_type: 'tutorial', platform: 'Atlassian', title: 'Learn Git with Bitbucket Cloud', link: 'https://www.atlassian.com/git/tutorials', is_free: true, duration: 'Self-paced' },

    // ─── Docker ───────────────────────────────────────────────────────
    { skill_name: 'Docker', resource_type: 'video', platform: 'YouTube', title: 'Docker Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=3c-iBn73dDE', is_free: true, duration: '3 hours' },
    { skill_name: 'Docker', resource_type: 'article', platform: 'Docker Docs', title: 'Docker Getting Started Guide', link: 'https://docs.docker.com/get-started/', is_free: true, duration: 'Self-paced' },

    // ─── Kubernetes ───────────────────────────────────────────────────
    { skill_name: 'Kubernetes', resource_type: 'video', platform: 'YouTube', title: 'Kubernetes Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=X48VuDVv0do', is_free: true, duration: '4 hours' },
    { skill_name: 'Kubernetes', resource_type: 'article', platform: 'Kubernetes Docs', title: 'Kubernetes Official Documentation', link: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', is_free: true, duration: 'Self-paced' },

    // ─── Linux ────────────────────────────────────────────────────────
    { skill_name: 'Linux', resource_type: 'course', platform: 'edX', title: 'Introduction to Linux (LFS101)', link: 'https://www.edx.org/learn/linux/the-linux-foundation-introduction-to-linux', is_free: true, duration: '14 weeks' },
    { skill_name: 'Linux', resource_type: 'video', platform: 'freeCodeCamp', title: 'Linux Command Line Full Course', link: 'https://www.youtube.com/watch?v=iwolPf6kN-k', is_free: true, duration: '5 hours' },

    // ─── CI/CD ────────────────────────────────────────────────────────
    { skill_name: 'CI/CD', resource_type: 'video', platform: 'GitHub', title: 'GitHub Actions Tutorial', link: 'https://www.youtube.com/watch?v=R8_veQiYBjI', is_free: true, duration: '2 hours' },
    { skill_name: 'CI/CD', resource_type: 'article', platform: 'Atlassian', title: 'CI/CD Pipeline Explained', link: 'https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment', is_free: true, duration: 'Self-paced' },

    // ─── GitHub Actions ───────────────────────────────────────────────
    { skill_name: 'GitHub Actions', resource_type: 'article', platform: 'GitHub Docs', title: 'GitHub Actions Official Documentation', link: 'https://docs.github.com/en/actions', is_free: true, duration: 'Self-paced' },
    { skill_name: 'GitHub Actions', resource_type: 'video', platform: 'YouTube', title: 'GitHub Actions CI/CD Tutorial', link: 'https://www.youtube.com/watch?v=mFFXuXjVgkU', is_free: true, duration: '1.5 hours' },

    // ─── AWS ──────────────────────────────────────────────────────────
    { skill_name: 'AWS', resource_type: 'course', platform: 'AWS Training', title: 'AWS Cloud Practitioner Essentials', link: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', is_free: true, duration: '6 hours' },
    { skill_name: 'AWS', resource_type: 'video', platform: 'freeCodeCamp', title: 'AWS Certified Cloud Practitioner – Full Course', link: 'https://www.youtube.com/watch?v=SOTamWNgDKc', is_free: true, duration: '13 hours' },

    // ─── Terraform ────────────────────────────────────────────────────
    { skill_name: 'Terraform', resource_type: 'article', platform: 'HashiCorp', title: 'Terraform Getting Started', link: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Terraform', resource_type: 'video', platform: 'freeCodeCamp', title: 'Terraform Course for Beginners', link: 'https://www.youtube.com/watch?v=SLB_c_ayRMo', is_free: true, duration: '2.5 hours' },

    // ─── Helm ─────────────────────────────────────────────────────────
    { skill_name: 'Helm', resource_type: 'article', platform: 'Helm Docs', title: 'Helm – The Package Manager for Kubernetes', link: 'https://helm.sh/docs/intro/quickstart/', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Helm', resource_type: 'video', platform: 'YouTube', title: 'Helm Crash Course – Kubernetes', link: 'https://www.youtube.com/watch?v=-ykwb1d0DXU', is_free: true, duration: '1 hour' },

    // ─── TensorFlow ───────────────────────────────────────────────────
    { skill_name: 'TensorFlow', resource_type: 'article', platform: 'TensorFlow.org', title: 'TensorFlow Official Tutorials', link: 'https://www.tensorflow.org/tutorials', is_free: true, duration: 'Self-paced' },
    { skill_name: 'TensorFlow', resource_type: 'course', platform: 'Coursera', title: 'DeepLearning.AI TensorFlow Developer', link: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice', is_free: false, duration: '3 months' },

    // ─── Scikit-learn ─────────────────────────────────────────────────
    { skill_name: 'Scikit-learn', resource_type: 'article', platform: 'Scikit-learn Docs', title: 'Scikit-learn User Guide', link: 'https://scikit-learn.org/stable/user_guide.html', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Scikit-learn', resource_type: 'tutorial', platform: 'Kaggle', title: 'Intermediate Machine Learning (Kaggle)', link: 'https://www.kaggle.com/learn/intermediate-machine-learning', is_free: true, duration: '4 hours' },

    // ─── Pandas ───────────────────────────────────────────────────────
    { skill_name: 'Pandas', resource_type: 'tutorial', platform: 'Kaggle', title: 'Pandas Tutorial', link: 'https://www.kaggle.com/learn/pandas', is_free: true, duration: '4 hours' },
    { skill_name: 'Pandas', resource_type: 'video', platform: 'freeCodeCamp', title: 'Pandas & Python for Data Analysis', link: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', is_free: true, duration: '4 hours' },

    // ─── Statistics ───────────────────────────────────────────────────
    { skill_name: 'Statistics', resource_type: 'course', platform: 'Khan Academy', title: 'Statistics and Probability', link: 'https://www.khanacademy.org/math/statistics-probability', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Statistics', resource_type: 'video', platform: 'YouTube', title: 'Statistics – A Full University Course', link: 'https://www.youtube.com/watch?v=xxpc-HPKN28', is_free: true, duration: '8 hours' },

    // ─── Visualization ────────────────────────────────────────────────
    { skill_name: 'Visualization', resource_type: 'tutorial', platform: 'Kaggle', title: 'Data Visualization (Kaggle)', link: 'https://www.kaggle.com/learn/data-visualization', is_free: true, duration: '4 hours' },
    { skill_name: 'Visualization', resource_type: 'video', platform: 'YouTube', title: 'Data Visualization with Python – Matplotlib & Seaborn', link: 'https://www.youtube.com/watch?v=a9UrKTVEeZA', is_free: true, duration: '3 hours' },

    // ─── NLP ──────────────────────────────────────────────────────────
    { skill_name: 'NLP', resource_type: 'course', platform: 'Hugging Face', title: 'NLP Course by Hugging Face', link: 'https://huggingface.co/learn/nlp-course/chapter1/1', is_free: true, duration: 'Self-paced' },
    { skill_name: 'NLP', resource_type: 'video', platform: 'freeCodeCamp', title: 'Natural Language Processing – Full Course', link: 'https://www.youtube.com/watch?v=X2vAabgKiuM', is_free: true, duration: '3 hours' },

    // ─── Django ───────────────────────────────────────────────────────
    { skill_name: 'Django', resource_type: 'article', platform: 'Django Docs', title: 'Django Official Tutorial', link: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Django', resource_type: 'video', platform: 'freeCodeCamp', title: 'Django Web Framework – Full Course', link: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', is_free: true, duration: '3.5 hours' },

    // ─── PostgreSQL ───────────────────────────────────────────────────
    { skill_name: 'PostgreSQL', resource_type: 'video', platform: 'freeCodeCamp', title: 'PostgreSQL Tutorial – Full Course', link: 'https://www.youtube.com/watch?v=SpfIwlAYaKk', is_free: true, duration: '4 hours' },
    { skill_name: 'PostgreSQL', resource_type: 'article', platform: 'PostgreSQL Docs', title: 'PostgreSQL Official Tutorial', link: 'https://www.postgresql.org/docs/current/tutorial.html', is_free: true, duration: 'Self-paced' },

    // ─── Socket.io ────────────────────────────────────────────────────
    { skill_name: 'Socket.io', resource_type: 'article', platform: 'Socket.io Docs', title: 'Socket.io Official Get Started Guide', link: 'https://socket.io/docs/v4/tutorial/introduction', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Socket.io', resource_type: 'video', platform: 'YouTube', title: 'Socket.io Crash Course', link: 'https://www.youtube.com/watch?v=ZKEqqIO7n-k', is_free: true, duration: '1.5 hours' },

    // ─── Figma ────────────────────────────────────────────────────────
    { skill_name: 'Figma', resource_type: 'video', platform: 'Figma', title: 'Figma Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', is_free: true, duration: '2 hours' },
    { skill_name: 'Figma', resource_type: 'course', platform: 'Figma Docs', title: 'Figma Official Learning Resources', link: 'https://help.figma.com/hc/en-us/categories/360002042553', is_free: true, duration: 'Self-paced' },

    // ─── Network Security ─────────────────────────────────────────────
    { skill_name: 'Network Security', resource_type: 'course', platform: 'Cybrary', title: 'Introduction to IT and Cybersecurity', link: 'https://www.cybrary.it/course/introduction-to-it-and-cybersecurity', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Network Security', resource_type: 'video', platform: 'freeCodeCamp', title: 'Networking for Beginners – Full Course', link: 'https://www.youtube.com/watch?v=qiQR5rTSshw', is_free: true, duration: '9 hours' },

    // ─── Ethical Hacking ──────────────────────────────────────────────
    { skill_name: 'Ethical Hacking', resource_type: 'video', platform: 'freeCodeCamp', title: 'Ethical Hacking – Full Course', link: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', is_free: true, duration: '15 hours' },
    { skill_name: 'Ethical Hacking', resource_type: 'course', platform: 'TCM Security', title: 'Practical Ethical Hacking', link: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course', is_free: false, duration: '25 hours' },

    // ─── Networking ───────────────────────────────────────────────────
    { skill_name: 'Networking', resource_type: 'video', platform: 'freeCodeCamp', title: 'Computer Networking Full Course', link: 'https://www.youtube.com/watch?v=IPvYjXCsTg8', is_free: true, duration: '9 hours' },
    { skill_name: 'Networking', resource_type: 'course', platform: 'Cisco', title: 'Cisco Networking Basics Specialization', link: 'https://www.coursera.org/specializations/networking-basics', is_free: false, duration: '3 months' },

    // ─── React Native ─────────────────────────────────────────────────
    { skill_name: 'React Native', resource_type: 'article', platform: 'React Native Docs', title: 'React Native Getting Started', link: 'https://reactnative.dev/docs/getting-started', is_free: true, duration: 'Self-paced' },
    { skill_name: 'React Native', resource_type: 'video', platform: 'freeCodeCamp', title: 'React Native Course for Beginners', link: 'https://www.youtube.com/watch?v=obH0Po_RdWk', is_free: true, duration: '5 hours' },

    // ─── Kotlin ───────────────────────────────────────────────────────
    { skill_name: 'Kotlin', resource_type: 'article', platform: 'JetBrains', title: 'Kotlin Official Tutorial', link: 'https://kotlinlang.org/docs/getting-started.html', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Kotlin', resource_type: 'video', platform: 'freeCodeCamp', title: 'Kotlin for Beginners – Full Course', link: 'https://www.youtube.com/watch?v=EExSSotojVI', is_free: true, duration: '2.5 hours' },

    // ─── Java ─────────────────────────────────────────────────────────
    { skill_name: 'Java', resource_type: 'video', platform: 'freeCodeCamp', title: 'Java Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=eIrMbAQSU34', is_free: true, duration: '2.5 hours' },
    { skill_name: 'Java', resource_type: 'course', platform: 'Codecademy', title: 'Learn Java', link: 'https://www.codecademy.com/learn/learn-java', is_free: false, duration: '25 hours' },

    // ─── Android SDK ──────────────────────────────────────────────────
    { skill_name: 'Android SDK', resource_type: 'article', platform: 'Android Developers', title: 'Android Developer Getting Started', link: 'https://developer.android.com/get-started/overview', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Android SDK', resource_type: 'video', platform: 'freeCodeCamp', title: 'Android Development for Beginners', link: 'https://www.youtube.com/watch?v=fis26HvvDII', is_free: true, duration: '3.5 hours' },

    // ─── Collaborative Filtering ──────────────────────────────────────
    { skill_name: 'Collaborative Filtering', resource_type: 'article', platform: 'Towards Data Science', title: 'Collaborative Filtering Recommendation Systems', link: 'https://towardsdatascience.com/recommendation-systems-models-and-evaluation-84944a84fb8e', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Collaborative Filtering', resource_type: 'tutorial', platform: 'Kaggle', title: 'Recommendation Systems in Python', link: 'https://www.kaggle.com/code/ibtesama/getting-started-with-a-movie-recommendation-system', is_free: true, duration: 'Self-paced' },

    // ─── Tableau ──────────────────────────────────────────────────────
    { skill_name: 'Tableau', resource_type: 'video', platform: 'YouTube', title: 'Tableau Full Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=TPMlZxRRaBQ', is_free: true, duration: '4 hours' },
    { skill_name: 'Tableau', resource_type: 'course', platform: 'Tableau', title: 'Tableau Online Training', link: 'https://www.tableau.com/learn/training', is_free: true, duration: 'Self-paced' },

    // ─── Excel ────────────────────────────────────────────────────────
    { skill_name: 'Excel', resource_type: 'video', platform: 'freeCodeCamp', title: 'Microsoft Excel Tutorial – Beginners', link: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', is_free: true, duration: '3 hours' },
    { skill_name: 'Excel', resource_type: 'course', platform: 'Coursera', title: 'Excel Skills for Business Specialization', link: 'https://www.coursera.org/specializations/excel', is_free: false, duration: '4 months' },

    // ─── Stripe / Payments ────────────────────────────────────────────
    { skill_name: 'Stripe', resource_type: 'article', platform: 'Stripe Docs', title: 'Stripe Developer Documentation', link: 'https://stripe.com/docs/development/quickstart', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Stripe', resource_type: 'video', platform: 'YouTube', title: 'Stripe Integration Tutorial', link: 'https://www.youtube.com/watch?v=1XKRxeo9414', is_free: true, duration: '1 hour' },

    // ─── Adobe XD ─────────────────────────────────────────────────────
    { skill_name: 'Adobe XD', resource_type: 'video', platform: 'YouTube', title: 'Adobe XD Tutorial for Beginners', link: 'https://www.youtube.com/watch?v=3aOU9MbITlM', is_free: true, duration: '2 hours' },
    { skill_name: 'Adobe XD', resource_type: 'article', platform: 'Adobe Help', title: 'Adobe XD Official Get Started Guide', link: 'https://helpx.adobe.com/xd/get-started.html', is_free: true, duration: 'Self-paced' },

    // ─── User Research ────────────────────────────────────────────────
    { skill_name: 'User Research', resource_type: 'course', platform: 'Coursera', title: 'UX Research at Scale – Surveys, Analytics, Online Testing', link: 'https://www.coursera.org/learn/ux-research-at-scale', is_free: false, duration: '4 weeks' },
    { skill_name: 'User Research', resource_type: 'video', platform: 'YouTube', title: 'User Research for Beginners – UX Design', link: 'https://www.youtube.com/watch?v=cKvRfWBvUE4', is_free: true, duration: '30 min' },
    { skill_name: 'User Research', resource_type: 'article', platform: 'Nielsen Norman Group', title: 'User Research Methods – When to Use Which', link: 'https://www.nngroup.com/articles/which-ux-research-methods/', is_free: true, duration: 'Self-paced' },

    // ─── Prototyping ──────────────────────────────────────────────────
    { skill_name: 'Prototyping', resource_type: 'video', platform: 'YouTube', title: 'Prototyping in Figma – Full Walkthrough', link: 'https://www.youtube.com/watch?v=lTIeZ2ahEkQ', is_free: true, duration: '1 hour' },
    { skill_name: 'Prototyping', resource_type: 'article', platform: 'Interaction Design Foundation', title: 'Prototyping – Learn Design Thinking', link: 'https://www.interaction-design.org/literature/topics/prototyping', is_free: true, duration: 'Self-paced' },

    // ─── Empathy (Design Thinking) ────────────────────────────────────
    { skill_name: 'Empathy', resource_type: 'course', platform: 'Coursera', title: 'Design Thinking for Innovation – Empathize Stage', link: 'https://www.coursera.org/learn/uva-darden-design-thinking-innovation', is_free: false, duration: '4 weeks' },
    { skill_name: 'Empathy', resource_type: 'video', platform: 'YouTube', title: 'Empathy in UX Design – Why It Matters', link: 'https://www.youtube.com/watch?v=ldYzbV0NDp8', is_free: true, duration: '15 min' },

    // ─── HTML/CSS (combined) ──────────────────────────────────────────
    { skill_name: 'HTML/CSS', resource_type: 'course', platform: 'freeCodeCamp', title: 'Responsive Web Design – HTML & CSS', link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', is_free: true, duration: '300 hours' },
    { skill_name: 'HTML/CSS', resource_type: 'video', platform: 'YouTube', title: 'HTML & CSS Full Course for Beginners', link: 'https://www.youtube.com/watch?v=mU6anWqZJcc', is_free: true, duration: '6 hours' },

    // ─── Product Strategy ─────────────────────────────────────────────
    { skill_name: 'Product Strategy', resource_type: 'course', platform: 'Coursera', title: 'Digital Product Management – Modern Fundamentals', link: 'https://www.coursera.org/learn/uva-darden-digital-product-management', is_free: false, duration: '4 weeks' },
    { skill_name: 'Product Strategy', resource_type: 'video', platform: 'YouTube', title: 'Product Strategy 101 – For PMs', link: 'https://www.youtube.com/watch?v=ebwHSCOHFVI', is_free: true, duration: '45 min' },
    { skill_name: 'Product Strategy', resource_type: 'article', platform: 'Product School', title: 'Product Strategy – The Complete Guide', link: 'https://productschool.com/blog/product-management-2/product-strategy/', is_free: true, duration: 'Self-paced' },

    // ─── Data Analysis ────────────────────────────────────────────────
    { skill_name: 'Data Analysis', resource_type: 'course', platform: 'Kaggle', title: 'Data Analysis with Python', link: 'https://www.kaggle.com/learn/data-analysis', is_free: true, duration: 'Self-paced' },
    { skill_name: 'Data Analysis', resource_type: 'video', platform: 'freeCodeCamp', title: 'Data Analysis with Python – Full Course', link: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', is_free: true, duration: '4 hours' },
    { skill_name: 'Data Analysis', resource_type: 'course', platform: 'Coursera', title: 'Google Data Analytics Professional Certificate', link: 'https://www.coursera.org/professional-certificates/google-data-analytics', is_free: false, duration: '6 months' },

    // ─── Project Management ───────────────────────────────────────────
    { skill_name: 'Project Management', resource_type: 'course', platform: 'Coursera', title: 'Google Project Management Professional Certificate', link: 'https://www.coursera.org/professional-certificates/google-project-management', is_free: false, duration: '6 months' },
    { skill_name: 'Project Management', resource_type: 'video', platform: 'YouTube', title: 'Project Management Fundamentals – Full Course', link: 'https://www.youtube.com/watch?v=GC7pN8Mjot8', is_free: true, duration: '3 hours' },
    { skill_name: 'Project Management', resource_type: 'tutorial', platform: 'PMI', title: 'Project Management Institute – Resources', link: 'https://www.pmi.org/learning/library', is_free: true, duration: 'Self-paced' },

    // ─── Stakeholder Management ───────────────────────────────────────
    { skill_name: 'Stakeholder Management', resource_type: 'video', platform: 'YouTube', title: 'Stakeholder Management for Project Managers', link: 'https://www.youtube.com/watch?v=VJKqvvGMVRQ', is_free: true, duration: '30 min' },
    { skill_name: 'Stakeholder Management', resource_type: 'article', platform: 'Atlassian', title: 'Stakeholder Management – Best Practices', link: 'https://www.atlassian.com/work-management/project-management/stakeholder-management', is_free: true, duration: 'Self-paced' },
];


const interviewQuestions = [
    // Data Scientist
    { career_category: 'Data Scientist', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the difference between supervised and unsupervised learning?', hint: 'Think about labeled vs unlabeled data.' },
    { career_category: 'Data Scientist', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'Explain what overfitting is and how to prevent it.', hint: 'Regularization, cross-validation, early stopping.' },
    { career_category: 'Data Scientist', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How would you handle a highly imbalanced dataset?', hint: 'SMOTE, class weights, undersampling, oversampling.' },
    { career_category: 'Data Scientist', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is the bias-variance tradeoff?', hint: 'High bias = underfitting, high variance = overfitting.' },
    { career_category: 'Data Scientist', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'Explain the difference between bagging and boosting.', hint: 'Bagging reduces variance, boosting reduces bias.' },
    { career_category: 'Data Scientist', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'How does a Random Forest algorithm work, and what are its advantages?', hint: 'Ensemble of decision trees with feature sampling.' },
    { career_category: 'Data Scientist', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'Describe the Gradient Boosting algorithm and its key hyperparameters.', hint: 'Sequential ensemble, learning rate, n_estimators, max_depth.' },
    { career_category: 'Data Scientist', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Describe a data science project you have worked on from start to finish.', hint: 'Structure: problem, data, approach, results, learnings.' },
    { career_category: 'Data Scientist', difficulty_level: 'Medium', question_type: 'Situational', question_text: 'You find that your model has 99% accuracy. How would you determine if this is actually good performance?', hint: 'Check for class imbalance, look at precision/recall, confusion matrix.' },
    { career_category: 'Data Scientist', difficulty_level: 'Easy', question_type: 'Technical', question_text: 'What is cross-validation and why is it important?', hint: 'K-fold CV helps estimate model generalization.' },

    // Backend Developer
    { career_category: 'Backend Developer', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'Explain REST API architecture and its key principles.', hint: 'Stateless, client-server, cacheable, uniform interface.' },
    { career_category: 'Backend Developer', difficulty_level: 'Easy', question_type: 'Technical', question_text: 'What is the Node.js event loop and how does it work?', hint: 'Single-threaded, non-blocking I/O, call stack, callback queue.' },
    { career_category: 'Backend Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is the difference between SQL and NoSQL databases? When would you use each?', hint: 'Structured vs flexible schema, ACID vs BASE.' },
    { career_category: 'Backend Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How do you implement JWT authentication in a Node.js application?', hint: 'Sign token on login, verify on protected routes with middleware.' },
    { career_category: 'Backend Developer', difficulty_level: 'Medium', question_type: 'Conceptual', question_text: 'What are microservices and how do they differ from monolithic architecture?', hint: 'Independent services, separate deployment, API communication.' },
    { career_category: 'Backend Developer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'How would you design a rate limiter for an API?', hint: 'Token bucket, sliding window, Redis for distributed rate limiting.' },
    { career_category: 'Backend Developer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'Explain database indexing and how it improves query performance.', hint: 'B-tree index, compound index, trade-off with write performance.' },
    { career_category: 'Backend Developer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Tell me about a challenging bug you debugged and how you resolved it.', hint: 'Focus on systematic approach and root cause analysis.' },
    { career_category: 'Backend Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is middleware in Express.js and how does it work?', hint: 'Functions with access to req, res, next in request-response cycle.' },
    { career_category: 'Backend Developer', difficulty_level: 'Medium', question_type: 'Situational', question_text: 'Your API endpoint is slow. How would you diagnose and fix the performance issue?', hint: 'Profile, check N+1 queries, add indexes, caching, pagination.' },

    // Full Stack Developer
    { career_category: 'Full Stack Developer', difficulty_level: 'Easy', question_type: 'Technical', question_text: 'Explain the difference between client-side and server-side rendering.', hint: 'CSR: browser renders; SSR: server renders HTML; trade-offs in SEO, performance.' },
    { career_category: 'Full Stack Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How do you manage state in a large React application?', hint: 'Context API, Redux, Zustand, React Query for server state.' },
    { career_category: 'Full Stack Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is CORS and how do you handle it in a Node.js application?', hint: 'Cross-Origin Resource Sharing, cors npm package, allowed origins.' },
    { career_category: 'Full Stack Developer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'Design the architecture for a real-time collaborative document editor.', hint: 'WebSockets, operational transformation or CRDT, conflict resolution.' },
    { career_category: 'Full Stack Developer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'How do you approach learning a new technology or framework?', hint: 'Official docs, small project, community resources.' },

    // Frontend Developer
    { career_category: 'Frontend Developer', difficulty_level: 'Easy', question_type: 'Technical', question_text: 'What is the Virtual DOM in React and why is it used?', hint: 'In-memory representation, diffing algorithm, minimizes real DOM updates.' },
    { career_category: 'Frontend Developer', difficulty_level: 'Easy', question_type: 'Technical', question_text: 'Explain the CSS Box Model.', hint: 'Content, padding, border, margin layers.' },
    { career_category: 'Frontend Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What are React Hooks and why were they introduced?', hint: 'useState, useEffect, custom hooks; replaced class lifecycle methods.' },
    { career_category: 'Frontend Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How do you optimize the performance of a React application?', hint: 'React.memo, useMemo, useCallback, lazy loading, code splitting.' },
    { career_category: 'Frontend Developer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'Explain the concept of accessibility (a11y) in web development.', hint: 'ARIA attributes, semantic HTML, keyboard navigation, color contrast.' },
    { career_category: 'Frontend Developer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'How do you ensure cross-browser compatibility in your projects?', hint: 'CSS resets, feature detection, testing on multiple browsers, polyfills.' },

    // DevOps Engineer
    { career_category: 'DevOps Engineer', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is CI/CD and why is it important?', hint: 'Continuous Integration/Delivery, automated testing and deployment.' },
    { career_category: 'DevOps Engineer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'Explain the difference between Docker containers and virtual machines.', hint: 'Containers share OS kernel, VMs have full OS; containers are lighter.' },
    { career_category: 'DevOps Engineer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is Kubernetes and what problems does it solve?', hint: 'Container orchestration, auto-scaling, self-healing, load balancing.' },
    { career_category: 'DevOps Engineer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'How would you design a zero-downtime deployment strategy?', hint: 'Blue-green deployment, rolling updates, canary releases.' },
    { career_category: 'DevOps Engineer', difficulty_level: 'Medium', question_type: 'Behavioral', question_text: 'Describe how you have automated a previously manual process.', hint: 'Focus on impact, tools used, and time saved.' },

    // Cybersecurity Analyst (fixed to match AI service)
    { career_category: 'Cybersecurity Analyst', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the CIA triad in cybersecurity?', hint: 'Confidentiality, Integrity, Availability.' },
    { career_category: 'Cybersecurity Analyst', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is SQL injection and how do you prevent it?', hint: 'Parameterized queries, prepared statements, input validation.' },
    { career_category: 'Cybersecurity Analyst', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'Explain the difference between symmetric and asymmetric encryption.', hint: 'Same key vs public/private key pair; AES vs RSA.' },
    { career_category: 'Cybersecurity Analyst', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'How would you conduct a penetration test on a web application?', hint: 'Reconnaissance, scanning, exploitation, reporting; OWASP Top 10.' },
    { career_category: 'Cybersecurity Analyst', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is a firewall and what types exist?', hint: 'Packet filtering, stateful inspection, application-layer firewall.' },

    // UI/UX Designer
    { career_category: 'UI/UX Designer', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the difference between UI and UX design?', hint: 'UI is visual presentation; UX is overall user experience and journey.' },
    { career_category: 'UI/UX Designer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'Explain the design thinking process and its 5 stages.', hint: 'Empathize, Define, Ideate, Prototype, Test.' },
    { career_category: 'UI/UX Designer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What are design systems and why are they important?', hint: 'Reusable components, consistent styling, shared language between designers and developers.' },
    { career_category: 'UI/UX Designer', difficulty_level: 'Hard', question_type: 'Situational', question_text: 'How would you redesign a complex dashboard to improve usability?', hint: 'User research, information hierarchy, progressive disclosure, A/B testing.' },
    { career_category: 'UI/UX Designer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Walk me through your design process for a recent project.', hint: 'Research → Wireframe → Prototype → Test → Iterate.' },

    // Business Analyst
    { career_category: 'Business Analyst', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the role of a Business Analyst in a software project?', hint: 'Bridge between business stakeholders and technical teams; requirements gathering.' },
    { career_category: 'Business Analyst', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is the difference between functional and non-functional requirements?', hint: 'Functional = what the system does; Non-functional = performance, security, scalability.' },
    { career_category: 'Business Analyst', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How do you write a user story? Give an example.', hint: 'As a [user], I want [feature] so that [benefit]. Include acceptance criteria.' },
    { career_category: 'Business Analyst', difficulty_level: 'Hard', question_type: 'Situational', question_text: 'Stakeholders keep changing requirements. How do you handle it?', hint: 'Change control process, impact analysis, scope creep management, MoSCoW prioritization.' },
    { career_category: 'Business Analyst', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Describe a time you resolved a conflict between stakeholders.', hint: 'Focus on active listening, finding common ground, and data-driven decisions.' },

    // AI Engineer
    { career_category: 'AI Engineer', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the difference between AI, Machine Learning, and Deep Learning?', hint: 'AI is the broad field; ML is a subset using data; DL uses neural networks.' },
    { career_category: 'AI Engineer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'Explain how backpropagation works in neural networks.', hint: 'Chain rule, gradient descent, updating weights through layers from output to input.' },
    { career_category: 'AI Engineer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'What is transfer learning and when would you use it?', hint: 'Reuse pre-trained model weights; useful for limited data, faster training.' },
    { career_category: 'AI Engineer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'Explain the transformer architecture and its advantages over RNNs.', hint: 'Self-attention mechanism, parallelization, long-range dependencies without vanishing gradient.' },
    { career_category: 'AI Engineer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Describe an AI project you built and the challenges you faced.', hint: 'Data quality, model selection, evaluation metrics, deployment challenges.' },

    // Mobile App Developer
    { career_category: 'Mobile App Developer', difficulty_level: 'Easy', question_type: 'Conceptual', question_text: 'What is the difference between native and cross-platform mobile development?', hint: 'Native uses platform SDK; React Native, Flutter are cross-platform.' },
    { career_category: 'Mobile App Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How does React Native bridge work?', hint: 'JavaScript thread communicates with native modules via the bridge.' },
    { career_category: 'Mobile App Developer', difficulty_level: 'Medium', question_type: 'Technical', question_text: 'How do you manage offline data in a mobile app?', hint: 'AsyncStorage, SQLite, Redux Persist, background sync.' },
    { career_category: 'Mobile App Developer', difficulty_level: 'Hard', question_type: 'Technical', question_text: 'What strategies do you use to optimize mobile app performance?', hint: 'FlatList, memoization, lazy loading, reduce re-renders, profiler.' },
    { career_category: 'Mobile App Developer', difficulty_level: 'Easy', question_type: 'Behavioral', question_text: 'Tell me about a mobile app you built and the challenges you faced.', hint: 'Focus on specific technical and UX challenges and your solutions.' },
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Job.deleteMany({});
        await Project.deleteMany({});
        await LearningResource.deleteMany({});
        await InterviewQuestion.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert seed data
        await Job.insertMany(jobs);
        console.log(`✅ Inserted ${jobs.length} jobs`);

        await Project.insertMany(projects);
        console.log(`✅ Inserted ${projects.length} projects`);

        await LearningResource.insertMany(learningResources);
        console.log(`✅ Inserted ${learningResources.length} learning resources`);

        await InterviewQuestion.insertMany(interviewQuestions);
        console.log(`✅ Inserted ${interviewQuestions.length} interview questions`);

        console.log('\n🎉 Seed complete! All new module data is ready.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seedDB();
