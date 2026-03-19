import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Plus, X, AlertTriangle, Info } from 'lucide-react';
import api from '../utils/api';

const TECHNICAL_SKILLS = ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'Cloud Computing', 'Docker', 'Kubernetes', 'Git', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'TensorFlow', 'PyTorch', 'Figma', 'Adobe XD', 'UI/UX Design', 'Cybersecurity', 'Networking', 'Linux', 'DevOps', 'CI/CD'];

const SOFT_SKILLS = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Attention to Detail', 'Presentation Skills'];

const Assessment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [skillWarning, setSkillWarning] = useState(''); // '' | 'none' | 'all'
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
    const [isRetake, setIsRetake] = useState(false);

    // Fetch existing assessment on mount
    useEffect(() => {
        const fetchExistingAssessment = async () => {
            try {
                const { data } = await api.get('/assessments/me');
                if (data.data) {
                    const existingAssessment = data.data;
                    setIsRetake(true);

                    // Pre-fill form with existing data
                    setFormData({
                        technicalSkills: existingAssessment.technicalSkills || [],
                        softSkills: existingAssessment.softSkills || [],
                        interests: existingAssessment.interests || { coding: 3, design: 3, analytics: 3, management: 3, research: 3 },
                        gpa: existingAssessment.gpa || 7.0,
                        strongSubjects: existingAssessment.strongSubjects || [],
                        projectsCompleted: existingAssessment.projectsCompleted || 0,
                        internshipExperience: existingAssessment.internshipExperience || 'none',
                        preferredWorkStyle: existingAssessment.preferredWorkStyle || 'flexible',
                    });
                }
            } catch (error) {
                // No existing assessment, that's fine - user is taking it for the first time
                console.log('No existing assessment found');
            }
        };
        fetchExistingAssessment();
    }, []);

    const handleNextStep = () => {
        if (step === 1) {
            const selected = formData.technicalSkills.length;
            if (selected === 0) {
                setSkillWarning('none');
                return;
            }
            if (selected >= TECHNICAL_SKILLS.length) {
                setSkillWarning('all');
                return;
            }
            setSkillWarning('');
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/assessments', formData);
            navigate('/dashboard');
        } catch (error) {
            alert('Error submitting assessment');
        }
        setLoading(false);
    };

    const addCustomSkill = () => {
        const skill = customSkillInput.trim();
        if (!skill) return;
        if (formData.technicalSkills.includes(skill)) {
            setCustomSkillInput('');
            return;
        }
        setFormData({ ...formData, technicalSkills: [...formData.technicalSkills, skill] });
        setCustomSkillInput('');
    };

    const removeSkill = (skill) => {
        setFormData({ ...formData, technicalSkills: formData.technicalSkills.filter((s) => s !== skill) });
    };

    // Skills added by the user that are NOT in the built-in list
    const customSkills = formData.technicalSkills.filter((s) => !TECHNICAL_SKILLS.includes(s));

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card-glass mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-4">
                        {isRetake ? 'Update Career Assessment' : 'Career Assessment'}
                    </h1>
                    {isRetake && (
                        <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                            ✨ Your previous answers have been loaded. Update any fields that have changed.
                        </p>
                    )}
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Step {step} of 4</p>
                </motion.div>

                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-glass">
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Technical Skills</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">Select <strong>only the skills you actually know</strong>. Be honest — your prediction depends on it.</p>

                            {/* Warning Banners */}
                            <AnimatePresence>
                                {skillWarning === 'none' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                                    >
                                        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Please select at least one skill</p>
                                            <p className="text-sm opacity-80">Pick the technologies you genuinely know to get an accurate career prediction.</p>
                                        </div>
                                    </motion.div>
                                )}
                                {skillWarning === 'all' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
                                    >
                                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">⚠️ This platform is for learning, not for testing</p>
                                            <p className="text-sm opacity-80">Selecting all skills will produce a meaningless prediction. Only check the skills you <em>actually</em> have — be honest with yourself!</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Skill count bar */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData.technicalSkills.length} / {TECHNICAL_SKILLS.length} selected
                                </span>
                                {formData.technicalSkills.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => { setFormData({ ...formData, technicalSkills: [] }); setSkillWarning(''); }}
                                        className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {TECHNICAL_SKILLS.map((skill) => (
                                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.technicalSkills.includes(skill)}
                                            onChange={(e) => {
                                                const updated = e.target.checked
                                                    ? [...formData.technicalSkills, skill]
                                                    : formData.technicalSkills.filter((s) => s !== skill);
                                                setFormData({ ...formData, technicalSkills: updated });
                                                // clear warning as user adjusts
                                                setSkillWarning('');
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm">{skill}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Custom skill input */}
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                                <p className="font-medium mb-3 text-sm">➕ Add a skill not listed above</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={customSkillInput}
                                        onChange={(e) => setCustomSkillInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                                        placeholder="e.g. Flutter, Rust, Solidity..."
                                        className="input-field flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomSkill}
                                        className="btn-primary flex items-center gap-1 px-4 py-2 text-sm whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Custom skill tags */}
                            {customSkills.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom skills you added:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {customSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Soft Skills & Interests</h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-medium mb-3">Soft Skills</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SOFT_SKILLS.map((skill) => (
                                            <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.softSkills.includes(skill)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, softSkills: [...formData.softSkills, skill] });
                                                        } else {
                                                            setFormData({ ...formData, softSkills: formData.softSkills.filter((s) => s !== skill) });
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium mb-3">Interest Levels (1-5)</p>
                                    {Object.keys(formData.interests).map((key) => (
                                        <div key={key} className="mb-4">
                                            <label className="block text-sm mb-2 capitalize">{key}</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={formData.interests[key]}
                                                onChange={(e) => setFormData({ ...formData, interests: { ...formData.interests, [key]: parseInt(e.target.value) } })}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Low</span>
                                                <span className="font-bold">{formData.interests[key]}/5</span>
                                                <span>High</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Academic Background</h2>
                            <div>
                                <label className="block font-medium mb-2">GPA (0-10)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={formData.gpa}
                                    onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Strong Subjects (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.strongSubjects.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, strongSubjects: e.target.value.split(',').map((s) => s.trim()) })}
                                    className="input-field"
                                    placeholder="Math, Physics, Computer Science"
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Experience & Preferences</h2>
                            <div>
                                <label className="block font-medium mb-2">Projects Completed</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.projectsCompleted}
                                    onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Internship Experience</label>
                                <select
                                    value={formData.internshipExperience}
                                    onChange={(e) => setFormData({ ...formData, internshipExperience: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="none">None</option>
                                    <option value="1-3 months">1-3 months</option>
                                    <option value="3-6 months">3-6 months</option>
                                    <option value="6+ months">6+ months</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Preferred Work Style</label>
                                <select
                                    value={formData.preferredWorkStyle}
                                    onChange={(e) => setFormData({ ...formData, preferredWorkStyle: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="remote">Remote</option>
                                    <option value="office">Office</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNextStep}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                            >
                                <span>{loading ? 'Submitting...' : 'Submit'}</span>
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Assessment;
