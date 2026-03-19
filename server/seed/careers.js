import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Career from '../models/Career.js';

dotenv.config();

const careers = [
    {
        careerName: 'Data Scientist',
        description: 'Analyze complex data sets to help organizations make better decisions using statistical analysis and machine learning.',
        requiredSkills: [
            'Python',
            'Machine Learning',
            'Data Analysis',
            'SQL',
            'TensorFlow',
            'Statistics',
            'Problem Solving',
            'Critical Thinking',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Master Python Programming',
                    description: 'Learn Python fundamentals, pandas, numpy, and matplotlib',
                    resources: ['Python.org', 'DataCamp Python Course', 'Kaggle Learn'],
                },
                {
                    title: 'Statistics & Mathematics',
                    description: 'Study probability, linear algebra, and statistical methods',
                    resources: ['Khan Academy Statistics', 'StatQuest YouTube'],
                },
            ],
            months_3_6: [
                {
                    title: 'Machine Learning Fundamentals',
                    description: 'Learn supervised and unsupervised learning algorithms',
                    resources: ['Coursera ML Course', 'Scikit-learn Documentation'],
                },
                {
                    title: 'Data Visualization',
                    description: 'Master tools like Tableau, Power BI, and Plotly',
                    resources: ['Tableau Public', 'Plotly Tutorial'],
                },
            ],
            months_6_9: [
                {
                    title: 'Deep Learning',
                    description: 'Study neural networks using TensorFlow and PyTorch',
                    resources: ['Deep Learning Specialization', 'Fast.ai'],
                },
                {
                    title: 'Real-world Projects',
                    description: 'Build portfolio projects on Kaggle and GitHub',
                    resources: ['Kaggle Competitions', 'GitHub'],
                },
            ],
            months_9_12: [
                {
                    title: 'Big Data Technologies',
                    description: 'Learn Spark, Hadoop, and cloud platforms',
                    resources: ['Apache Spark Documentation', 'AWS/GCP Tutorials'],
                },
                {
                    title: 'Job Preparation',
                    description: 'Practice interviews, update portfolio, apply for positions',
                    resources: ['LeetCode', 'Glassdoor', 'LinkedIn'],
                },
            ],
        },
        certifications: [
            'Google Data Analytics Professional Certificate',
            'IBM Data Science Professional Certificate',
            'AWS Certified Machine Learning',
        ],
        averageSalary: {
            min: 80000,
            max: 150000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'Backend Developer',
        description: 'Build and maintain server-side applications, databases, and APIs that power web and mobile applications.',
        requiredSkills: [
            'Node.js',
            'Python',
            'Java',
            'SQL',
            'MongoDB',
            'REST API',
            'Problem Solving',
            'Teamwork',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Programming Fundamentals',
                    description: 'Master one backend language (Node.js, Python, or Java)',
                    resources: ['FreeCodeCamp', 'The Odin Project'],
                },
                {
                    title: 'Database Basics',
                    description: 'Learn SQL and NoSQL database concepts',
                    resources: ['SQLZoo', 'MongoDB University'],
                },
            ],
            months_3_6: [
                {
                    title: 'Web Frameworks',
                    description: 'Learn Express.js, Django, or Spring Boot',
                    resources: ['Express Documentation', 'Django Tutorial'],
                },
                {
                    title: 'API Development',
                    description: 'Build RESTful APIs and understand authentication',
                    resources: ['REST API Tutorial', 'JWT.io'],
                },
            ],
            months_6_9: [
                {
                    title: 'Advanced Concepts',
                    description: 'Study microservices, caching, and message queues',
                    resources: ['Redis Documentation', 'RabbitMQ Tutorial'],
                },
                {
                    title: 'Testing & Deployment',
                    description: 'Learn unit testing, CI/CD, and Docker',
                    resources: ['Jest Documentation', 'Docker Tutorial'],
                },
            ],
            months_9_12: [
                {
                    title: 'Cloud Platforms',
                    description: 'Deploy applications on AWS, Azure, or GCP',
                    resources: ['AWS Free Tier', 'Azure Learning Path'],
                },
                {
                    title: 'Portfolio Projects',
                    description: 'Build full-stack applications and contribute to open source',
                    resources: ['GitHub', 'Good First Issue'],
                },
            ],
        },
        certifications: [
            'AWS Certified Developer',
            'MongoDB Certified Developer',
            'Oracle Certified Java Programmer',
        ],
        averageSalary: {
            min: 70000,
            max: 130000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'Frontend Developer',
        description: 'Create engaging user interfaces and experiences for web applications using modern frameworks and tools.',
        requiredSkills: [
            'JavaScript',
            'React',
            'HTML/CSS',
            'UI/UX Design',
            'Git',
            'Creativity',
            'Attention to Detail',
            'Communication',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Web Fundamentals',
                    description: 'Master HTML5, CSS3, and JavaScript ES6+',
                    resources: ['MDN Web Docs', 'JavaScript.info'],
                },
                {
                    title: 'Responsive Design',
                    description: 'Learn CSS Grid, Flexbox, and mobile-first design',
                    resources: ['CSS-Tricks', 'Responsive Web Design Course'],
                },
            ],
            months_3_6: [
                {
                    title: 'React Framework',
                    description: 'Learn React, hooks, state management',
                    resources: ['React Official Tutorial', 'React Documentation'],
                },
                {
                    title: 'Version Control',
                    description: 'Master Git and GitHub workflows',
                    resources: ['Git Documentation', 'GitHub Skills'],
                },
            ],
            months_6_9: [
                {
                    title: 'Advanced React',
                    description: 'Study Next.js, Redux, and performance optimization',
                    resources: ['Next.js Documentation', 'Redux Toolkit'],
                },
                {
                    title: 'Testing',
                    description: 'Learn Jest, React Testing Library',
                    resources: ['Testing Library Docs', 'Jest Documentation'],
                },
            ],
            months_9_12: [
                {
                    title: 'Build Tools & Deployment',
                    description: 'Master Webpack, Vite, and deployment strategies',
                    resources: ['Vite Documentation', 'Netlify/Vercel'],
                },
                {
                    title: 'Portfolio Development',
                    description: 'Create impressive portfolio showcasing 5+ projects',
                    resources: ['Dribbble', 'Awwwards'],
                },
            ],
        },
        certifications: [
            'Meta Front-End Developer Certificate',
            'Google UX Design Certificate',
            'FreeCodeCamp Responsive Web Design',
        ],
        averageSalary: {
            min: 65000,
            max: 120000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'DevOps Engineer',
        description: 'Bridge development and operations by automating infrastructure, deployments, and system reliability.',
        requiredSkills: [
            'Linux',
            'Docker',
            'Kubernetes',
            'CI/CD',
            'AWS',
            'Python',
            'Problem Solving',
            'Automation',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Linux Administration',
                    description: 'Master Linux command line, shell scripting, and system management',
                    resources: ['Linux Journey', 'Ubuntu Documentation'],
                },
                {
                    title: 'Networking Basics',
                    description: 'Understand TCP/IP, DNS, HTTP/HTTPS protocols',
                    resources: ['Networking Fundamentals', 'Computer Networking Course'],
                },
            ],
            months_3_6: [
                {
                    title: 'Containerization',
                    description: 'Learn Docker and container orchestration',
                    resources: ['Docker Documentation', 'Play with Docker'],
                },
                {
                    title: 'CI/CD Pipelines',
                    description: 'Set up Jenkins, GitLab CI, or GitHub Actions',
                    resources: ['Jenkins Tutorial', 'GitHub Actions Docs'],
                },
            ],
            months_6_9: [
                {
                    title: 'Kubernetes',
                    description: 'Master container orchestration with Kubernetes',
                    resources: ['Kubernetes Documentation', 'Kubernetes Course'],
                },
                {
                    title: 'Infrastructure as Code',
                    description: 'Learn Terraform or CloudFormation',
                    resources: ['Terraform Documentation', 'HashiCorp Learn'],
                },
            ],
            months_9_12: [
                {
                    title: 'Cloud Platforms',
                    description: 'Get certified in AWS, Azure, or GCP',
                    resources: ['AWS Training', 'Cloud Guru'],
                },
                {
                    title: 'Monitoring & Logging',
                    description: 'Implement Prometheus, Grafana, ELK stack',
                    resources: ['Prometheus Documentation', 'Grafana Tutorial'],
                },
            ],
        },
        certifications: [
            'AWS Certified DevOps Engineer',
            'Certified Kubernetes Administrator (CKA)',
            'Docker Certified Associate',
        ],
        averageSalary: {
            min: 85000,
            max: 145000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'UI/UX Designer',
        description: 'Design intuitive and beautiful user interfaces that enhance user experience and engagement.',
        requiredSkills: [
            'Figma',
            'Adobe XD',
            'UI/UX Design',
            'User Research',
            'Prototyping',
            'Creativity',
            'Communication',
            'Empathy',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Design Fundamentals',
                    description: 'Learn color theory, typography, layout principles',
                    resources: ['Refactoring UI', 'Laws of UX'],
                },
                {
                    title: 'Figma Mastery',
                    description: 'Master Figma for UI design and prototyping',
                    resources: ['Figma YouTube Channel', 'Figma Community'],
                },
            ],
            months_3_6: [
                {
                    title: 'User Research',
                    description: 'Learn user interviews, personas, user journey mapping',
                    resources: ['Nielsen Norman Group', 'UX Research Course'],
                },
                {
                    title: 'Wireframing & Prototyping',
                    description: 'Create low and high-fidelity prototypes',
                    resources: ['Balsamiq', 'InVision Tutorial'],
                },
            ],
            months_6_9: [
                {
                    title: 'Interaction Design',
                    description: 'Study animations, micro-interactions, design systems',
                    resources: ['Framer Motion', 'Material Design'],
                },
                {
                    title: 'Usability Testing',
                    description: 'Conduct user testing and iterate on feedback',
                    resources: ['UsabilityHub', 'UserTesting.com'],
                },
            ],
            months_9_12: [
                {
                    title: 'Portfolio Development',
                    description: 'Build case studies showcasing design process',
                    resources: ['Behance', 'Dribbble'],
                },
                {
                    title: 'Collaboration Skills',
                    description: 'Learn to work with developers and stakeholders',
                    resources: ['Design Handoff Best Practices', 'Zeplin'],
                },
            ],
        },
        certifications: [
            'Google UX Design Certificate',
            'Adobe Certified Professional',
            'Interaction Design Foundation Certificate',
        ],
        averageSalary: {
            min: 60000,
            max: 115000,
            currency: 'USD',
        },
        demandLevel: 'high',
    },
    {
        careerName: 'Business Analyst',
        description: 'Bridge business needs and technology solutions by analyzing requirements and optimizing processes.',
        requiredSkills: [
            'Data Analysis',
            'SQL',
            'Excel',
            'Communication',
            'Problem Solving',
            'Critical Thinking',
            'Presentation Skills',
            'Stakeholder Management',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Business Fundamentals',
                    description: 'Understand business processes, requirements gathering',
                    resources: ['BA Essentials Course', 'Business Analysis Body of Knowledge'],
                },
                {
                    title: 'Data Analysis Tools',
                    description: 'Master Excel, SQL, and data visualization',
                    resources: ['Excel Training', 'Mode SQL Tutorial'],
                },
            ],
            months_3_6: [
                {
                    title: 'Requirements Analysis',
                    description: 'Learn to document BRDs, FRDs, use cases',
                    resources: ['Requirements Engineering Course', 'IIBA Resources'],
                },
                {
                    title: 'Process Modeling',
                    description: 'Study BPMN, flowcharts, process improvement',
                    resources: ['Lucidchart Tutorial', 'Process Modeling Guide'],
                },
            ],
            months_6_9: [
                {
                    title: 'Analytics & BI Tools',
                    description: 'Learn Tableau, Power BI, data storytelling',
                    resources: ['Tableau Public', 'Power BI Learning Path'],
                },
                {
                    title: 'Agile Methodology',
                    description: 'Understand Scrum, user stories, backlog management',
                    resources: ['Scrum Guide', 'Agile Alliance'],
                },
            ],
            months_9_12: [
                {
                    title: 'Stakeholder Management',
                    description: 'Develop communication and presentation skills',
                    resources: ['Effective Presentations Course', 'Stakeholder Analysis'],
                },
                {
                    title: 'Certification Prep',
                    description: 'Prepare for CBAP or PMI-PBA certification',
                    resources: ['IIBA Certification', 'PMI Resources'],
                },
            ],
        },
        certifications: [
            'CBAP (Certified Business Analysis Professional)',
            'PMI-PBA (Professional in Business Analysis)',
            'Microsoft Certified: Data Analyst Associate',
        ],
        averageSalary: {
            min: 65000,
            max: 110000,
            currency: 'USD',
        },
        demandLevel: 'high',
    },
    {
        careerName: 'Cybersecurity Analyst',
        description: 'Protect organizations from cyber threats by monitoring systems, detecting vulnerabilities, and responding to incidents.',
        requiredSkills: [
            'Cybersecurity',
            'Networking',
            'Linux',
            'Ethical Hacking',
            'Risk Assessment',
            'Problem Solving',
            'Attention to Detail',
            'Critical Thinking',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Networking Fundamentals',
                    description: 'Master TCP/IP, OSI model, network protocols',
                    resources: ['CompTIA Network+ Study Guide', 'Cisco Networking Basics'],
                },
                {
                    title: 'Operating Systems',
                    description: 'Learn Windows and Linux security configurations',
                    resources: ['Linux Security', 'Windows Security Hardening'],
                },
            ],
            months_3_6: [
                {
                    title: 'Security Fundamentals',
                    description: 'Study cryptography, authentication, access control',
                    resources: ['CompTIA Security+ Course', 'Cybrary'],
                },
                {
                    title: 'Threat Detection',
                    description: 'Learn SIEM tools, log analysis, incident response',
                    resources: ['Splunk Fundamentals', 'Security Onion'],
                },
            ],
            months_6_9: [
                {
                    title: 'Ethical Hacking',
                    description: 'Practice penetration testing and vulnerability assessment',
                    resources: ['HackTheBox', 'TryHackMe', 'OWASP Top 10'],
                },
                {
                    title: 'Security Tools',
                    description: 'Master Wireshark, Metasploit, Nmap, Burp Suite',
                    resources: ['Wireshark Tutorial', 'Metasploit Unleashed'],
                },
            ],
            months_9_12: [
                {
                    title: 'Certification Preparation',
                    description: 'Study for CEH or OSCP certification',
                    resources: ['CEH Study Guide', 'Offensive Security Training'],
                },
                {
                    title: 'Compliance & Frameworks',
                    description: 'Learn NIST, ISO 27001, GDPR compliance',
                    resources: ['NIST Cybersecurity Framework', 'ISO 27001'],
                },
            ],
        },
        certifications: [
            'CompTIA Security+',
            'CEH (Certified Ethical Hacker)',
            'CISSP (Certified Information Systems Security Professional)',
        ],
        averageSalary: {
            min: 75000,
            max: 135000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'AI Engineer',
        description: 'Design and implement artificial intelligence solutions using machine learning and deep learning techniques.',
        requiredSkills: [
            'Python',
            'Machine Learning',
            'TensorFlow',
            'PyTorch',
            'Deep Learning',
            'Mathematics',
            'Problem Solving',
            'Research',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Python & Mathematics',
                    description: 'Master Python, linear algebra, calculus, probability',
                    resources: ['3Blue1Brown', 'MIT OpenCourseWare Mathematics'],
                },
                {
                    title: 'ML Fundamentals',
                    description: 'Learn supervised and unsupervised learning',
                    resources: ['Andrew Ng ML Course', 'Scikit-learn'],
                },
            ],
            months_3_6: [
                {
                    title: 'Deep Learning',
                    description: 'Study neural networks, CNNs, RNNs, transformers',
                    resources: ['Deep Learning Specialization', 'Fast.ai'],
                },
                {
                    title: 'ML Frameworks',
                    description: 'Master TensorFlow and PyTorch',
                    resources: ['TensorFlow Documentation', 'PyTorch Tutorials'],
                },
            ],
            months_6_9: [
                {
                    title: 'Advanced AI Topics',
                    description: 'Study NLP, computer vision, reinforcement learning',
                    resources: ['Hugging Face', 'OpenAI Gym'],
                },
                {
                    title: 'Research Papers',
                    description: 'Read and implement latest AI research papers',
                    resources: ['arXiv', 'Papers With Code'],
                },
            ],
            months_9_12: [
                {
                    title: 'MLOps & Deployment',
                    description: 'Learn model deployment, monitoring, scaling',
                    resources: ['MLflow', 'Kubeflow', 'AWS SageMaker'],
                },
                {
                    title: 'Portfolio Projects',
                    description: 'Build and deploy AI applications',
                    resources: ['Kaggle', 'GitHub', 'Hugging Face Spaces'],
                },
            ],
        },
        certifications: [
            'TensorFlow Developer Certificate',
            'AWS Certified Machine Learning',
            'Deep Learning Specialization Certificate',
        ],
        averageSalary: {
            min: 90000,
            max: 160000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
    {
        careerName: 'Product Manager',
        description: 'Lead product strategy, development, and launch by coordinating cross-functional teams and understanding user needs.',
        requiredSkills: [
            'Product Strategy',
            'User Research',
            'Data Analysis',
            'Leadership',
            'Communication',
            'Problem Solving',
            'Project Management',
            'Stakeholder Management',
        ],
        roadmap: {
            months_0_3: [
                {
                    title: 'Product Management Basics',
                    description: 'Understand product lifecycle, market analysis',
                    resources: ['Product School', 'Pragmatic Institute'],
                },
                {
                    title: 'User-Centric Thinking',
                    description: 'Learn user research, personas, jobs-to-be-done',
                    resources: ['JTBD Framework', 'User Interviews Guide'],
                },
            ],
            months_3_6: [
                {
                    title: 'Product Strategy',
                    description: 'Study roadmapping, prioritization frameworks',
                    resources: ['RICE Framework', 'Product Roadmap Course'],
                },
                {
                    title: 'Data-Driven Decisions',
                    description: 'Learn analytics, A/B testing, metrics',
                    resources: ['Google Analytics', 'Mixpanel Academy'],
                },
            ],
            months_6_9: [
                {
                    title: 'Agile & Scrum',
                    description: 'Master agile methodologies, sprint planning',
                    resources: ['Scrum.org', 'Agile Product Management'],
                },
                {
                    title: 'Technical Understanding',
                    description: 'Learn basic coding, APIs, system architecture',
                    resources: ['Codecademy', 'System Design Primer'],
                },
            ],
            months_9_12: [
                {
                    title: 'Leadership Skills',
                    description: 'Develop stakeholder management, negotiation',
                    resources: ['Crucial Conversations', 'Leadership Training'],
                },
                {
                    title: 'Case Studies',
                    description: 'Practice product case interviews, build portfolio',
                    resources: ['Exponent', 'Product Alliance'],
                },
            ],
        },
        certifications: [
            'Certified Scrum Product Owner (CSPO)',
            'Pragmatic Marketing Certified',
            'Product Management Certificate (General Assembly)',
        ],
        averageSalary: {
            min: 85000,
            max: 150000,
            currency: 'USD',
        },
        demandLevel: 'very high',
    },
];

const seedCareers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing careers
        await Career.deleteMany({});
        console.log('🗑️  Cleared existing careers');

        // Insert new careers
        await Career.insertMany(careers);
        console.log(`✅ Seeded ${careers.length} careers successfully`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding careers:', error);
        process.exit(1);
    }
};

seedCareers();
