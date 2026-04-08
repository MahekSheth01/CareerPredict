import { motion } from 'framer-motion';
import { Download, TrendingDown } from 'lucide-react';
import { Card, TableHeader, exportCSV } from './AdminUI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#8b5cf6','#d946ef','#f472b6','#fb923c','#facc15','#4ade80','#22d3ee','#60a5fa','#a78bfa','#34d399'];

export default function MISReportsTab({ monthly, skillGap, topCareers }) {
    const handleExportMonthly = () => exportCSV(
        (monthly || []).map(m => ({ Month: m.month, 'New Users': m.users, 'New Assessments': m.assessments })),
        'monthly_summary.csv'
    );

    const handleExportCareers = () => exportCSV(
        (topCareers || []).map(c => ({
            Career: c.career,
            'Top Picks': c.topPicks,
            'Total Matches': c.totalMatches,
            'Avg Probability': c.avgProbability,
        })),
        'top_careers_report.csv'
    );

    const tooltipStyle = {
        backgroundColor: 'rgba(15,15,30,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: 12,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Monthly Summary Table */}
            <Card title="Monthly Summary Report"
                action={
                    <button onClick={handleExportMonthly} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                        <Download className="w-3 h-3" /> Export CSV
                    </button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <TableHeader cols={['Month','New Users','Assessments','Cumulative Users']} />
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {(monthly || []).map((m, i) => {
                                const cumulative = (monthly || []).slice(0, i + 1).reduce((s, r) => s + r.users, 0);
                                return (
                                    <tr key={m.month} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-200">{m.month}</td>
                                        <td className="px-5 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="inline-block w-20 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                    <span className="block h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, (m.users / 15) * 100)}%` }} />
                                                </span>
                                                <span className="font-semibold text-violet-600">{m.users}</span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="inline-block w-20 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                    <span className="block h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(100, (m.assessments / 20) * 100)}%` }} />
                                                </span>
                                                <span className="font-semibold text-cyan-600">{m.assessments}</span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">{cumulative}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Skill Gap Report */}
            <Card title="Skill Gap Report by Career" action={<TrendingDown className="w-4 h-4 text-red-400" />}>
                <div className="p-5 grid gap-4">
                    {(skillGap || []).slice(0, 6).map((career, ci) => (
                        <div key={career.career} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{career.career}</h4>
                                <span className="text-xs text-gray-400">{career.totalGaps} total gaps</span>
                            </div>
                            <ResponsiveContainer width="100%" height={80}>
                                <BarChart data={career.skills} layout="vertical" barSize={10} margin={{ left: 0, right: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="skill" width={100} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {(career.skills || []).map((_, i) => <Cell key={i} fill={COLORS[ci % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                    {(!skillGap || skillGap.length === 0) && (
                        <p className="text-center text-gray-400 py-8">No skill gap data available yet.</p>
                    )}
                </div>
            </Card>

            {/* Top Careers Report */}
            <Card title="Top Careers Report"
                action={
                    <button onClick={handleExportCareers} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                        <Download className="w-3 h-3" /> Export CSV
                    </button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <TableHeader cols={['Rank','Career','Top Picks','Total Matches','Avg Probability']} />
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {(topCareers || []).map((c, i) => (
                                <tr key={c.career} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100">{c.career}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-bold text-violet-600">{c.topPicks}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">{c.totalMatches}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, c.avgProbability * 100)}%` }} />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-300">{(c.avgProbability * 100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!topCareers || topCareers.length === 0) && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No career data yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}
