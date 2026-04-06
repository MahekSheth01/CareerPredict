import { motion } from 'framer-motion';
import {
    Users, UserCheck, UserX, ShieldCheck, BookOpen,
    FileText, Briefcase, FolderGit2, BookMarked, Database, AlertTriangle
} from 'lucide-react';
import { StatCard, Card } from './AdminUI';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function SystemTab({ systemStats }) {
    const s = systemStats || {};

    const verifiedPct = s.totalUsers > 0 ? Math.round((s.verifiedUsers / s.totalUsers) * 100) : 0;
    const activePct = s.totalUsers > 0 ? Math.round((s.activeUsers / s.totalUsers) * 100) : 0;
    const completionPct = s.assessmentCompletionRate || 0;

    const radialData = [
        { name: 'Verified', value: verifiedPct, fill: '#8b5cf6' },
        { name: 'Active', value: activePct, fill: '#10b981' },
        { name: 'Completion Rate', value: completionPct, fill: '#f59e0b' },
    ];

    const tooltipStyle = {
        backgroundColor: 'rgba(15,15,30,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: 12,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={s.totalUsers || 0} sub={`${s.newUsersThisMonth || 0} this month`} color="purple" delay={0} />
                <StatCard icon={BookOpen} label="Total Assessments" value={s.totalAssessments || 0} sub={`${s.newAssessmentsThisMonth || 0} this month`} color="blue" delay={0.05} />
                <StatCard icon={FileText} label="Total Resumes" value={s.totalResumes || 0} color="pink" delay={0.1} />
                <StatCard icon={Database} label="Content Items" value={(s.totalJobs || 0) + (s.totalProjects || 0) + (s.totalResources || 0)} sub="Jobs + Projects + Resources" color="teal" delay={0.15} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Radial health gauge */}
                <Card title="Platform Health Metrics" delay={0.1}>
                    <div className="p-4 flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={220}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(100,100,120,0.1)' }} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-3 gap-4 w-full mt-2">
                            {radialData.map(d => (
                                <div key={d.name} className="text-center">
                                    <p className="text-2xl font-bold" style={{ color: d.fill }}>{d.value}%</p>
                                    <p className="text-xs text-gray-400">{d.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Collection counts */}
                <Card title="Database Collections" delay={0.15}>
                    <div className="p-5 space-y-3">
                        {[
                            { icon: Users, label: 'Total Users', value: s.totalUsers, sub: `${s.totalStudents} students, ${s.totalAdmins} admins`, color: 'text-violet-600' },
                            { icon: UserCheck, label: 'Active Users', value: s.activeUsers, color: 'text-emerald-600' },
                            { icon: UserX, label: 'Inactive Users', value: s.inactiveUsers, color: 'text-red-500' },
                            { icon: ShieldCheck, label: 'Verified Users', value: s.verifiedUsers, color: 'text-blue-600' },
                            { icon: BookOpen, label: 'Assessments', value: s.totalAssessments, color: 'text-cyan-600' },
                            { icon: Briefcase, label: 'Jobs Listed', value: s.totalJobs, color: 'text-orange-600' },
                            { icon: FolderGit2, label: 'Projects', value: s.totalProjects, color: 'text-pink-600' },
                            { icon: BookMarked, label: 'Resources', value: s.totalResources, color: 'text-teal-600' },
                        ].map(({ icon: Icon, label, value, sub, color }) => (
                            <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                                <div className="flex items-center gap-2">
                                    <Icon className={`w-4 h-4 ${color}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                                    {sub && <span className="text-xs text-gray-400 hidden md:block">({sub})</span>}
                                </div>
                                <span className={`font-bold text-base ${color}`}>{value ?? '—'}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Unverified users alert */}
            {s.unverifiedUsers > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <span className="font-semibold">{s.unverifiedUsers}</span> users have not verified their email yet.
                    </p>
                </div>
            )}
        </motion.div>
    );
}
