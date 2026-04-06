import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
import { Card, TableHeader, Badge, ScoreBadge, Avatar, exportCSV } from './AdminUI';

export default function AssessmentsTab({ assessments }) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [careerFilter, setCareerFilter] = useState('all');
    const PER_PAGE = 15;

    const careers = [...new Set(
        assessments.map(a => a.predictionResult?.topCareers?.[0]?.careerName || '').filter(Boolean)
    )].slice(0, 10);

    const filtered = assessments.filter(a => {
        const name = a.userId?.name || '';
        const career = a.predictionResult?.topCareers?.[0]?.careerName || '';
        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || career.toLowerCase().includes(search.toLowerCase());
        const matchCareer = careerFilter === 'all' || career === careerFilter;
        return matchSearch && matchCareer;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleExport = () => exportCSV(
        filtered.map(a => ({
            Student: a.userId?.name || 'Unknown',
            'Top Career': a.predictionResult?.topCareers?.[0]?.careerName || 'N/A',
            'Readiness Score': a.predictionResult?.readinessScore || 0,
            'Cluster': a.predictionResult?.clusterGroup || 'N/A',
            'Technical Skills': (a.technicalSkills || []).join('; '),
            'Soft Skills': (a.softSkills || []).join('; '),
            'Internship': a.internshipExperience || 'none',
            'GPA': a.gpa || 0,
            'Date': new Date(a.createdAt).toLocaleDateString(),
        })),
        'assessments_export.csv'
    );

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 w-56"
                            placeholder="Search student or career…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <select value={careerFilter} onChange={e => { setCareerFilter(e.target.value); setPage(1); }}
                            className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                            <option value="all">All Careers</option>
                            {careers.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={handleExport} className="flex items-center gap-1 px-3 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <TableHeader cols={['Student','Top Career','Readiness','Cluster','Skills','Internship','Date']} />
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {paged.map((a, i) => {
                                const career = a.predictionResult?.topCareers?.[0]?.careerName || 'N/A';
                                const score = a.predictionResult?.readinessScore || 0;
                                const cluster = a.predictionResult?.clusterGroup || '—';
                                const skillCount = (a.technicalSkills?.length || 0) + (a.softSkills?.length || 0);
                                return (
                                    <motion.tr key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <Avatar name={a.userId?.name} size={7} />
                                                <span className="font-medium text-gray-800 dark:text-gray-100">{a.userId?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-violet-700 dark:text-violet-400 font-medium">{career}</span>
                                        </td>
                                        <td className="px-5 py-3.5"><ScoreBadge score={score} /></td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={cluster === 'Technical' ? 'blue' : cluster === 'Analytical' ? 'purple' : cluster === 'Creative' ? 'pink' : 'orange'}>
                                                {cluster}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-cyan-600">{skillCount}</span>
                                            <span className="text-gray-400 text-xs ml-1">skills</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={a.internshipExperience === 'none' ? 'gray' : a.internshipExperience === '6+ months' ? 'green' : 'blue'}>
                                                {a.internshipExperience || 'none'}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                            {new Date(a.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400">
                                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        No assessments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs text-gray-400">{filtered.length} records</p>
                        <div className="flex gap-2 items-center">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium">{page} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
