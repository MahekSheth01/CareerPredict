import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Award, DollarSign, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const Roadmap = () => {
    const { careerName } = useParams();
    const [roadmapData, setRoadmapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const { data } = await api.get(`/assessments/roadmap/${careerName}`);
                setRoadmapData(data.data);
            } catch (error) {
                console.error('Error fetching roadmap:', error);
            }
            setLoading(false);
        };
        fetchRoadmap();
    }, [careerName]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!roadmapData) {
        return (
            <div className="min-h-screen py-12 px-4 text-center">
                <h2 className="text-2xl font-bold">Roadmap not found</h2>
            </div>
        );
    }

    const phases = [
        { key: 'months_0_3', title: '0-3 Months', color: 'from-purple-500 to-pink-500' },
        { key: 'months_3_6', title: '3-6 Months', color: 'from-pink-500 to-rose-500' },
        { key: 'months_6_9', title: '6-9 Months', color: 'from-rose-500 to-orange-500' },
        { key: 'months_9_12', title: '9-12 Months', color: 'from-orange-500 to-yellow-500' },
    ];

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center space-x-2 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold gradient-text mb-2">{roadmapData.career}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">{roadmapData.description}</p>
                </motion.div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Average Salary</p>
                        <p className="text-xl font-bold">
                            ${roadmapData.averageSalary?.min?.toLocaleString() || 'N/A'} - ${roadmapData.averageSalary?.max?.toLocaleString() || 'N/A'}
                        </p>
                    </div>

                    <div className="card">
                        <Award className="w-8 h-8 text-yellow-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Certifications</p>
                        <p className="text-lg font-bold">{roadmapData.certifications?.length || 0} Available</p>
                    </div>

                    <div className="card">
                        <BookOpen className="w-8 h-8 text-primary-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Skills to Learn</p>
                        <p className="text-lg font-bold">{roadmapData.skillGap?.length || 0} Skills</p>
                    </div>
                </div>

                {/* Skill Gap */}
                {roadmapData.skillGap && roadmapData.skillGap.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
                        <h2 className="text-2xl font-bold mb-4">Skills You Need to Learn</h2>
                        <div className="flex flex-wrap gap-2">
                            {roadmapData.skillGap.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Roadmap Phases */}
                <div className="space-y-8">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={phase.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card"
                        >
                            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${phase.color} text-white font-bold mb-4`}>
                                {phase.title}
                            </div>
                            <div className="space-y-4">
                                {roadmapData.roadmap?.[phase.key]?.map((item, idx) => (
                                    <div key={idx} className="border-l-4 border-primary-500 pl-4">
                                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                                        {item.resources && item.resources.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {item.resources.map((resource, ridx) => (
                                                    <span key={ridx} className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                                        {resource}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Certifications */}
                {roadmapData.certifications && roadmapData.certifications.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mt-8">
                        <h2 className="text-2xl font-bold mb-4">Recommended Certifications</h2>
                        <div className="space-y-2">
                            {roadmapData.certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Roadmap;
