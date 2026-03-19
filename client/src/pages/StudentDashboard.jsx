import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Award, ArrowRight, AlertCircle, FileText, PenTool, Hammer, Briefcase as BriefcaseIcon, Code as CodeIcon, BookOpen as BookOpenIcon, Brain as BrainIcon } from 'lucide-react';
import api from '../utils/api';


const StudentDashboard = () => {
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const { data } = await api.get('/assessments/me');
                setAssessment(data.data);
            } catch (error) {
                console.error('Error fetching assessment:', error);
            }
            setLoading(false);
        };
        fetchAssessment();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!assessment || !assessment.predictionResult) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">No Assessment Found</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Take our comprehensive assessment to discover your ideal career path.
                        </p>
                        <Link to="/assessment" className="btn-primary">Start Assessment</Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    const { predictionResult } = assessment;
    const chartData = predictionResult.topCareers.map((career) => ({
        name: career.careerName,
        probability: career.probability,
    }));

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Your Career Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Based on your assessment completed on {new Date(predictionResult.predictedAt).toLocaleDateString()}
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Readiness Score</p>
                                <p className="text-3xl font-bold gradient-text">{predictionResult.readinessScore}%</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-primary-600" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cluster Group</p>
                                <p className="text-2xl font-bold">{predictionResult.clusterGroup}</p>
                            </div>
                            <Target className="w-12 h-12 text-secondary-600" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Match</p>
                                <p className="text-xl font-bold">{predictionResult.topCareers[0]?.probability}%</p>
                            </div>
                            <Award className="w-12 h-12 text-yellow-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Top Predictions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card mb-8">
                    <h2 className="text-2xl font-bold mb-6">Top Career Predictions</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="probability" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#d946ef" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Career Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {predictionResult.topCareers.map((career, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="card hover:shadow-2xl transition-all"
                        >
                            <h3 className="text-xl font-bold mb-2">{career.careerName}</h3>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Match Score</span>
                                    <span className="font-semibold">{career.probability}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                                        style={{ width: `${career.probability}%` }}
                                    />
                                </div>
                            </div>
                            <Link
                                to={`/roadmap/${career.careerName}`}
                                className="btn-outline w-full flex items-center justify-center space-x-2"
                            >
                                <span>View Roadmap</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Resume Analyzer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        to="/resume-analyzer"
                        className="block card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800 hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Analyze Your Resume</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Upload your resume and see how it matches your predicted career
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-primary-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </motion.div>

                {/* Resume Builder & Editor CTAs */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                    >
                        <Link
                            to="/resume-builder"
                            className="block card bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 hover:shadow-xl transition-all group h-full"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                        <Hammer className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Build a Resume</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Create a professional resume from scratch with live preview
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            to="/resume-editor"
                            className="block card bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all group h-full"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <PenTool className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Edit Existing Resume</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Upload, parse, edit, and optimize your existing resume
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* New Modules CTAs */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }} className="mb-3">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Career Tools</h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {[
                        { to: '/jobs', label: 'Job Recommendations', desc: 'Find jobs matched to your predicted career & skills', icon: 'Briefcase', from: 'from-blue-500', to2: 'to-cyan-600', border: 'border-blue-200 dark:border-blue-800', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20', accent: 'text-blue-500' },
                        { to: '/projects', label: 'Project Recommendations', desc: 'Build portfolio projects tailored to your career goals', icon: 'Code', from: 'from-orange-500', to2: 'to-red-600', border: 'border-orange-200 dark:border-orange-800', bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20', accent: 'text-orange-500' },
                        { to: '/learning', label: 'Learning Resources', desc: 'Curated courses to fill your skill gaps', icon: 'BookOpen', from: 'from-pink-500', to2: 'to-rose-600', border: 'border-pink-200 dark:border-pink-800', bg: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20', accent: 'text-pink-500' },
                        { to: '/mock-interview', label: 'Mock Interview', desc: 'Practice with AI-generated interview questions', icon: 'Brain', from: 'from-indigo-500', to2: 'to-purple-600', border: 'border-indigo-200 dark:border-indigo-800', bg: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20', accent: 'text-indigo-500' },
                    ].map((item, i) => {
                        const icons = { Briefcase: BriefcaseIcon, Code: CodeIcon, BookOpen: BookOpenIcon, Brain: BrainIcon };
                        const Icon = icons[item.icon];
                        return (
                            <motion.div key={item.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.05 }}>
                                <Link to={item.to} className={`block card bg-gradient-to-r ${item.bg} border ${item.border} hover:shadow-xl transition-all group`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.from} ${item.to2} flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{item.label}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className={`w-5 h-5 ${item.accent} group-hover:translate-x-1 transition-transform`} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Skill Gap */}
                {predictionResult.skillGap && predictionResult.skillGap.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="card"
                    >
                        <h2 className="text-2xl font-bold mb-6">Skill Gap Analysis</h2>
                        <div className="space-y-6">
                            {predictionResult.skillGap.slice(0, 3).map((gap, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-lg mb-2">{gap.career}</h3>
                                    {gap.missingSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {gap.missingSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-green-600 dark:text-green-400">✓ All required skills present!</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
