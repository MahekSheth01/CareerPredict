import { motion } from 'framer-motion';
import { FileText, Star, Cpu } from 'lucide-react';
import { Card, StatCard, TableHeader, Badge } from './AdminUI';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#8b5cf6', '#22d3ee', '#f472b6'];

export default function ResumesTab({ resumeStats }) {
    const templateData = resumeStats?.templateDistribution
        ? Object.entries(resumeStats.templateDistribution).map(([name, value]) => ({ name, value }))
        : [];

    const tooltipStyle = {
        backgroundColor: 'rgba(15,15,30,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: 12,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={FileText} label="Total Resumes" value={resumeStats?.totalResumes || 0} color="purple" delay={0} />
                <StatCard icon={Star} label="Avg Skills / Resume" value={resumeStats?.avgSkillsPerResume || 0} color="blue" delay={0.1} />
                <StatCard icon={Cpu} label="Avg ATS Score" value={resumeStats?.avgAtsScore || 0} sub="out of 100" color="green" delay={0.2} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Template Distribution" delay={0.1}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={templateData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                                    {templateData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Quick Stats" delay={0.15}>
                    <div className="p-5 space-y-3">
                        {templateData.map((t, i) => (
                            <div key={t.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{t.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${(t.value / (resumeStats?.totalResumes || 1)) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 w-6 text-right">{t.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Resumes */}
            <Card title="Recent Resume Submissions">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <TableHeader cols={['Student', 'Template', 'Skills', 'ATS Score', 'Submitted']} />
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {(resumeStats?.recent || []).map((r, i) => (
                                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-5 py-3">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-100">{r.userName}</p>
                                            <p className="text-xs text-gray-400">{r.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 capitalize">
                                        <Badge variant={r.template === 'modern' ? 'purple' : r.template === 'classic' ? 'blue' : 'gray'}>{r.template}</Badge>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-violet-600">{r.skills}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${r.atsScore}%` }} />
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-300">{r.atsScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-gray-400">
                                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                </motion.tr>
                            ))}
                            {(!resumeStats?.recent?.length) && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No resumes submitted yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}
