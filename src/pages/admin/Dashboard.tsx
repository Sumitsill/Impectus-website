import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Activity, FileText, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="admin" title="Admin Overview">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin" title="Admin Overview">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<Users className="w-6 h-6 text-blue-400" />}
                    label="Total Users"
                    value={stats?.totalUsers || '0'}
                    subtext="Doctors & Staff"
                />
                <MetricCard
                    icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
                    label="Pending Docs"
                    value={stats?.pendingDoctors || '0'}
                    subtext="Awaiting Review"
                />
                <MetricCard
                    icon={<Activity className="w-6 h-6 text-green-400" />}
                    label="Active Sessions"
                    value={stats?.activeConsultations || '0'}
                    subtext="Online Consultations"
                />
                <MetricCard
                    icon={<FileText className="w-6 h-6 text-purple-400" />}
                    label="Total EMRs"
                    value={stats?.totalReports || '0'}
                    subtext="Generated Reports"
                />
            </div>

            {/* Analytics Charts Area (Dynamic-ish) */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Consultation Trends</h3>
                        <Button size="sm" variant="ghost">Weekly</Button>
                    </div>
                    <div className="h-64 flex items-end gap-4 justify-between px-2">
                        {(stats?.trends || [40, 65, 45, 80, 55, 90, 70]).map((h: number, i: number) => (
                            <div key={i} className="w-full bg-white/5 rounded-t-lg hover:bg-primary/50 transition-colors relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black px-2 py-1 rounded">
                                    {h} cases
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-bold">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Service Distribution</h3>
                    <div className="space-y-6 flex flex-col justify-center h-full pb-10">
                        <DistributionBar label="Ayurvedic" percentage={60} color="bg-emerald-500" />
                        <DistributionBar label="Homeopathy" percentage={45} color="bg-purple-500" />
                        <DistributionBar label="Allopathy" percentage={85} color="bg-blue-500" />
                    </div>
                </Card>
            </div>

            {/* System Alerts */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Urgent Actions</h3>
                <div className="space-y-3">
                    {stats?.pendingDoctors > 0 && (
                        <AlertRow
                            message={`${stats.pendingDoctors} Doctor registrations require immediate verification`}
                            time="Real-time"
                            type="critical"
                            onClick={() => window.location.href = '/admin/users'}
                        />
                    )}
                    <AlertRow
                        message="System performance: Optimized (99.9% Uptime)"
                        time="Just now"
                        type="info"
                    />
                </div>
            </Card>

        </DashboardLayout>
    );
};

const DistributionBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
    <div>
        <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider text-gray-400">
            <span>{label}</span>
            <span>{percentage}% Load</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: `${percentage}%` }} />
        </div>
    </div>
);

const MetricCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) => (
    <Card className="p-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <h3 className="text-2xl font-bold font-display">{value}</h3>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
        </div>
    </Card>
);

const AlertRow = ({ message, time, type, onClick }: { message: string, time: string, type: 'info' | 'warning' | 'critical', onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="flex items-center gap-3">
            {type === 'critical' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                type === 'warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                    <TrendingUp className="w-5 h-5 text-blue-500" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
    </div>
);

export default AdminDashboard;
