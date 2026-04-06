import { motion } from 'framer-motion';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Card, COLORS } from './AdminUI';

export default function AnalyticsTab({ analytics, assessments, monthly }) {
    const careerData = analytics?.careerDistribution
        ? Object.entries(analytics.careerDistribution).map(([name, value]) => ({ name, value }))
        : [];

    const readinessBuckets = { '0–39': 0, '40–59': 0, '60–79': 0, '80–100': 0 };
    assessments.forEach(a => {
        const s = a.predictionResult?.readinessScore || 0;
        if (s < 40) readinessBuckets['0–39']++;
        else if (s < 60) readinessBuckets['40–59']++;
        else if (s < 80) readinessBuckets['60–79']++;
        else readinessBuckets['80–100']++;
    });
    const readinessData = Object.entries(readinessBuckets).map(([range, count]) => ({ range, count }));

    const skillData = (analytics?.topSkills || []).slice(0, 8);

    const clusterData = analytics?.clusterDistribution
        ? Object.entries(analytics.clusterDistribution).map(([name, value]) => ({ name, value }))
        : [];

    const chartTooltipStyle = {
        backgroundColor: 'rgba(15,15,30,0.92)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: 12,
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Monthly Trend */}
            <Card title="Monthly Registrations & Assessments (Last 12 Months)" delay={0}>
                <div className="p-4">
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={monthly || []} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Legend />
                            <Line type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="assessments" name="Assessments" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Career Distribution */}
                <Card title="Career Distribution" delay={0.1}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={careerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {careerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={chartTooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Readiness Distribution */}
                <Card title="Readiness Score Distribution" delay={0.15}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={readinessData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={chartTooltipStyle} />
                                <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                                    {readinessData.map((_, i) => <Cell key={i} fill={['#ef4444','#f59e0b','#3b82f6','#10b981'][i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Skills */}
                <Card title="Top 8 Skills Across Assessments" delay={0.2}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={skillData} layout="vertical" barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis type="category" dataKey="skill" width={110} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={chartTooltipStyle} />
                                <Bar dataKey="count" name="Users" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Cluster Distribution */}
                <Card title="Cluster Group Distribution" delay={0.25}>
                    <div className="p-4">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={clusterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                    {clusterData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={chartTooltipStyle} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
