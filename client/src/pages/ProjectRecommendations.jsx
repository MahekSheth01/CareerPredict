import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Clock, Github, AlertCircle, Layers, Zap, Star, ExternalLink } from 'lucide-react';
import api from '../utils/api';

const difficultyConfig = {
    Beginner: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: Zap },
    Intermediate: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Star },
    Advanced: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: Layers },
};

const ProjectRecommendations = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topCareer, setTopCareer] = useState('');
    const [filter, setFilter] = useState('All');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects/recommend');
                // Backend returns recommended_projects (fixed field name)
                setProjects(data.data.recommended_projects || []);
                setTopCareer(data.data.top_career || '');
                if (data.message) setMessage(data.message);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load project recommendations.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // difficulty_level is returned by backend (not difficulty)
    const filtered = filter === 'All'
        ? projects
        : projects.filter(p => p.difficulty_level === filter);

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

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Project Recommendations</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {topCareer
                            ? <>Build your portfolio for <span className="font-semibold text-primary-600">{topCareer}</span></>
                            : message || 'Showing recommended projects based on your profile'}
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-8">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === level
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </motion.div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level, i) => {
                        const count = projects.filter(p => p.difficulty_level === level).length;
                        const cfg = difficultyConfig[level];
                        const Icon = cfg.icon;
                        return (
                            <motion.div
                                key={level}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="card text-center"
                            >
                                <Icon className="w-6 h-6 mx-auto mb-1 text-primary-600" />
                                <p className="text-2xl font-bold">{count}</p>
                                <p className="text-xs text-gray-500">{level}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="card text-center py-12">
                        <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No projects found for this filter.</p>
                    </div>
                )}

                {/* Project Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filtered.map((project, i) => {
                        const cfg = difficultyConfig[project.difficulty_level] || difficultyConfig.Beginner;
                        const Icon = cfg.icon;
                        return (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="card hover:shadow-xl transition-all flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                                            <Code className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 flex-shrink-0 ml-2 ${cfg.color}`}>
                                        <Icon className="w-3 h-3" />
                                        <span>{project.difficulty_level}</span>
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>

                                {/* Duration */}
                                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    <span>{project.estimated_duration}</span>
                                </div>

                                {/* Skills — backend field is required_skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(project.required_skills || []).map(skill => (
                                        <span
                                            key={skill}
                                            className={`text-xs px-2 py-1 rounded-full ${(project.matched_skills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase())
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                }`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Match score */}
                                {project.match_score > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Skill Match</span>
                                            <span>{project.match_score}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.match_score}%` }}
                                                transition={{ duration: 1, delay: 0.1 * i }}
                                                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <a
                                        href={project.github_example}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline w-full flex items-center justify-center space-x-2 text-sm py-2"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>View Example on GitHub</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectRecommendations;
