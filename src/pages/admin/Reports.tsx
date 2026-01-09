
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, Calendar, TrendingUp, Activity } from 'lucide-react';

const Reports = () => {
    return (
        <DashboardLayout role="admin" title="Reports & Analytics">
            {/* Toolbar */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-1">Performance Overview</h2>
                    <p className="text-gray-400 text-sm">System statistics for the last 30 days</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> This Month</Button>
                    <Button><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ReportMetric label="Total Appointments" value="8,432" change="+12.5%" trend="up" />
                <ReportMetric label="Avg. Wait Time" value="14 min" change="-2.1%" trend="down" good />
                <ReportMetric label="Patient Satisfaction" value="4.8/5" change="+0.2" trend="up" />
                <ReportMetric label="Revenue Growth" value="18%" change="+4.3%" trend="up" />
            </div>

            {/* Detailed Charts Area */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Large Chart */}
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-semibold mb-6">Patient Traffic Analysis</h3>
                    <div className="h-72 flex items-end gap-2 justify-between px-2">
                        {/* Mock Bars */}
                        {[40, 60, 45, 80, 55, 90, 70, 85, 65, 50, 75, 95].map((h, i) => (
                            <div key={i} className="w-full bg-white/5 hover:bg-primary/20 transition-colors rounded-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all duration-300 rounded-sm"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase tracking-widest">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </Card>

                {/* Side Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Department Load</h3>
                        <div className="space-y-4">
                            <LoadBar label="General Medicine" value={85} color="bg-blue-500" />
                            <LoadBar label="Ayurveda" value={60} color="bg-green-500" />
                            <LoadBar label="Homeopathy" value={45} color="bg-purple-500" />
                            <LoadBar label="Pharmacy" value={72} color="bg-orange-500" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Pro Insights</h3>
                                <p className="text-sm text-gray-400">AI-generated summary</p>
                            </div>
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Patient inflow peaks between 10 AM - 12 PM. Recommendation: Allocate 2 additional staff members to General Medicine during these hours to reduce wait times below 10 minutes.
                        </p>
                        <Button size="sm" className="mt-4 w-full" variant="outline">View Detailed Report</Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

const ReportMetric = ({ label, value, change, trend, good }: { label: string, value: string, change: string, trend: 'up' | 'down', good?: boolean }) => {
    const isPositive = (trend === 'up' && !good) || (trend === 'down' && good) || (trend === 'up' && good === undefined); // Simplified logic
    const color = isPositive ? 'text-green-400' : 'text-red-400';

    return (
        <Card className="p-5">
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold font-display">{value}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 ${color} flex items-center gap-1`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {change}
                </span>
            </div>
        </Card>
    );
}

const LoadBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-300">{label}</span>
            <span className="text-gray-500">{value}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

export default Reports;
