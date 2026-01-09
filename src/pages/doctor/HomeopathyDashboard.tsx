import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Clock, Video, Activity, Sparkles, Flower2, Pill, Search } from 'lucide-react';
import { AddPatientModal } from '../../components/doctor/AddPatientModal';
import { AppointmentCard } from '../../components/doctor/AppointmentCard';
import type { Appointment } from '../../components/doctor/AppointmentCard';
import { PatientListRow } from '../../components/doctor/PatientListRow';
import type { Patient } from '../../components/doctor/PatientListRow';
import { io } from 'socket.io-client';
import api from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

const socket = io('http://localhost:5000');

// Mock Data for Homeopathy
const generateMockAppointments = (): Appointment[] => [
    {
        id: 'h1',
        patientName: 'Suresh Raina',
        patientId: 'P-301',
        time: '11:00 AM',
        type: 'Video Consult',
        status: 'Confirmed',
        condition: 'Chronic Migraine',
        homeopathy: {
            caseType: 'Follow-up',
            lastRemedy: 'Belladonna 200C',
            potencyReviewDue: true,
            daysSinceLastConsult: 14
        }
    },
    {
        id: 'h2',
        patientName: 'Meera Iyer',
        patientId: 'P-302',
        time: '11:45 AM',
        type: 'OPD Visit',
        status: 'Waiting',
        condition: 'Psoriasis',
        homeopathy: {
            caseType: 'Chronic',
            lastRemedy: 'Sulphur 1M'
        }
    }
];

const generateMockPatients = (): Patient[] => [
    {
        id: 'P-401',
        name: 'Arjun Das',
        age: 12,
        gender: 'M',
        lastVisit: '1 month ago',
        condition: 'Allergic Rhinitis',
        homeopathy: {
            constitution: 'Phosphorus',
            improvementRate: 75
        }
    },
    {
        id: 'P-402',
        name: 'Kavita Singh',
        age: 34,
        gender: 'F',
        lastVisit: '3 weeks ago',
        condition: 'Anxiety',
        homeopathy: {
            constitution: 'Ignatia',
            improvementRate: 40
        }
    }
];

const HomeopathyDashboard = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [appointments] = useState<Appointment[]>(generateMockAppointments());
    const [patients] = useState<Patient[]>(generateMockPatients());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/dashboard/homeopathy');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.warn("Using fallback stats due to API error/missing endpoint", error);
                setData({
                    consultations: { today: 8, avg_duration: '45 mins' },
                    remedy_stats: { top_remedy: 'Nux Vomica', effectiveness: 82, cases_treated: 12 },
                    insights: [{ id: 1, text: '3 patients showing similar aggravation patterns this week.' }]
                });
                setLoading(false);
            }
        };

        fetchData();

        socket.on('dashboard:update', (update: any) => {
            if (update.type === 'HOMEOPATHY_UPDATE') {
                setData((prev: any) => ({
                    ...prev,
                    remedy_stats: update.data
                }));
            }
        });

        return () => {
            socket.off('dashboard:update');
        };
    }, []);

    return (
        <DashboardLayout role="doctor" doctorType="homeopathy" title={t('hero_title')}>
            {loading || !data ? (
                <div className="flex items-center justify-center h-[60vh] text-gray-500 animate-pulse">
                    Loading Practice Insights...
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Consultations */}
                        <Card color="#5227FF" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Consultations Today</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{data.consultations.today}</h3>
                                <p className="text-sm text-blue-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Avg Duration: {data.consultations.avg_duration}
                                </p>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                    <span>Case Resolution Rate</span>
                                    <span>82%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-pink-500 transition-all duration-500" style={{ width: `82%` }} />
                                </div>
                            </div>
                        </Card>

                        {/* Remedy Effectiveness */}
                        <Card color="#ec4899" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Flower2 className="w-12 h-12 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Top Remedy Today</p>
                                <h3 className="text-2xl font-bold text-white mb-2 truncate" title={data.remedy_stats.top_remedy}>
                                    {data.remedy_stats.top_remedy}
                                </h3>
                                <p className="text-sm text-pink-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {data.remedy_stats.effectiveness}% Eff. in {data.remedy_stats.cases_treated} cases
                                </p>
                            </div>
                        </Card>

                        <Card color="#a855f7" className="bg-gradient-to-br from-purple-900/20 to-slate-900">
                            <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> {t('practice_intelligence')}
                            </h4>
                            {data.insights.map((insight: any) => (
                                <p key={insight.id} className="text-purple-100 text-sm leading-relaxed">
                                    {insight.text}
                                </p>
                            ))}
                            <div className="mt-4">
                                <Button size="sm" variant="outline" className="text-purple-300 border-purple-500/30 hover:bg-purple-500/10 w-full">
                                    View Analysis
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Appointments */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-end">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Flower2 className="w-5 h-5 text-pink-400" />
                                    {t('daily_schedule')}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-pink-400 hover:text-pink-300"
                                    onClick={() => navigate('/doctor/homeopathy/schedule')}
                                >
                                    Detailed Schedule
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appointments.map(apt => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        doctorType="homeopathy"
                                        onStart={() => navigate('/doctor/homeopathy/consultations')}
                                        onViewProfile={(id) => navigate(`/doctor/patient/${id}`)}
                                    />
                                ))}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-white mb-4">Patient Improvements</h2>
                                <div className="space-y-3">
                                    {patients.map(patient => (
                                        <PatientListRow
                                            key={patient.id}
                                            patient={patient}
                                            doctorType="homeopathy"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Actions */}
                        <div className="space-y-4">
                            <Card color="#ec4899" className="p-4">
                                <h3 className="text-sm font-semibold text-pink-300 mb-3 flex items-center gap-2">
                                    <Search className="w-4 h-4" /> {t('repertory_search')}
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Type symptoms (e.g. burning pain)..."
                                    className="w-full bg-black/30 border border-slate-700 rounded p-2 text-sm text-white mb-2 focus:border-pink-500 outline-none"
                                />
                                <Button className="w-full" size="sm" variant="secondary">Find Remedy</Button>
                            </Card>

                            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                            <Card className="p-4 space-y-3">
                                <Button className="w-full justify-start" variant="outline">
                                    <Pill className="w-4 h-4 mr-2" /> Renew Prescription
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Video className="w-4 h-4 mr-2" /> Tele-Consult
                                </Button>
                            </Card>
                        </div>
                    </div>
                </>
            )}
            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                doctorType="homeopathy"
            />
        </DashboardLayout>
    );
};

export default HomeopathyDashboard;
