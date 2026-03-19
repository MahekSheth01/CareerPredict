import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

const ATSScoreCard = ({ data, onClose }) => {
    if (!data) return null;

    const {
        atsScore = 0,
        predictedCareer = '',
        matchedSkills = [],
        missingSkills = [],
        optimizationSuggestions = [],
    } = data;

    // Circular progress parameters
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (atsScore / 100) * circumference;

    const scoreColor =
        atsScore >= 75
            ? '#10b981'
            : atsScore >= 50
                ? '#f59e0b'
                : '#ef4444';

    const scoreLabel =
        atsScore >= 75
            ? 'Excellent'
            : atsScore >= 50
                ? 'Good'
                : 'Needs Work';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">ATS Compatibility Score</h3>
                    <p className="text-primary-100 text-sm">
                        vs. {predictedCareer || 'Your Predicted Career'}
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white text-xl font-bold transition-colors"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="p-6 space-y-6">
                {/* Score Circle */}
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 shrink-0">
                        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                            {/* Background ring */}
                            <circle
                                cx="64" cy="64" r={radius}
                                fill="none"
                                stroke="currentColor"
                                className="text-gray-200 dark:text-gray-700"
                                strokeWidth="8"
                            />
                            {/* Progress ring */}
                            <motion.circle
                                cx="64" cy="64" r={radius}
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                className="text-3xl font-bold"
                                style={{ color: scoreColor }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {atsScore}%
                            </motion.span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {scoreLabel}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4" />
                            <span><strong>{matchedSkills.length}</strong> skills matched</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span><strong>{missingSkills.length}</strong> skills missing</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Target: {predictedCareer}</span>
                        </div>
                    </div>
                </div>

                {/* Matched Skills */}
                {matchedSkills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            ✅ Matched Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {matchedSkills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Skills */}
                {missingSkills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            ⚠️ Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {missingSkills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggestions */}
                {optimizationSuggestions.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4" />
                            Optimization Suggestions
                        </h4>
                        <ul className="space-y-1.5">
                            {optimizationSuggestions.map((s, i) => (
                                <li key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ATSScoreCard;
