import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyEducation = { degree: '', institution: '', year: '', description: '' };
const emptyExperience = { title: '', company: '', duration: '', description: '' };
const emptyProject = { name: '', description: '', technologies: '' };

const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition';
const labelClass =
    'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide';

const ResumeForm = ({ data, onChange }) => {
    const update = (section, value) => {
        onChange({ ...data, [section]: value });
    };

    const updatePersonal = (field, value) => {
        update('personalInfo', { ...data.personalInfo, [field]: value });
    };

    const addEntry = (section, empty) => {
        update(section, [...(data[section] || []), { ...empty }]);
    };

    const removeEntry = (section, index) => {
        const arr = [...(data[section] || [])];
        arr.splice(index, 1);
        update(section, arr);
    };

    const updateEntry = (section, index, field, value) => {
        const arr = [...(data[section] || [])];
        arr[index] = { ...arr[index], [field]: value };
        update(section, arr);
    };

    /* Skills – inline editable */
    const addSkill = () => {
        update('skills', [...(data.skills || []), '']);
    };

    const updateSkill = (index, value) => {
        const arr = [...(data.skills || [])];
        arr[index] = value;
        update('skills', arr);
    };

    const removeSkill = (index) => {
        const arr = [...(data.skills || [])];
        arr.splice(index, 1);
        update('skills', arr);
    };

    /* Certifications – inline editable */
    const addCert = () => {
        update('certifications', [...(data.certifications || []), '']);
    };

    const updateCert = (index, value) => {
        const arr = [...(data.certifications || [])];
        arr[index] = value;
        update('certifications', arr);
    };

    const removeCert = (index) => {
        const arr = [...(data.certifications || [])];
        arr.splice(index, 1);
        update('certifications', arr);
    };

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <section>
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs">👤</span>
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input className={inputClass} placeholder="John Doe" value={data.personalInfo?.name || ''} onChange={(e) => updatePersonal('name', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input className={inputClass} type="email" placeholder="john@example.com" value={data.personalInfo?.email || ''} onChange={(e) => updatePersonal('email', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input className={inputClass} placeholder="+1 234 567 8900" value={data.personalInfo?.phone || ''} onChange={(e) => updatePersonal('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input className={inputClass} placeholder="linkedin.com/in/johndoe" value={data.personalInfo?.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>GitHub</label>
                        <input className={inputClass} placeholder="github.com/johndoe" value={data.personalInfo?.github || ''} onChange={(e) => updatePersonal('github', e.target.value)} />
                    </div>
                </div>
                <div className="mt-3">
                    <label className={labelClass}>Professional Summary</label>
                    <textarea className={inputClass + ' min-h-[80px]'} placeholder="Brief overview of your professional background..." value={data.personalInfo?.summary || ''} onChange={(e) => updatePersonal('summary', e.target.value)} />
                </div>
            </section>

            {/* Education */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">🎓</span>
                        Education
                    </h3>
                    <button onClick={() => addEntry('education', emptyEducation)} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Plus className="w-4 h-4" /> <span>Add</span>
                    </button>
                </div>
                <AnimatePresence>
                    {(data.education || []).map((entry, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-3 mb-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative">
                            <button onClick={() => removeEntry('education', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <input className={inputClass} placeholder="Degree" value={entry.degree} onChange={(e) => updateEntry('education', i, 'degree', e.target.value)} />
                                <input className={inputClass} placeholder="Institution" value={entry.institution} onChange={(e) => updateEntry('education', i, 'institution', e.target.value)} />
                                <input className={inputClass} placeholder="Year" value={entry.year} onChange={(e) => updateEntry('education', i, 'year', e.target.value)} />
                            </div>
                            <textarea className={inputClass + ' min-h-[50px]'} placeholder="Description (optional)" value={entry.description || ''} onChange={(e) => updateEntry('education', i, 'description', e.target.value)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* Experience */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs">💼</span>
                        Experience
                    </h3>
                    <button onClick={() => addEntry('experience', emptyExperience)} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Plus className="w-4 h-4" /> <span>Add</span>
                    </button>
                </div>
                <AnimatePresence>
                    {(data.experience || []).map((entry, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-3 mb-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative">
                            <button onClick={() => removeEntry('experience', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <input className={inputClass} placeholder="Job Title" value={entry.title} onChange={(e) => updateEntry('experience', i, 'title', e.target.value)} />
                                <input className={inputClass} placeholder="Company" value={entry.company} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} />
                                <input className={inputClass} placeholder="Duration" value={entry.duration} onChange={(e) => updateEntry('experience', i, 'duration', e.target.value)} />
                            </div>
                            <textarea className={inputClass + ' min-h-[60px]'} placeholder="Description..." value={entry.description} onChange={(e) => updateEntry('experience', i, 'description', e.target.value)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* Projects */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs">🚀</span>
                        Projects
                    </h3>
                    <button onClick={() => addEntry('projects', emptyProject)} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Plus className="w-4 h-4" /> <span>Add</span>
                    </button>
                </div>
                <AnimatePresence>
                    {(data.projects || []).map((entry, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-3 mb-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative">
                            <button onClick={() => removeEntry('projects', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                <input className={inputClass} placeholder="Project Name" value={entry.name} onChange={(e) => updateEntry('projects', i, 'name', e.target.value)} />
                                <input className={inputClass} placeholder="Technologies (e.g. React, Node.js)" value={entry.technologies || ''} onChange={(e) => updateEntry('projects', i, 'technologies', e.target.value)} />
                            </div>
                            <textarea className={inputClass + ' min-h-[60px]'} placeholder="Description..." value={entry.description} onChange={(e) => updateEntry('projects', i, 'description', e.target.value)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* Skills */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs">🛠️</span>
                        Skills
                    </h3>
                    <button onClick={addSkill} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Plus className="w-4 h-4" /> <span>Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(data.skills || []).map((skill, i) => (
                        <div key={i} className="inline-flex items-center pl-3 pr-1 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                            <input
                                className="bg-transparent border-none focus:outline-none text-sm text-primary-700 dark:text-primary-300 w-24 min-w-0"
                                placeholder="Type skill"
                                value={skill}
                                onChange={(e) => updateSkill(i, e.target.value)}
                            />
                            <button onClick={() => removeSkill(i)} className="ml-1 p-0.5 text-primary-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Certifications */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs">📜</span>
                        Certifications
                    </h3>
                    <button onClick={addCert} className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Plus className="w-4 h-4" /> <span>Add</span>
                    </button>
                </div>
                <div className="space-y-2">
                    {(data.certifications || []).map((cert, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                className={inputClass}
                                placeholder="Certification name"
                                value={cert}
                                onChange={(e) => updateCert(i, e.target.value)}
                            />
                            <button onClick={() => removeCert(i)} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ResumeForm;
