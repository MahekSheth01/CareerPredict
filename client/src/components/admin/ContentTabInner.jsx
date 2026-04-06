import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../utils/api';

const CAREER_CATEGORIES = [
    'Data Scientist', 'Backend Developer', 'Frontend Developer',
    'DevOps Engineer', 'UI/UX Designer', 'Business Analyst',
    'Cybersecurity Analyst', 'AI Engineer', 'Product Manager',
];

const EMPTY_JOB = { job_title: '', company_name: '', career_category: CAREER_CATEGORIES[0], experience_level: 'Entry Level', location: 'Remote', job_description: '', job_link: '', required_skills: [] };
const EMPTY_PROJECT = { project_title: '', career_category: CAREER_CATEGORIES[0], difficulty_level: 'Beginner', description: '', github_example: '', estimated_duration: '1-2 weeks', required_skills: [] };
const EMPTY_RESOURCE = { skill_name: '', title: '', platform: '', resource_type: 'course', link: '', is_free: true, duration: 'Self-paced' };

const Label = ({ children }) => <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{children}</label>;
const Input = ({ ...props }) => (
    <input {...props} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
);
const Select = ({ children, ...props }) => (
    <select {...props} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:outline-none">{children}</select>
);
const Textarea = ({ ...props }) => (
    <textarea {...props} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none" rows={3} />
);

export default function ContentTabInner() {
    const [activeSection, setActiveSection] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [skillInput, setSkillInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(''), 3000); };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [j, p, r] = await Promise.all([api.get('/jobs'), api.get('/projects'), api.get('/resources')]);
            setJobs(j.data.data || []);
            setProjects(p.data.data || []);
            setResources(r.data.data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const openAdd = (type) => {
        const empty = type === 'job' ? { ...EMPTY_JOB } : type === 'project' ? { ...EMPTY_PROJECT } : { ...EMPTY_RESOURCE };
        setSkillInput(''); setModal({ type, data: empty, isEdit: false });
    };
    const openEdit = (type, item) => { setSkillInput(''); setModal({ type, data: { ...item }, isEdit: true }); };
    const closeModal = () => setModal(null);
    const handleField = (field, value) => setModal(m => ({ ...m, data: { ...m.data, [field]: value } }));

    const addSkill = () => {
        const s = skillInput.trim();
        if (!s || (modal.data.required_skills || []).includes(s)) return;
        handleField('required_skills', [...(modal.data.required_skills || []), s]);
        setSkillInput('');
    };
    const removeSkill = (skill) => handleField('required_skills', modal.data.required_skills.filter(s => s !== skill));

    const handleSave = async () => {
        setSaving(true);
        try {
            const { type, data, isEdit } = modal;
            const endpoint = type === 'job' ? '/jobs' : type === 'project' ? '/projects' : '/resources';
            if (isEdit) { await api.put(`${endpoint}/${data._id}`, data); showToast('Updated successfully!'); }
            else { await api.post(endpoint, data); showToast('Created successfully!'); }
            closeModal(); fetchAll();
        } catch (e) { showToast(e.response?.data?.message || 'Save failed.', 'error'); }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const ep = deleteTarget.type === 'job' ? '/jobs' : deleteTarget.type === 'project' ? '/projects' : '/resources';
            await api.delete(`${ep}/${deleteTarget.id}`);
            showToast('Deleted!'); fetchAll();
        } catch { showToast('Delete failed.', 'error'); }
        setDeleteTarget(null);
    };

    const sections = [
        { id: 'jobs', label: '💼 Jobs', count: jobs.length },
        { id: 'projects', label: '🗂️ Projects', count: projects.length },
        { id: 'resources', label: '📚 Resources', count: resources.length },
    ];

    const thCls = "text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 bg-gray-50 dark:bg-gray-900/40";
    const tdCls = "px-4 py-3 text-sm";

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                {/* Sub-tabs */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 flex-wrap">
                    {sections.map(s => (
                        <button key={s.id} onClick={() => setActiveSection(s.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeSection === s.id ? 'bg-violet-600 text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                            {s.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSection === s.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{s.count}</span>
                        </button>
                    ))}
                    <button onClick={() => openAdd(activeSection === 'jobs' ? 'job' : activeSection === 'projects' ? 'project' : 'resource')}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add {activeSection === 'jobs' ? 'Job' : activeSection === 'projects' ? 'Project' : 'Resource'}
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Jobs */}
                        {activeSection === 'jobs' && (
                            <table className="w-full">
                                <thead><tr>
                                    {['Title','Company','Category','Level','Location','Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                    {jobs.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No jobs yet.</td></tr>
                                    : jobs.map(j => (
                                        <tr key={j._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className={`${tdCls} font-medium`}>{j.job_title}</td>
                                            <td className={`${tdCls} text-gray-500`}>{j.company_name}</td>
                                            <td className={tdCls}><span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">{j.career_category}</span></td>
                                            <td className={`${tdCls} text-gray-500`}>{j.experience_level}</td>
                                            <td className={`${tdCls} text-gray-500`}>{j.location}</td>
                                            <td className={tdCls}>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit('job', j)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDeleteTarget({ type: 'job', id: j._id })} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Projects */}
                        {activeSection === 'projects' && (
                            <table className="w-full">
                                <thead><tr>
                                    {['Title','Category','Difficulty','Duration','Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                    {projects.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No projects yet.</td></tr>
                                    : projects.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className={`${tdCls} font-medium`}>{p.project_title}</td>
                                            <td className={tdCls}><span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">{p.career_category}</span></td>
                                            <td className={tdCls}><span className={`text-xs px-2 py-0.5 rounded-full ${p.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-700' : p.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.difficulty_level}</span></td>
                                            <td className={`${tdCls} text-gray-500`}>{p.estimated_duration}</td>
                                            <td className={tdCls}>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit('project', p)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDeleteTarget({ type: 'project', id: p._id })} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Resources */}
                        {activeSection === 'resources' && (
                            <table className="w-full">
                                <thead><tr>
                                    {['Title','Skill','Platform','Type','Free?','Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                    {resources.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No resources yet.</td></tr>
                                    : resources.map(r => (
                                        <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className={`${tdCls} font-medium`}>{r.title}</td>
                                            <td className={tdCls}><span className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 px-2 py-0.5 rounded-full">{r.skill_name}</span></td>
                                            <td className={`${tdCls} text-gray-500`}>{r.platform}</td>
                                            <td className={`${tdCls} capitalize text-gray-500`}>{r.resource_type}</td>
                                            <td className={tdCls}>{r.is_free ? <span className="text-green-600 font-medium text-xs">✓ Free</span> : <span className="text-yellow-600 font-medium text-xs">Paid</span>}</td>
                                            <td className={tdCls}>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit('resource', r)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDeleteTarget({ type: 'resource', id: r._id })} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* ── Edit/Add Modal ── */}
            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={e => e.target === e.currentTarget && closeModal()}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {modal.isEdit ? 'Edit' : 'Add'} {modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}
                                </h3>
                                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                {modal.type === 'job' && (<>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label>Job Title *</Label><Input value={modal.data.job_title} onChange={e => handleField('job_title', e.target.value)} placeholder="e.g. Backend Engineer" /></div>
                                        <div><Label>Company</Label><Input value={modal.data.company_name} onChange={e => handleField('company_name', e.target.value)} placeholder="e.g. Google" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label>Career Category</Label>
                                            <Select value={modal.data.career_category} onChange={e => handleField('career_category', e.target.value)}>
                                                {CAREER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                            </Select>
                                        </div>
                                        <div><Label>Level</Label>
                                            <Select value={modal.data.experience_level} onChange={e => handleField('experience_level', e.target.value)}>
                                                {['Entry Level','Mid Level','Senior Level','Lead'].map(l => <option key={l}>{l}</option>)}
                                            </Select>
                                        </div>
                                    </div>
                                    <div><Label>Location</Label><Input value={modal.data.location} onChange={e => handleField('location', e.target.value)} placeholder="Remote / City" /></div>
                                    <div><Label>Job Link</Label><Input type="url" value={modal.data.job_link} onChange={e => handleField('job_link', e.target.value)} placeholder="https://..." /></div>
                                    <div><Label>Description</Label><Textarea value={modal.data.job_description} onChange={e => handleField('job_description', e.target.value)} /></div>
                                </>)}

                                {modal.type === 'project' && (<>
                                    <div><Label>Project Title *</Label><Input value={modal.data.project_title} onChange={e => handleField('project_title', e.target.value)} /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label>Career Category</Label>
                                            <Select value={modal.data.career_category} onChange={e => handleField('career_category', e.target.value)}>
                                                {CAREER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                            </Select>
                                        </div>
                                        <div><Label>Difficulty</Label>
                                            <Select value={modal.data.difficulty_level} onChange={e => handleField('difficulty_level', e.target.value)}>
                                                {['Beginner','Intermediate','Advanced'].map(d => <option key={d}>{d}</option>)}
                                            </Select>
                                        </div>
                                    </div>
                                    <div><Label>Duration</Label><Input value={modal.data.estimated_duration} onChange={e => handleField('estimated_duration', e.target.value)} placeholder="e.g. 1-2 weeks" /></div>
                                    <div><Label>GitHub Example</Label><Input type="url" value={modal.data.github_example} onChange={e => handleField('github_example', e.target.value)} /></div>
                                    <div><Label>Description</Label><Textarea value={modal.data.description} onChange={e => handleField('description', e.target.value)} /></div>
                                </>)}

                                {modal.type === 'resource' && (<>
                                    <div><Label>Title *</Label><Input value={modal.data.title} onChange={e => handleField('title', e.target.value)} /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label>Skill Name</Label><Input value={modal.data.skill_name} onChange={e => handleField('skill_name', e.target.value)} /></div>
                                        <div><Label>Platform</Label><Input value={modal.data.platform} onChange={e => handleField('platform', e.target.value)} placeholder="Coursera, YouTube…" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><Label>Type</Label>
                                            <Select value={modal.data.resource_type} onChange={e => handleField('resource_type', e.target.value)}>
                                                {['course','video','article','book','tutorial'].map(t => <option key={t}>{t}</option>)}
                                            </Select>
                                        </div>
                                        <div><Label>Free?</Label>
                                            <Select value={modal.data.is_free ? 'true' : 'false'} onChange={e => handleField('is_free', e.target.value === 'true')}>
                                                <option value="true">Free</option>
                                                <option value="false">Paid</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div><Label>Link</Label><Input type="url" value={modal.data.link} onChange={e => handleField('link', e.target.value)} /></div>
                                    <div><Label>Duration</Label><Input value={modal.data.duration} onChange={e => handleField('duration', e.target.value)} /></div>
                                </>)}

                                {/* Skills for job/project */}
                                {(modal.type === 'job' || modal.type === 'project') && (
                                    <div>
                                        <Label>Required Skills</Label>
                                        <div className="flex gap-2 mb-2">
                                            <Input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                placeholder="Type skill and press Enter" />
                                            <button onClick={addSkill} className="px-3 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-700 transition-colors">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(modal.data.required_skills || []).map(s => (
                                                <span key={s} className="flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-xs">
                                                    {s}
                                                    <button onClick={() => removeSkill(s)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors">
                                    {saving ? 'Saving…' : modal.isEdit ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete {deleteTarget.type}?</h3>
                            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
