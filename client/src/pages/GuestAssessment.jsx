import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, Send, Plus, X,
    AlertTriangle, Info, Lock, TrendingUp, Award,
    Target, ArrowRight, LogIn,
} from 'lucide-react';
import api from '../utils/api';

const TECHNICAL_SKILLS = ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'Cloud Computing', 'Docker', 'Kubernetes', 'Git', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'TensorFlow', 'PyTorch', 'Figma', 'Adobe XD', 'UI/UX Design', 'Cybersecurity', 'Networking', 'Linux', 'DevOps', 'CI/CD'];
const SOFT_SKILLS = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Attention to Detail', 'Presentation Skills'];

const GuestAssessment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [skillWarning, setSkillWarning] = useState('');
    const [formData, setFormData] = useState({
        technicalSkills: [],
        softSkills: [],
        interests: { coding: 3, design: 3, analytics: 3, management: 3, research: 3 },
        gpa: 7.0,
        strongSubjects: [],
        projectsCompleted: 0,
        internshipExperience: 'none',
        preferredWorkStyle: 'flexible',
    });
    const navigate = useNavigate();

    const handleNextStep = () => {
        if (step === 1) {
            if (formData.technicalSkills.length === 0) { setSkillWarning('none'); return; }
            if (formData.technicalSkills.length >= TECHNICAL_SKILLS.length) { setSkillWarning('all'); return; }
            setSkillWarning('');
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/assessments/guest', formData);
            setResults(data.data);
            setStep(5); // results step
        } catch (error) {
            alert('Error generating prediction. Please try again.');
        }
        setLoading(false);
    };

    const addCustomSkill = () => {
        const skill = customSkillInput.trim();
        if (!skill || formData.technicalSkills.includes(skill)) { setCustomSkillInput(''); return; }
        setFormData({ ...formData, technicalSkills: [...formData.technicalSkills, skill] });
        setCustomSkillInput('');
    };

    const removeSkill = (skill) => {
        setFormData({ ...formData, technicalSkills: formData.technicalSkills.filter(s => s !== skill) });
    };

    const customSkills = formData.technicalSkills.filter(s => !TECHNICAL_SKILLS.includes(s));

    // ── Results View ──────────────────────────────────────────────────────────
    if (step === 5 && results) {
        return (
            <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Your Career Predictions</h1>
                        <p className="text-gray-600 dark:text-gray-300">Based on your skills and interests</p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {[
                            { label: 'Readiness Score', value: `${results.readinessScore}%`, icon: TrendingUp, color: 'text-primary-600' },
                            { label: 'Cluster Group', value: results.clusterGroup, icon: Target, color: 'text-secondary-600' },
                            { label: 'Top Match', value: `${results.topCareers[0]?.probability}%`, icon: Award, color: 'text-yellow-600' },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="card-glass text-center">
                                <stat.icon className={`w-10 h-10 mx-auto mb-2 ${stat.color}`} />
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Career Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {results.topCareers.map((career, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="card-glass">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">#{index + 1}</span>
                                    <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{career.probability}% match</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3">{career.careerName}</h3>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${career.probability}%` }} />
                                </div>

                                {/* Roadmap locked behind login */}
                                <Link
                                    to={`/login?redirect=/roadmap/${encodeURIComponent(career.careerName)}`}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-sm font-medium"
                                >
                                    <Lock className="w-4 h-4" />
                                    View Roadmap (Login Required)
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="card-glass bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-200 dark:border-primary-800 text-center">
                        <LogIn className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-2">Unlock Your Full Career Path</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                            Create a free account to save your results, view detailed roadmaps, get job recommendations, and track your progress.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to="/signup" className="btn-primary flex items-center justify-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Create Free Account
                            </Link>
                            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2">
                                <LogIn className="w-4 h-4" /> Already have an account? Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Skill Gap */}
                    {results.skillGap && results.skillGap.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="card-glass mt-8">
                            <h2 className="text-2xl font-bold mb-6">Skill Gap Analysis</h2>
                            <div className="space-y-6">
                                {results.skillGap.slice(0, 3).map((gap, index) => (
                                    <div key={index}>
                                        <h3 className="font-semibold text-lg mb-2">{gap.career}</h3>
                                        {gap.missingSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {gap.missingSkills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
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
    }

    // ── Assessment Form ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card-glass mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold gradient-text">Free Career Assessment</h1>
                        <Link to="/login" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                            <LogIn className="w-4 h-4" /> Login to save results
                        </Link>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No account needed — get your career prediction instantly!</p>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Step {step} of 4</p>
                </motion.div>

                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass">
                    {/* Step 1 — Technical Skills */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Technical Skills</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">Select <strong>only the skills you actually know</strong>.</p>
                            <AnimatePresence>
                                {skillWarning === 'none' && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                                        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <p className="font-semibold">Please select at least one skill</p>
                                    </motion.div>
                                )}
                                {skillWarning === 'all' && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
                                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <p className="font-semibold">Select only skills you genuinely have for an accurate prediction.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{formData.technicalSkills.length} / {TECHNICAL_SKILLS.length} selected</span>
                                {formData.technicalSkills.length > 0 && (
                                    <button type="button" onClick={() => { setFormData({ ...formData, technicalSkills: [] }); setSkillWarning(''); }}
                                        className="text-xs text-red-500 hover:text-red-600 underline">Clear all</button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {TECHNICAL_SKILLS.map(skill => (
                                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.technicalSkills.includes(skill)}
                                            onChange={e => {
                                                const updated = e.target.checked ? [...formData.technicalSkills, skill] : formData.technicalSkills.filter(s => s !== skill);
                                                setFormData({ ...formData, technicalSkills: updated });
                                                setSkillWarning('');
                                            }} className="rounded" />
                                        <span className="text-sm">{skill}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                                <p className="font-medium mb-3 text-sm">➕ Add a skill not listed above</p>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={customSkillInput} onChange={e => setCustomSkillInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                                        placeholder="e.g. Flutter, Rust..." className="input-field flex-1" />
                                    <button type="button" onClick={addCustomSkill} className="btn-primary flex items-center gap-1 px-4 py-2 text-sm whitespace-nowrap">
                                        <Plus className="w-4 h-4" /><span>Add</span>
                                    </button>
                                </div>
                            </div>
                            {customSkills.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {customSkills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2 — Soft Skills & Interests */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Soft Skills & Interests</h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-medium mb-3">Soft Skills</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SOFT_SKILLS.map(skill => (
                                            <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.softSkills.includes(skill)}
                                                    onChange={e => {
                                                        const updated = e.target.checked ? [...formData.softSkills, skill] : formData.softSkills.filter(s => s !== skill);
                                                        setFormData({ ...formData, softSkills: updated });
                                                    }} className="rounded" />
                                                <span className="text-sm">{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium mb-3">Interest Levels (1-5)</p>
                                    {Object.keys(formData.interests).map(key => (
                                        <div key={key} className="mb-4">
                                            <label className="block text-sm mb-2 capitalize">{key}</label>
                                            <input type="range" min="1" max="5" value={formData.interests[key]}
                                                onChange={e => setFormData({ ...formData, interests: { ...formData.interests, [key]: parseInt(e.target.value) } })}
                                                className="w-full" />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Low</span><span className="font-bold">{formData.interests[key]}/5</span><span>High</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Academic Background */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Academic Background</h2>
                            <div>
                                <label className="block font-medium mb-2">GPA (0-10)</label>
                                <input type="number" min="0" max="10" step="0.1" value={formData.gpa}
                                    onChange={e => setFormData({ ...formData, gpa: parseFloat(e.target.value) })} className="input-field" />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Strong Subjects (comma separated)</label>
                                <input type="text" value={formData.strongSubjects.join(', ')}
                                    onChange={e => setFormData({ ...formData, strongSubjects: e.target.value.split(',').map(s => s.trim()) })}
                                    className="input-field" placeholder="Math, Physics, Computer Science" />
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Experience */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Experience & Preferences</h2>
                            <div>
                                <label className="block font-medium mb-2">Projects Completed</label>
                                <input type="number" min="0" value={formData.projectsCompleted}
                                    onChange={e => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) })} className="input-field" />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Internship Experience</label>
                                <select value={formData.internshipExperience}
                                    onChange={e => setFormData({ ...formData, internshipExperience: e.target.value })} className="input-field">
                                    <option value="none">None</option>
                                    <option value="1-3 months">1-3 months</option>
                                    <option value="3-6 months">3-6 months</option>
                                    <option value="6+ months">6+ months</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Preferred Work Style</label>
                                <select value={formData.preferredWorkStyle}
                                    onChange={e => setFormData({ ...formData, preferredWorkStyle: e.target.value })} className="input-field">
                                    <option value="remote">Remote</option>
                                    <option value="office">Office</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        <button onClick={() => setStep(step - 1)} disabled={step === 1}
                            className="btn-secondary flex items-center space-x-2 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" /><span>Previous</span>
                        </button>
                        {step < 4 ? (
                            <button onClick={handleNextStep} className="btn-primary flex items-center space-x-2">
                                <span>Next</span><ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                                <span>{loading ? 'Predicting...' : 'Get My Prediction'}</span>
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GuestAssessment;
