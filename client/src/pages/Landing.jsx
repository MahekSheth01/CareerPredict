import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Target, TrendingUp, Award, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Send, Plus, X, AlertTriangle, Info, Lock, LogIn } from 'lucide-react';
import api from '../utils/api';

const TECHNICAL_SKILLS = ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'Cloud Computing', 'Docker', 'Git', 'AWS', 'MongoDB', 'TensorFlow', 'Figma', 'UI/UX Design', 'Cybersecurity', 'DevOps', 'CI/CD'];
const SOFT_SKILLS = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity'];

const Landing = () => {
    const assessmentRef = useRef(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [skillWarning, setSkillWarning] = useState('');
    const [formData, setFormData] = useState({
        technicalSkills: [], softSkills: [],
        interests: { coding: 3, design: 3, analytics: 3, management: 3, research: 3 },
        gpa: 7.0, strongSubjects: [], projectsCompleted: 0,
        internshipExperience: 'none', preferredWorkStyle: 'flexible',
    });

    const scrollToAssessment = () => assessmentRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleNextStep = () => {
        if (step === 1 && formData.technicalSkills.length === 0) { setSkillWarning('none'); return; }
        setSkillWarning('');
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/assessments/guest', formData);
            setResults(data.data);
            setStep(5);
        } catch { alert('Error generating prediction. Please try again.'); }
        setLoading(false);
    };

    const addCustomSkill = () => {
        const skill = customSkillInput.trim();
        if (!skill || formData.technicalSkills.includes(skill)) { setCustomSkillInput(''); return; }
        setFormData({ ...formData, technicalSkills: [...formData.technicalSkills, skill] });
        setCustomSkillInput('');
    };
    const customSkills = formData.technicalSkills.filter(s => !TECHNICAL_SKILLS.includes(s));
    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI-Powered Predictions',
            description: 'Advanced machine learning algorithms analyze your skills and interests to predict ideal career paths.',
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Skill Gap Analysis',
            description: 'Identify missing skills and get personalized recommendations to bridge the gap.',
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Personalized Roadmaps',
            description: 'Get detailed 12-month learning roadmaps tailored to your career goals.',
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Career Insights',
            description: 'Access salary data, market demand, and certification recommendations.',
        },
    ];

    const benefits = [
        'Discover your ideal career path in minutes',
        'Get expert guidance powered by AI',
        'Access curated learning resources',
        'Track your progress and readiness',
        'Join thousands of successful career switchers',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <Sparkles className="w-6 h-6 text-primary-600" />
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                    Powered by Advanced AI
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Discover Your{' '}
                                <span className="gradient-text">Perfect Career Path</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Let AI analyze your skills, interests, and experience to predict the best career opportunities for you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={scrollToAssessment} className="btn-primary flex items-center justify-center space-x-2">
                                    <span>Try Free — No Signup</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <Link to="/login" className="btn-outline flex items-center justify-center">
                                    Sign In
                                </Link>
                            </div>

                           
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="card-glass p-8 animate-float">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                            <Brain className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Top Prediction</p>
                                            <p className="font-semibold text-lg">Data Scientist</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
                                                92%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '92%' }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold gradient-text">85%</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Readiness Score</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold gradient-text">5</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Skills to Learn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Inline Guest Assessment ───────────────────────────── */}
            <section ref={assessmentRef} className="py-20 px-4 bg-white dark:bg-gray-900">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-4xl font-bold gradient-text mb-3">Try Free Career Prediction</h2>
                        <p className="text-gray-500 dark:text-gray-400">No account needed — get your AI career prediction instantly</p>
                    </motion.div>

                    {/* Results */}
                    {step === 5 && results ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                {results.topCareers.map((career, i) => (
                                    <div key={i} className="card-glass">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-primary-600">#{i + 1}</span>
                                            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{career.probability}%</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{career.careerName}</h3>
                                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                                            <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${career.probability}%` }} />
                                        </div>
                                        <Link to={`/login?redirect=/roadmap/${encodeURIComponent(career.careerName)}`}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-sm">
                                            <Lock className="w-3.5 h-3.5" /> View Roadmap
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="card-glass text-center bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-200 dark:border-primary-800">
                                <LogIn className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                                <h3 className="text-xl font-bold mb-2">Save Your Results & Unlock More</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Create a free account to access roadmaps, job recommendations, resume tools & more.</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link to="/signup" className="btn-primary flex items-center justify-center gap-2"><ArrowRight className="w-4 h-4" /> Create Free Account</Link>
                                    <button onClick={() => { setStep(1); setResults(null); setFormData({ ...formData, technicalSkills: [] }); }} className="btn-secondary">Retake Assessment</button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass">
                            {/* Progress */}
                            <div className="flex items-center space-x-2 mb-6">
                                {[1,2,3,4].map(s => <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />)}
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Step {step} of 4</p>

                            {/* Step 1 */}
                            {step === 1 && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Technical Skills</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select <strong>only skills you actually know</strong> for accurate results.</p>
                                    <AnimatePresence>
                                        {skillWarning === 'none' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm">
                                                <Info className="w-4 h-4 flex-shrink-0" /> Please select at least one skill.
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                        {TECHNICAL_SKILLS.map(skill => (
                                            <label key={skill} className="flex items-center space-x-2 cursor-pointer text-sm">
                                                <input type="checkbox" checked={formData.technicalSkills.includes(skill)}
                                                    onChange={e => { const u = e.target.checked ? [...formData.technicalSkills, skill] : formData.technicalSkills.filter(s => s !== skill); setFormData({ ...formData, technicalSkills: u }); setSkillWarning(''); }} className="rounded" />
                                                <span>{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={customSkillInput} onChange={e => setCustomSkillInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                                            placeholder="Add custom skill..." className="input-field flex-1 text-sm" />
                                        <button onClick={addCustomSkill} className="btn-primary px-3 py-2 text-sm"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    {customSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {customSkills.map(s => (
                                                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                                                    {s}<button onClick={() => setFormData({ ...formData, technicalSkills: formData.technicalSkills.filter(x => x !== s) })}><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Soft Skills & Interests</h3>
                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                        {SOFT_SKILLS.map(skill => (
                                            <label key={skill} className="flex items-center space-x-2 cursor-pointer text-sm">
                                                <input type="checkbox" checked={formData.softSkills.includes(skill)}
                                                    onChange={e => { const u = e.target.checked ? [...formData.softSkills, skill] : formData.softSkills.filter(s => s !== skill); setFormData({ ...formData, softSkills: u }); }} className="rounded" />
                                                <span>{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="font-medium mb-3 text-sm">Interest Levels (1-5)</p>
                                    {Object.keys(formData.interests).map(key => (
                                        <div key={key} className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="capitalize">{key}</span>
                                                <span className="font-bold">{formData.interests[key]}/5</span>
                                            </div>
                                            <input type="range" min="1" max="5" value={formData.interests[key]}
                                                onChange={e => setFormData({ ...formData, interests: { ...formData.interests, [key]: parseInt(e.target.value) } })} className="w-full" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Step 3 */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold mb-4">Academic Background</h3>
                                    <div>
                                        <label className="block font-medium mb-1 text-sm">GPA (0-10)</label>
                                        <input type="number" min="0" max="10" step="0.1" value={formData.gpa}
                                            onChange={e => setFormData({ ...formData, gpa: parseFloat(e.target.value) })} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1 text-sm">Strong Subjects (comma separated)</label>
                                        <input type="text" value={formData.strongSubjects.join(', ')}
                                            onChange={e => setFormData({ ...formData, strongSubjects: e.target.value.split(',').map(s => s.trim()) })}
                                            className="input-field" placeholder="Math, Physics, CS" />
                                    </div>
                                </div>
                            )}

                            {/* Step 4 */}
                            {step === 4 && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold mb-4">Experience & Preferences</h3>
                                    <div>
                                        <label className="block font-medium mb-1 text-sm">Projects Completed</label>
                                        <input type="number" min="0" value={formData.projectsCompleted}
                                            onChange={e => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) })} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1 text-sm">Internship Experience</label>
                                        <select value={formData.internshipExperience}
                                            onChange={e => setFormData({ ...formData, internshipExperience: e.target.value })} className="input-field">
                                            <option value="none">None</option>
                                            <option value="1-3 months">1-3 months</option>
                                            <option value="3-6 months">3-6 months</option>
                                            <option value="6+ months">6+ months</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1 text-sm">Preferred Work Style</label>
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
                                <button onClick={() => setStep(step - 1)} disabled={step === 1} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                {step < 4 ? (
                                    <button onClick={handleNextStep} className="btn-primary flex items-center gap-2">
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                                        {loading ? 'Predicting...' : 'Get My Prediction'} <Send className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-title gradient-text">
                            Why Choose CareerPredict?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
                            Transform your career journey with AI-powered insights
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                Start Your Career Journey Today
                            </h2>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                        <span className="text-lg">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to get started?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Join thousands of users who have discovered their perfect career path.
                            </p>
                            <Link to="/signup" className="btn-primary w-full flex items-center justify-center space-x-2">
                                <span>Create Your Account</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2026 CareerPredict. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
