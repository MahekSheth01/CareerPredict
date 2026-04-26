import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Star, ExternalLink, AlertCircle, TrendingUp, Search } from 'lucide-react';
import api from '../utils/api';

/**
 * Extracts a human-readable company name from a job listing URL.
 * Supports LinkedIn, Naukri, Indeed, Glassdoor, Internshala, Wellfound, and falls back to domain.
 */
const extractCompanyFromUrl = (url) => {
    if (!url || url === '#') return null;
    try {
        const { hostname, pathname } = new URL(url);
        const host = hostname.replace(/^www\./, '');
        const toTitle = (str) =>
            str.replace(/[-_+]/g, ' ')
               .replace(/\b\w/g, (c) => c.toUpperCase())
               .trim();

        // LinkedIn: /jobs/view/.../  or  /company/COMPANY-NAME/
        if (host.includes('linkedin.com')) {
            const companyMatch = pathname.match(/\/company\/([^/?#]+)/);
            if (companyMatch) return toTitle(companyMatch[1]);
            // LinkedIn job URLs don't always embed company name — fallback to domain label
            return 'LinkedIn Job';
        }

        // Naukri: job-listings-JOBTITLE-COMPANY-...
        if (host.includes('naukri.com')) {
            const parts = pathname.split('/').filter(Boolean);
            const slug = parts.find((p) => p.startsWith('job-listings-'));
            if (slug) {
                // slug format: job-listings-frontend-developer-google-india-...
                const words = slug.replace('job-listings-', '').split('-');
                // Heuristic: try to find known company words or take last meaningful segment
                return toTitle(words.slice(-3, -1).join('-')) || 'Naukri Job';
            }
            return 'Naukri Job';
        }

        // Indeed: /cmp/COMPANY-NAME/jobs or /viewjob?...
        if (host.includes('indeed.com')) {
            const companyMatch = pathname.match(/\/cmp\/([^/?#]+)/);
            if (companyMatch) return toTitle(companyMatch[1]);
            return 'Indeed Job';
        }

        // Glassdoor: /job-listing/TITLE-at-COMPANY-...
        if (host.includes('glassdoor.com')) {
            const slug = pathname.split('/').pop() || '';
            const atIdx = slug.toLowerCase().indexOf('-at-');
            if (atIdx !== -1) return toTitle(slug.slice(atIdx + 4).replace(/-\w{8,}$/, ''));
            return 'Glassdoor Job';
        }

        // Internshala: /internship/detail/TITLE-internship-at-COMPANY
        if (host.includes('internshala.com')) {
            const slug = pathname.split('/').pop() || '';
            const atIdx = slug.toLowerCase().indexOf('-at-');
            if (atIdx !== -1) return toTitle(slug.slice(atIdx + 4));
            return 'Internshala';
        }

        // Wellfound / AngelList: /company/COMPANY-NAME
        if (host.includes('wellfound.com') || host.includes('angel.co')) {
            const companyMatch = pathname.match(/\/company\/([^/?#]+)/);
            if (companyMatch) return toTitle(companyMatch[1]);
            return 'Wellfound';
        }

        // Monster, Shine, TimesJobs — extract subdomain or first path segment
        if (host.includes('monster.') || host.includes('shine.com') || host.includes('timesjobs.com')) {
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length > 1) return toTitle(parts[1]);
        }

        // Generic fallback: use domain root (e.g. "careers.google.com" → "Google")
        const domainParts = host.split('.');
        const meaningful = domainParts.find((p) => !['careers', 'jobs', 'hire', 'work', 'apply'].includes(p));
        return meaningful ? toTitle(meaningful) : toTitle(domainParts[0]);
    } catch {
        return null;
    }
};

const difficultyColor = {
    'Internship': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Entry Level': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'Mid Level': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Senior Level': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const ScoreBar = ({ score }) => {
    const color = score >= 70 ? 'from-green-500 to-emerald-500' : score >= 40 ? 'from-yellow-500 to-orange-400' : 'from-red-400 to-rose-500';
    return (
        <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Match Score</span>
                <span className="font-bold">{score}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${color} rounded-full`}
                />
            </div>
        </div>
    );
};

const JobRecommendations = () => {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topCareer, setTopCareer] = useState('');
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs/recommend');
                setJobs(data.data.recommended_jobs);
                setFiltered(data.data.recommended_jobs);
                setTopCareer(data.data.top_career);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load job recommendations.');
            }
            setLoading(false);
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let result = jobs;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(j => {
                const company = (j.company || extractCompanyFromUrl(j.job_link) || '').toLowerCase();
                return (
                    j.title.toLowerCase().includes(q) ||
                    company.includes(q) ||
                    j.required_skills.some(s => s.toLowerCase().includes(q))
                );
            });
        }
        if (levelFilter !== 'All') {
            result = result.filter(j => j.experience_level === levelFilter);
        }
        setFiltered(result);
    }, [search, levelFilter, jobs]);

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
                    <h1 className="text-4xl font-bold gradient-text mb-2">Job Recommendations</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Personalized jobs based on your predicted career: <span className="font-semibold text-primary-600">{topCareer}</span>
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                className="input-field pl-10"
                                placeholder="Search by title, company or skill..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={levelFilter}
                            onChange={e => setLevelFilter(e.target.value)}
                            className="input-field sm:w-48"
                        >
                            {['All', 'Internship', 'Entry Level', 'Mid Level', 'Senior Level'].map(l => (
                                <option key={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-primary-600' },
                        { label: 'High Match (≥70%)', value: jobs.filter(j => j.match_score >= 70).length, icon: Star, color: 'text-green-600' },
                        { label: 'Internships', value: jobs.filter(j => j.experience_level === 'Internship').length, icon: TrendingUp, color: 'text-blue-600' },
                        { label: 'Showing', value: filtered.length, icon: Search, color: 'text-purple-600' },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }} className="card text-center">
                            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Job Cards */}
                {filtered.length === 0 ? (
                    <div className="card text-center py-16">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No jobs found matching your filters.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((job, i) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="card hover:shadow-xl transition-all flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                                            {job.company || extractCompanyFromUrl(job.job_link) || 'Company'}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${difficultyColor[job.experience_level] || ''}`}>
                                        {job.experience_level}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <MapPin className="w-3 h-3" />
                                    <span>{job.location}</span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{job.job_description}</p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {job.required_skills.slice(0, 4).map(skill => (
                                        <span key={skill} className={`text-xs px-2 py-1 rounded-full ${job.matched_skills?.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                            {skill}
                                        </span>
                                    ))}
                                    {job.required_skills.length > 4 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">+{job.required_skills.length - 4}</span>
                                    )}
                                </div>

                                <ScoreBar score={job.match_score} />

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <a
                                        href={job.job_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary w-full flex items-center justify-center space-x-2 text-sm py-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Apply Now</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRecommendations;
