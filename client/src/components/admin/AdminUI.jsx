// Shared UI Primitives for Admin MIS Dashboard
import { motion } from 'framer-motion';

export const COLORS = ['#8b5cf6','#d946ef','#f472b6','#fb923c','#facc15','#4ade80','#22d3ee','#60a5fa','#a78bfa','#34d399'];

export const StatCard = ({ icon: Icon, label, value, sub, color = 'purple', delay = 0 }) => {
    const gradients = {
        purple: 'from-violet-600 to-purple-700',
        pink: 'from-pink-500 to-rose-600',
        blue: 'from-blue-500 to-cyan-600',
        green: 'from-emerald-500 to-green-600',
        orange: 'from-orange-500 to-amber-600',
        red: 'from-red-500 to-rose-600',
        indigo: 'from-indigo-500 to-violet-600',
        teal: 'from-teal-500 to-cyan-600',
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradients[color]} opacity-10 rounded-full -mr-8 -mt-8`} />
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${gradients[color]}`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
        </motion.div>
    );
};

export const Card = ({ title, children, className = '', delay = 0, action }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm ${className}`}
    >
        {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                {action}
            </div>
        )}
        {children}
    </motion.div>
);

export const Badge = ({ children, variant = 'gray' }) => {
    const v = {
        gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${v[variant]}`}>{children}</span>;
};

export const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 animate-pulse border border-gray-100 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
);

export const ScoreBadge = ({ score }) => {
    if (score >= 70) return <Badge variant="green">{score}</Badge>;
    if (score >= 40) return <Badge variant="yellow">{score}</Badge>;
    return <Badge variant="red">{score}</Badge>;
};

export const TableHeader = ({ cols }) => (
    <thead>
        <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            {cols.map(c => (
                <th key={c} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                    {c}
                </th>
            ))}
        </tr>
    </thead>
);

export const Avatar = ({ name, size = 8 }) => {
    const colors = ['from-violet-500 to-purple-600','from-pink-500 to-rose-500','from-blue-500 to-cyan-500','from-emerald-500 to-green-500','from-orange-400 to-amber-500'];
    const idx = name?.charCodeAt(0) % colors.length || 0;
    return (
        <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {name?.charAt(0).toUpperCase() || '?'}
        </div>
    );
};

export const exportCSV = (data, filename) => {
    if (!data?.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};
