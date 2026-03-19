import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Save,
    BarChart3,
    Palette,
    Loader2,
    CheckCircle,
    Trash2,
    Plus,
    Eye,
    EyeOff,
} from 'lucide-react';
import api from '../utils/api';
import ResumeForm from '../components/ResumeForm';
import TemplatePreview from '../components/TemplatePreview';
import ATSScoreCard from '../components/ATSScoreCard';

const TEMPLATES = [
    { id: 'modern', label: 'Modern', color: 'from-violet-500 to-purple-600', desc: 'Clean & contemporary' },
    { id: 'classic', label: 'Classic', color: 'from-blue-700 to-indigo-800', desc: 'Traditional & formal' },
    { id: 'minimal', label: 'Minimal', color: 'from-gray-500 to-gray-600', desc: 'Simple & elegant' },
];

const emptyResume = {
    personalInfo: { name: '', email: '', phone: '', linkedin: '', summary: '' },
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
};

const ResumeBuilder = () => {
    const [resumeData, setResumeData] = useState(emptyResume);
    const [template, setTemplate] = useState('modern');
    const [resumeId, setResumeId] = useState(null);
    const [savedResumes, setSavedResumes] = useState([]);
    const [showPreview, setShowPreview] = useState(true);
    const [atsResult, setAtsResult] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState({
        save: false,
        pdf: false,
        ats: false,
        list: false,
    });

    // Fetch saved resumes on mount
    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setLoading((p) => ({ ...p, list: true }));
        try {
            const { data } = await api.get('/resume-builder/my-resumes');
            if (data.success) setSavedResumes(data.data);
        } catch {
            // silent
        } finally {
            setLoading((p) => ({ ...p, list: false }));
        }
    };

    const loadResume = (resume) => {
        setResumeData({
            personalInfo: resume.personalInfo || emptyResume.personalInfo,
            education: resume.education || [],
            skills: resume.skills || [],
            projects: resume.projects || [],
            experience: resume.experience || [],
            certifications: resume.certifications || [],
        });
        setTemplate(resume.template || 'modern');
        setResumeId(resume._id);
        setAtsResult(null);
        setStatus({ type: 'info', msg: 'Resume loaded!' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
    };

    const handleNew = () => {
        setResumeData(emptyResume);
        setTemplate('modern');
        setResumeId(null);
        setAtsResult(null);
        setStatus({ type: '', msg: '' });
    };

    /* ── Save ─────────────────────────────────────────────────── */
    const handleSave = async () => {
        setLoading((p) => ({ ...p, save: true }));
        try {
            const payload = { ...resumeData, template };
            let res;
            if (resumeId) {
                res = await api.put(`/resume-builder/update/${resumeId}`, payload);
            } else {
                res = await api.post('/resume-builder/create', payload);
            }
            if (res.data.success) {
                setResumeId(res.data.data._id);
                setStatus({ type: 'success', msg: 'Resume saved!' });
                fetchResumes();
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || 'Failed to save resume.',
            });
        } finally {
            setLoading((p) => ({ ...p, save: false }));
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    /* ── PDF Download ──────────────────────────────────────────── */
    const handleDownloadPdf = async () => {
        setLoading((p) => ({ ...p, pdf: true }));
        try {
            const response = await api.post(
                '/resume-builder/generate-pdf',
                { resumeData, template },
                { responseType: 'blob' },
            );
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resumeData.personalInfo?.name || 'resume'}_resume.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setStatus({ type: 'success', msg: 'PDF downloaded!' });
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || 'Failed to generate PDF.',
            });
        } finally {
            setLoading((p) => ({ ...p, pdf: false }));
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    /* ── ATS Score ──────────────────────────────────────────────── */
    const handleAtsCheck = async () => {
        setLoading((p) => ({ ...p, ats: true }));
        try {
            const { data } = await api.post('/resume-builder/ats-score', {
                skills: resumeData.skills || [],
            });
            if (data.success) {
                setAtsResult(data.data);
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || 'Failed to check ATS score.',
            });
        } finally {
            setLoading((p) => ({ ...p, ats: false }));
        }
    };

    /* ── Delete ─────────────────────────────────────────────────── */
    const handleDelete = async (id) => {
        try {
            await api.delete(`/resume-builder/delete/${id}`);
            if (id === resumeId) handleNew();
            fetchResumes();
        } catch {
            // silent
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-600" />
                        Resume Builder
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Create a professional resume aligned with your career goals
                    </p>
                </motion.div>

                {/* Template Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-primary-600" />
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Choose Template
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-w-lg">
                        {TEMPLATES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className={`relative rounded-xl p-3 border-2 transition-all duration-200 ${template === t.id
                                        ? 'border-primary-500 shadow-lg shadow-primary-500/20 scale-[1.02]'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className={`h-2 rounded-full bg-gradient-to-r ${t.color} mb-2`} />
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {t.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t.desc}
                                </p>
                                {template === t.id && (
                                    <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Status message */}
                {status.msg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'success'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                : status.type === 'error'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            }`}
                    >
                        {status.msg}
                    </motion.div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleNew}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" /> New
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading.save}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {loading.save ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {resumeId ? 'Update' : 'Save Draft'}
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={loading.pdf}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {loading.pdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download PDF
                    </button>
                    <button
                        onClick={handleAtsCheck}
                        disabled={loading.ats}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {loading.ats ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                        ATS Score
                    </button>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium ml-auto"
                    >
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                </div>

                {/* Main Content */}
                <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl'}`}>
                    {/* Form Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="overflow-y-auto max-h-[calc(100vh-220px)] pr-1"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <ResumeForm data={resumeData} onChange={setResumeData} />
                    </motion.div>

                    {/* Preview Column */}
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="sticky top-24">
                                <TemplatePreview data={resumeData} template={template} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ATS Score Result */}
                {atsResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 max-w-2xl mx-auto"
                    >
                        <ATSScoreCard
                            data={atsResult}
                            onClose={() => setAtsResult(null)}
                        />
                    </motion.div>
                )}

                {/* Saved Resumes */}
                {savedResumes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10"
                    >
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-500" />
                            Saved Resumes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {savedResumes.map((r) => (
                                <div
                                    key={r._id}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${r._id === resumeId
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                        }`}
                                    onClick={() => loadResume(r)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                                {r.personalInfo?.name || 'Untitled Resume'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {r.template} template
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Updated {new Date(r.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(r._id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

export default ResumeBuilder;
