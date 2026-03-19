import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Upload,
    FileText,
    Download,
    Save,
    BarChart3,
    Loader2,
    Palette,
    CheckCircle,
    Eye,
    EyeOff,
    AlertCircle,
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
    personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', summary: '' },
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
};

const ResumeEditor = () => {
    const [step, setStep] = useState('upload'); // upload | edit
    const [resumeData, setResumeData] = useState(emptyResume);
    const [template, setTemplate] = useState('modern');
    const [resumeId, setResumeId] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [atsResult, setAtsResult] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState({
        upload: false,
        save: false,
        pdf: false,
        ats: false,
    });

    /* ── Upload & Extract ──────────────────────────────────────── */
    const handleFile = async (file) => {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setStatus({ type: 'error', msg: 'Only PDF files are accepted.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setStatus({ type: 'error', msg: 'File size must not exceed 5 MB.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            return;
        }

        setLoading((p) => ({ ...p, upload: true }));
        setStatus({ type: '', msg: '' });

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const { data } = await api.post('/resume-builder/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.success) {
                const parsed = data.data;
                setResumeData({
                    personalInfo: {
                        name: parsed.name || '',
                        email: parsed.email || '',
                        phone: parsed.phone || '',
                        linkedin: parsed.linkedin || '',
                        github: parsed.github || '',
                        summary: parsed.summary || '',
                    },
                    education: (parsed.education || []).map((e) =>
                        typeof e === 'string'
                            ? { degree: e, institution: '', year: '', description: '' }
                            : { degree: e.degree || '', institution: e.institution || '', year: e.year || '', description: e.description || '' },
                    ),
                    skills: parsed.skills || [],
                    projects: (parsed.projects || []).map((p) =>
                        typeof p === 'string'
                            ? { name: p, description: '', technologies: '' }
                            : { name: p.name || '', description: p.description || '', technologies: p.technologies || '' },
                    ),
                    experience: (parsed.experience || []).map((e) =>
                        typeof e === 'string'
                            ? { title: e, company: '', duration: '', description: '' }
                            : { title: e.title || '', company: e.company || '', duration: e.duration || '', description: e.description || '' },
                    ),
                    certifications: parsed.certifications || [],
                });
                setStep('edit');
                setStatus({ type: 'success', msg: 'Resume parsed successfully! Review and edit below.' });
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || 'Failed to extract resume data.',
            });
        } finally {
            setLoading((p) => ({ ...p, upload: false }));
            setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFile(file);
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
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
            a.download = `${resumeData.personalInfo?.name || 'resume'}_edited.pdf`;
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

    /* ── Upload View ───────────────────────────────────────────── */
    if (step === 'upload') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-primary-600" />
                            Resume Editor
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Upload your existing resume to extract, edit, and optimize it
                        </p>
                    </motion.div>

                    {/* Status */}
                    {status.msg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'error'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                }`}
                        >
                            {status.msg}
                        </motion.div>
                    )}

                    {/* Upload Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={onDrop}
                    >
                        {loading.upload ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                                <p className="text-gray-600 dark:text-gray-300 font-medium">
                                    Extracting resume content…
                                </p>
                                <p className="text-sm text-gray-400">
                                    Using AI-powered NLP to parse your resume
                                </p>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Drag & Drop your PDF resume here
                                </p>
                                <p className="text-sm text-gray-400 mb-4">or click to browse</p>
                                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium cursor-pointer hover:shadow-lg transition-shadow">
                                    <Upload className="w-4 h-4" />
                                    Choose PDF File
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={onFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-400">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    PDF only, max 5 MB
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* How it works */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 grid grid-cols-3 gap-4"
                    >
                        {[
                            { step: '1', title: 'Upload', desc: 'Upload your existing PDF resume' },
                            { step: '2', title: 'Edit', desc: 'Review & modify extracted content' },
                            { step: '3', title: 'Download', desc: 'Generate optimized PDF' },
                        ].map((s) => (
                            <div key={s.step} className="text-center p-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold text-sm flex items-center justify-center mx-auto mb-2">
                                    {s.step}
                                </div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.title}</p>
                                <p className="text-xs text-gray-400">{s.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    /* ── Edit View ─────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-600" />
                                Resume Editor
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Edit your parsed resume and generate an optimized version
                            </p>
                        </div>
                        <button
                            onClick={() => { setStep('upload'); setResumeData(emptyResume); setResumeId(null); setAtsResult(null); }}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            ← Upload New
                        </button>
                    </div>
                </motion.div>

                {/* Template Selector */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-primary-600" />
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Output Template
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
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
                                {template === t.id && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary-500" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
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

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleSave}
                        disabled={loading.save}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {loading.save ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {resumeId ? 'Update' : 'Save'}
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="overflow-y-auto max-h-[calc(100vh-220px)] pr-1"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <ResumeForm data={resumeData} onChange={setResumeData} />
                    </motion.div>
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="sticky top-24">
                                <TemplatePreview data={resumeData} template={template} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ATS Result */}
                {atsResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 max-w-2xl mx-auto"
                    >
                        <ATSScoreCard data={atsResult} onClose={() => setAtsResult(null)} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResumeEditor;
