import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ChevronLeft, ChevronRight, UserCheck, UserX, Shield, GraduationCap, Download } from 'lucide-react';
import { Card, Badge, Avatar, TableHeader, ScoreBadge, exportCSV } from './AdminUI';

export default function UsersTab({ users, loading }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            (u.topCareer || '').toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && u.isActive) ||
            (statusFilter === 'inactive' && !u.isActive);
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleExport = () => exportCSV(
        filtered.map(u => ({
            Name: u.name, Email: u.email, Role: u.role,
            Status: u.isActive ? 'Active' : 'Inactive',
            Verified: u.verified ? 'Yes' : 'No',
            'Top Career': u.topCareer || 'N/A',
            'Readiness Score': u.readinessScore || 0,
            'Assessments': u.assessmentCount || 0,
            'Joined': new Date(u.createdAt).toLocaleDateString(),
        })),
        'users_export.csv'
    );

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <div className="p-5 flex flex-wrap gap-3 items-center justify-between border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
                            placeholder="Search name, email, career…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all','student','admin'].map(r => (
                            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${roleFilter === r ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                        <span className="w-px bg-gray-200 dark:bg-gray-600 mx-1" />
                        {['all','active','inactive'].map(s => (
                            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                        <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <TableHeader cols={['User','Role','Status','Top Career','Readiness','Assessments','Joined']} />
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {paged.map((u, i) => (
                                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={u.name} />
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-100">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge variant={u.role === 'admin' ? 'purple' : 'blue'}>
                                            {u.role === 'admin' ? <Shield className="w-3 h-3 inline mr-1" /> : <GraduationCap className="w-3 h-3 inline mr-1" />}
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge variant={u.isActive ? 'green' : 'red'}>
                                            {u.isActive ? <UserCheck className="w-3 h-3 inline mr-1" /> : <UserX className="w-3 h-3 inline mr-1" />}
                                            {u.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 max-w-[140px] truncate">{u.topCareer || '—'}</td>
                                    <td className="px-5 py-3.5"><ScoreBadge score={u.readinessScore || 0} /></td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-semibold text-violet-600 dark:text-violet-400">{u.assessmentCount || 0}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                </motion.tr>
                            ))}
                            {paged.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm px-3 py-1 font-medium">{page} / {totalPages}</span>
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
