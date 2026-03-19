import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, CheckCircle, AlertTriangle, TrendingUp,
    Lightbulb, Clock, BarChart3, Sparkles,
} from 'lucide-react';
import api from '../utils/api';
import ResumeUpload from '../components/ResumeUpload';

const ResumeAnalyzer = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Fetch past analyses
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/resume/my-analyses');
                setHistory(data.data || []);
            } catch (err) {
                console.error('Error fetching history:', err);
            }
            setLoadingHistory(false);
        };
        fetchHistory();
    }, []);

    const handleUpload = async (file) => {
        setIsUploading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const { data } = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000,
            });

            setResult(data.data);
            // Add to history
            setHistory((prev) => [data.data, ...prev]);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to analyse resume. Please try again.',
            );
        }
        setIsUploading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBarColor = (score) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 50) return 'from-yellow-400 to-orange-500';
        return 'from-red-400 to-rose-500';
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">Resume Analyzer</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Upload your resume to find skill gaps for your predicted career
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        <span>Upload Resume</span>
                    </h2>
                    <ResumeUpload onUpload={handleUpload} isUploading={isUploading} />

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </motion.div>

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Match Score Card */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Resume Match</h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        For <span className="font-semibold text-primary-600 dark:text-primary-400">{result.predictedCareer}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-5xl font-extrabold ${getScoreColor(result.matchScore)}`}>
                                        {result.matchScore}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Match Score</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.matchScore}%` }}
                                    transition={{ duration: 1.2, ease: 'easeOut' }}
                                    className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(result.matchScore)}`}
                                />
                            </div>

                            <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Needs Improvement</span>
                                <span>Good Match</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Extracted Skills */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card"
                            >
                                <div className="flex items-center space-x-2 mb-4">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <h3 className="text-lg font-bold">Extracted Skills</h3>
                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                        {result.extractedSkills.length}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.extractedSkills.length > 0 ? (
                                        result.extractedSkills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No skills detected</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Missing Skills */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card"
                            >
                                <div className="flex items-center space-x-2 mb-4">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-lg font-bold">Missing Skills</h3>
                                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                        {result.missingSkills.length}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingSkills.length > 0 ? (
                                        result.missingSkills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-green-500 text-sm font-medium">🎉 All required skills present!</p>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Suggestions */}
                        {result.suggestions && result.suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="card"
                            >
                                <div className="flex items-center space-x-2 mb-4">
                                    <Lightbulb className="w-5 h-5 text-purple-500" />
                                    <h3 className="text-lg font-bold">Improvement Suggestions</h3>
                                </div>
                                <ul className="space-y-3">
                                    {result.suggestions.map((suggestion, i) => (
                                        <li key={i} className="flex items-start space-x-3">
                                            <TrendingUp className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                                                {suggestion}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* History */}
                {!loadingHistory && history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: result ? 0.5 : 0.2 }}
                        className="card mt-8"
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-bold">Analysis History</h3>
                        </div>
                        <div className="space-y-4">
                            {history.slice(0, 5).map((item, i) => (
                                <div
                                    key={item.id || item._id || i}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <BarChart3 className="w-5 h-5 text-primary-500" />
                                        <div>
                                            <p className="font-medium text-sm">
                                                {item.fileName || item.predictedCareer}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.predictedCareer} • {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${getScoreColor(item.matchScore)}`}>
                                        {item.matchScore}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
