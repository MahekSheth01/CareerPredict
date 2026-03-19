import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, AlertCircle, CheckCircle, Video, FileText, Youtube } from 'lucide-react';
import api from '../utils/api';

const typeConfig = {
    course: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: BookOpen },
    video: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: Video },
    article: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: FileText },
    tutorial: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Youtube },
    book: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: BookOpen },
};

const LearningResources = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSkill, setActiveSkill] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data: res } = await api.get('/resources/recommend');
                setData(res.data);
                const skills = Object.keys(res.data.resources_by_skill);
                if (skills.length > 0) setActiveSkill(skills[0]);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load learning resources.');
            }
            setLoading(false);
        };
        fetchResources();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Assessment Required</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        </div>
    );

    const skills = Object.keys(data?.resources_by_skill || {});
    const activeResources = activeSkill ? data.resources_by_skill[activeSkill] : [];

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Learning Resources</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Curated resources to fill your skill gaps for{' '}
                        <span className="font-semibold text-primary-600">{data?.top_career}</span>
                    </p>
                </motion.div>

                {/* Missing Skills Summary */}
                {data?.missing_skills?.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                        <h3 className="font-bold mb-3 flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <span>Skills to Learn ({data.missing_skills.length})</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.missing_skills.map(skill => {
                                const hasResources = !!data.resources_by_skill[skill];
                                return hasResources ? (
                                    <button
                                        key={skill}
                                        onClick={() => setActiveSkill(skill)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeSkill === skill
                                                ? 'bg-yellow-500 text-white shadow'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ) : (
                                    <span
                                        key={skill}
                                        title="No resources available yet for this skill"
                                        className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    >
                                        {skill}
                                    </span>
                                );
                            })}
                        </div>
                        {data.missing_skills.some(s => !data.resources_by_skill[s]) && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                                💡 Greyed-out skills don't have a dedicated resource yet — click any highlighted skill to start learning.
                            </p>
                        )}
                    </motion.div>
                )}


                <div className="grid md:grid-cols-4 gap-6">
                    {/* Skill Sidebar */}
                    <div className="md:col-span-1">
                        <div className="card sticky top-20">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-500">Skills</h3>
                            <div className="space-y-1">
                                {skills.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => setActiveSkill(skill)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSkill === skill ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        {skill}
                                        <span className="ml-1 text-xs opacity-70">({data.resources_by_skill[skill]?.length})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resources Panel */}
                    <div className="md:col-span-3 space-y-4">
                        <h2 className="text-2xl font-bold">{activeSkill}</h2>
                        {activeResources.length === 0 ? (
                            <div className="card text-center py-12">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-500">No resources needed — you already have this skill!</p>
                            </div>
                        ) : (
                            activeResources.map((resource, i) => {
                                const cfg = typeConfig[resource.resource_type] || typeConfig.course;
                                const Icon = cfg.icon;
                                return (
                                    <motion.div
                                        key={resource._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        className="card hover:shadow-xl transition-all flex items-center space-x-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                                                    {resource.resource_type}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{resource.platform}</span>
                                                {resource.is_free && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">Free</span>
                                                )}
                                                <span className="text-xs text-gray-400">{resource.duration}</span>
                                            </div>
                                            <h4 className="font-semibold truncate">{resource.title}</h4>
                                        </div>
                                        <a
                                            href={resource.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary flex items-center space-x-1 text-sm py-2 px-4 whitespace-nowrap flex-shrink-0"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Start</span>
                                        </a>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningResources;
