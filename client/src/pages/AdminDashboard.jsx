import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BookOpen, BarChart3, FileBarChart2,
    Package, FileText, Server, Menu, X, RefreshCw, LogOut
} from 'lucide-react';
import api from '../utils/api';

// Tab components
import { StatCard, Card, SkeletonCard, COLORS } from '../components/admin/AdminUI';
import UsersTab from '../components/admin/UsersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import AssessmentsTab from '../components/admin/AssessmentsTab';
import MISReportsTab from '../components/admin/MISReportsTab';
import ResumesTab from '../components/admin/ResumesTab';
import SystemTab from '../components/admin/SystemTab';

// Recharts for overview
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

// ─── Existing ContentTab (imported inline) ───────────────────────────────────
import ContentTabInner from '../components/admin/ContentTabInner';

const TABS = [
    { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
    { id: 'users',       label: 'Users',        icon: Users },
    { id: 'assessments', label: 'Assessments',  icon: BookOpen },
    { id: 'analytics',  label: 'Analytics',    icon: BarChart3 },
    { id: 'mis',        label: 'MIS Reports',  icon: FileBarChart2 },
    { id: 'content',    label: 'Content',      icon: Package },
    { id: 'resumes',    label: 'Resumes',      icon: FileText },
    { id: 'system',     label: 'System',       icon: Server },
];

const tooltipStyle = {
    backgroundColor: 'rgba(10,10,25,0.92)',
    border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: 12,
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ analytics, assessments, monthly, systemStats }) => {
    const careerData = analytics?.careerDistribution
        ? Object.entries(analytics.careerDistribution).slice(0, 5).map(([name, value]) => ({ name, value }))
        : [];

    const recentAssessments = [...(assessments || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={systemStats?.totalUsers || analytics?.totalUsers || 0}
                    sub={`+${systemStats?.newUsersThisMonth || 0} this month`} color="purple" delay={0} />
                <StatCard icon={BookOpen} label="Assessments" value={systemStats?.totalAssessments || analytics?.totalAssessments || 0}
                    sub={`+${systemStats?.newAssessmentsThisMonth || 0} this month`} color="blue" delay={0.05} />
                <StatCard icon={BarChart3} label="Avg Readiness" value={`${analytics?.averageReadiness || 0}%`}
                    sub="across all assessments" color="green" delay={0.1} />
                <StatCard icon={FileText} label="Resumes Built" value={systemStats?.totalResumes || 0}
                    sub={`${systemStats?.assessmentCompletionRate || 0}% completion rate`} color="orange" delay={0.15} />
            </div>

            {/* Charts row */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Monthly Activity (Last 12 Months)" delay={0.1}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthly || []} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                                <defs>
                                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradAssess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="users" name="Users" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradUsers)" />
                                <Area type="monotone" dataKey="assessments" name="Assessments" stroke="#22d3ee" strokeWidth={2} fill="url(#gradAssess)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Top Career Distribution" delay={0.15}>
                    <div className="p-4 flex items-center gap-4">
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie data={careerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                                    {careerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                            {careerData.map((d, i) => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{d.name}</span>
                                    <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Assessments */}
            <Card title="Recent Assessments" delay={0.2}>
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {recentAssessments.map((a, i) => {
                        const score = a.predictionResult?.readinessScore || 0;
                        const career = a.predictionResult?.topCareers?.[0]?.careerName || 'N/A';
                        const colorCls = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-yellow-600' : 'text-red-500';
                        return (
                            <motion.div key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {(a.userId?.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{a.userId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400 truncate">{career}</p>
                                </div>
                                <span className={`text-base font-bold ${colorCls}`}>{score}</span>
                                <span className="text-xs text-gray-400 w-20 text-right flex-shrink-0">
                                    {new Date(a.createdAt).toLocaleDateString('en-IN')}
                                </span>
                            </motion.div>
                        );
                    })}
                    {recentAssessments.length === 0 && (
                        <p className="text-center py-8 text-gray-400 text-sm">No assessments yet.</p>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Data states
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [skillGap, setSkillGap] = useState([]);
    const [topCareers, setTopCareers] = useState([]);
    const [resumeStats, setResumeStats] = useState(null);
    const [systemStats, setSystemStats] = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            const [anaRes, usersRes, assessRes, monthlyRes, skillGapRes, topCareersRes, resumeRes, sysRes] = await Promise.all([
                api.get('/careers/analytics/dashboard').catch(() => ({ data: { data: null } })),
                api.get('/admin/users-enriched').catch(() => ({ data: { data: [] } })),
                api.get('/assessments').catch(() => ({ data: { data: [] } })),
                api.get('/admin/monthly-summary').catch(() => ({ data: { data: [] } })),
                api.get('/admin/skill-gap').catch(() => ({ data: { data: [] } })),
                api.get('/admin/top-careers').catch(() => ({ data: { data: [] } })),
                api.get('/admin/resume-stats').catch(() => ({ data: { data: null } })),
                api.get('/admin/system-stats').catch(() => ({ data: { data: null } })),
            ]);
            setAnalytics(anaRes.data.data);
            setUsers(usersRes.data.data || []);
            setAssessments(assessRes.data.data || []);
            setMonthly(monthlyRes.data.data || []);
            setSkillGap(skillGapRes.data.data || []);
            setTopCareers(topCareersRes.data.data || []);
            setResumeStats(resumeRes.data.data);
            setSystemStats(sysRes.data.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchAll();
            setLoading(false);
        };
        init();
    }, [fetchAll]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAll();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
                {/* Sidebar skeleton */}
                <div className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4 gap-3">
                    {TABS.map((_, i) => (
                        <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
                {/* Content skeleton */}
                <div className="flex-1 p-6 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <SkeletonCard /><SkeletonCard />
                    </div>
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
            {/* ── Sidebar ── */}
            <AnimatePresence>
                {(sidebarOpen || true) && (
                    <>
                        {/* Mobile overlay */}
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-20 bg-black/50 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}
                        <motion.aside
                            initial={{ x: -260 }} animate={{ x: 0 }}
                            className={`fixed md:relative z-30 md:z-auto flex flex-col w-60 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 ${sidebarOpen ? 'flex' : 'hidden md:flex'}`}
                        >
                            {/* Brand */}
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                                        <LayoutDashboard className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">Admin MIS</span>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800">
                                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">CareerPredict</p>
                                    <p className="text-xs text-violet-500 dark:text-violet-500">{new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                                {TABS.map(tab => {
                                    const Icon = tab.icon;
                                    const active = activeTab === tab.id;
                                    return (
                                        <button key={tab.id}
                                            onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                active
                                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                                <button onClick={handleRefresh} disabled={refreshing}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh Data
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                                {TABS.find(t => t.id === activeTab)?.label}
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">CareerPredict Admin Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400">{users.length} users · {assessments.length} assessments</p>
                        </div>
                        <button onClick={handleRefresh} disabled={refreshing}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            title="Refresh">
                            <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {/* Tab content */}
                <main className="flex-1 p-5 md:p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <OverviewTab key="overview" analytics={analytics} assessments={assessments} monthly={monthly} systemStats={systemStats} />
                        )}
                        {activeTab === 'users' && (
                            <UsersTab key="users" users={users} loading={false} />
                        )}
                        {activeTab === 'assessments' && (
                            <AssessmentsTab key="assessments" assessments={assessments} />
                        )}
                        {activeTab === 'analytics' && (
                            <AnalyticsTab key="analytics" analytics={analytics} assessments={assessments} monthly={monthly} />
                        )}
                        {activeTab === 'mis' && (
                            <MISReportsTab key="mis" monthly={monthly} skillGap={skillGap} topCareers={topCareers} />
                        )}
                        {activeTab === 'content' && (
                            <ContentTabInner key="content" />
                        )}
                        {activeTab === 'resumes' && (
                            <ResumesTab key="resumes" resumeStats={resumeStats} />
                        )}
                        {activeTab === 'system' && (
                            <SystemTab key="system" systemStats={systemStats} />
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
