import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BarChart3, Award, TrendingUp, Search, Filter,
    ChevronLeft, ChevronRight, Eye, UserCheck, UserX,
    Calendar, BookOpen, Target, Activity, PieChart
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line,
    Legend, CartesianGrid
} from 'recharts';
import api from '../utils/api';

const COLORS = ['#8b5cf6', '#d946ef', '#f472b6', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#60a5fa', '#a78bfa'];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, usersRes, assessmentsRes] = await Promise.all([
                api.get('/careers/analytics/dashboard'),
                api.get('/careers/users/all'),
                api.get('/assessments'),
            ]);
            setAnalytics(analyticsRes.data.data);
            setUsers(usersRes.data.data);
            setAssessments(assessmentsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const toggleUserStatus = async (userId) => {
        try {
            await api.patch(`/careers/users/${userId}/toggle-status`);
            fetchData();
        } catch (error) {
            alert('Error updating user status');
        }
    };

    // Filter and paginate users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    const careerData = analytics?.careerDistribution
        ? Object.entries(analytics.careerDistribution).map(([name, value]) => ({ name, value }))
        : [];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'assessments', label: 'Assessments', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
    ];

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage users, view analytics, and monitor assessments</p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="card-glass p-2 flex space-x-2 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab key="overview" analytics={analytics} careerData={careerData} />
                    )}
                    {activeTab === 'users' && (
                        <UsersTab
                            key="users"
                            users={currentUsers}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            toggleUserStatus={toggleUserStatus}
                            totalUsers={filteredUsers.length}
                        />
                    )}
                    {activeTab === 'assessments' && (
                        <AssessmentsTab key="assessments" assessments={assessments} />
                    )}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab key="analytics" analytics={analytics} assessments={assessments} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ analytics, careerData }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
    >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                icon={Users}
                label="Total Users"
                value={analytics?.totalUsers || 0}
                color="primary"
                delay={0}
            />
            <StatCard
                icon={BookOpen}
                label="Assessments"
                value={analytics?.totalAssessments || 0}
                color="secondary"
                delay={0.1}
            />
            <StatCard
                icon={TrendingUp}
                label="Avg Readiness"
                value={`${analytics?.averageReadiness || 0}%`}
                color="green"
                delay={0.2}
            />
            <StatCard
                icon={Award}
                label="Top Skill"
                value={analytics?.topSkills?.[0]?.skill || 'N/A'}
                color="yellow"
                delay={0.3}
                isText
            />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            <ChartCard title="Career Distribution" delay={0.4}>
                <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                        <Pie
                            data={careerData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {careerData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </RePieChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top 5 Skills" delay={0.5}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.topSkills?.slice(0, 5) || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    </motion.div>
);

// Users Tab Component
const UsersTab = ({ users, searchQuery, setSearchQuery, currentPage, setCurrentPage, totalPages, toggleUserStatus, totalUsers }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
    >
        <div className="card-glass mb-6">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">User Management</h2>
                        <p className="text-gray-600 dark:text-gray-400">{totalUsers} total users</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">User</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Email</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Role</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Verified</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${user.isActive
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                        }`}>
                                        {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                        <span>{user.isActive ? 'Active' : 'Disabled'}</span>
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isVerified
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                        }`}>
                                        {user.isVerified ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => toggleUserStatus(user._id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${user.isActive
                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                            }`}
                                    >
                                        {user.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-6 border-t dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </motion.div>
);

// Assessments Tab Component
const AssessmentsTab = ({ assessments }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
    >
        <div className="card-glass">
            <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-1">Assessment Submissions</h2>
                <p className="text-gray-600 dark:text-gray-400">{assessments.length} total assessments</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">User</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Submission Date</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Readiness Score</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Top Career</th>
                            <th className="text-left py-4 px-6 font-semibold text-sm text-gray-600 dark:text-gray-400">Skills</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {assessments.map((assessment, index) => (
                            <motion.tr
                                key={assessment._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-4 px-6 font-medium">{assessment.userId?.name || 'Unknown'}</td>
                                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                    {assessment.predictionResult?.predictedAt
                                        ? new Date(assessment.predictionResult.predictedAt).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${(assessment.predictionResult?.readinessScore || 0) >= 70
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : (assessment.predictionResult?.readinessScore || 0) >= 50
                                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                        }`}>
                                        {assessment.predictionResult?.readinessScore || 0}
                                    </span>
                                </td>
                                <td className="py-4 px-6 font-medium text-primary-600 dark:text-primary-400">
                                    {assessment.predictionResult?.topCareers?.[0]?.careerName || 'N/A'}
                                </td>
                                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                    {(assessment.technicalSkills?.length || 0) + (assessment.softSkills?.length || 0)}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {assessments.length === 0 && (
                <div className="p-12 text-center">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No assessments submitted yet</p>
                </div>
            )}
        </div>
    </motion.div>
);

// Analytics Tab Component
const AnalyticsTab = ({ analytics, assessments }) => {
    const readinessDistribution = assessments.reduce((acc, a) => {
        const score = a.predictionResult?.readinessScore || 0;
        const range = score >= 80 ? '80-100' : score >= 60 ? '60-80' : score >= 40 ? '40-60' : '0-40';
        acc[range] = (acc[range] || 0) + 1;
        return acc;
    }, {});

    const readinessData = Object.entries(readinessDistribution).map(([range, count]) => ({
        range,
        count
    }));

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            <div className="grid md:grid-cols-2 gap-8">
                <ChartCard title="Readiness Score Distribution" delay={0}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={readinessData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Assessment Stats" delay={0.2}>
                    <div className="space-y-6 p-4">
                        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                                <p className="text-3xl font-bold text-primary-600">{assessments.length}</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-primary-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {analytics?.averageReadiness || 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Top Skill</p>
                                <p className="text-xl font-bold text-yellow-600">
                                    {analytics?.topSkills?.[0]?.skill || 'N/A'}
                                </p>
                            </div>
                            <Award className="w-12 h-12 text-yellow-600" />
                        </div>
                    </div>
                </ChartCard>
            </div>
        </motion.div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, delay, isText = false }) => {
    const colorClasses = {
        primary: 'from-primary-600 to-primary-700',
        secondary: 'from-secondary-600 to-secondary-700',
        green: 'from-green-600 to-green-700',
        yellow: 'from-yellow-600 to-yellow-700',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="card-glass overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                <p className={`${isText ? 'text-2xl' : 'text-4xl'} font-bold gradient-text`}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
};

// Reusable Chart Card Component
const ChartCard = ({ title, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="card-glass"
    >
        <div className="p-6">
            <h3 className="text-xl font-bold mb-6">{title}</h3>
            {children}
        </div>
    </motion.div>
);

export default AdminDashboard;
