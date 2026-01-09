import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Clock, Activity, Stethoscope, Thermometer, AlertTriangle } from 'lucide-react';
import { AppointmentCard } from '../../components/doctor/AppointmentCard';
import type { Appointment } from '../../components/doctor/AppointmentCard';
import { PatientListRow } from '../../components/doctor/PatientListRow';
import type { Patient } from '../../components/doctor/PatientListRow';
import { io } from 'socket.io-client';
import api from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

const socket = io('http://localhost:5000');

// Mock Data Generators for Immediate Visualization
const generateMockAppointments = (): Appointment[] => [
    {
        id: '1',
        patientName: 'Rahul Sharma',
        patientId: 'P-101',
        time: '10:30 AM',
        type: 'Video Consult',
        status: 'In Progress',
        condition: 'High Fever & Chills',
        general: {
            priority: 'Urgent',
            vitals: { bp: '130/85', temp: '102.4°F', spo2: '98%' },
            pendingDiagnostics: true
        }
    },
    {
        id: '2',
        patientName: 'Anita Desai',
        patientId: 'P-102',
        time: '11:00 AM',
        type: 'OPD Visit',
        status: 'Waiting',
        condition: 'Hypertension Follow-up',
        general: {
            priority: 'Normal',
            vitals: { bp: '150/95', temp: '98.6°F', spo2: '99%' }
        }
    }
];

const generateMockPatients = (): Patient[] => [
    {
        id: 'P-201',
        name: 'Vikram Singh',
        age: 45,
        gender: 'M',
        lastVisit: '2 days ago',
        condition: 'Type 2 Diabetes',
        riskLevel: 'Moderate',
        adherenceScore: 65,
        general: { chronicConditions: ['Diabetes', 'Obesity'] }
    },
    {
        id: 'P-202',
        name: 'Priya Kapoor',
        age: 28,
        gender: 'F',
        lastVisit: '1 week ago',
        condition: 'Acute Bronchitis',
        riskLevel: 'Low',
        adherenceScore: 90
    }
];

const GeneralPhysicianDashboard = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    // In a real scenario, these would merge with API data
    const [appointments] = useState<Appointment[]>(generateMockAppointments());
    const [patients] = useState<Patient[]>(generateMockPatients());

    // Existing State
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Keep existing API call for aggregate stats
                const response = await api.get('/api/dashboard/general');
                setStats(response.data);
            } catch (error) {
                console.warn("Using fallback stats due to API error/missing endpoint", error);
                setStats({
                    opd_load: { current_load: 12, status: 'Normal', predicted_next_hour: 15 },
                    symptom_trends: { text: 'Viral Fever Cluster detected' },
                    waiting_room: { total: 4, max_wait: '15 mins' }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket.on('dashboard:update', (update: any) => {
            if (update.type === 'GENERAL_UPDATE') {
                setStats((prev: any) => ({
                    ...prev,
                    opd_load: update.data
                }));
            }
        });

        return () => {
            socket.off('dashboard:update');
        };
    }, []);

    return (
        <DashboardLayout role="doctor" doctorType="general" title={t('hero_title')}>
            {loading || !stats ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-pulse">
                    <Activity className="w-12 h-12 mb-4 opacity-50" />
                    <p>Syncing Clinical Data...</p>
                </div>
            ) : (
                <>
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* OPD Load */}
                        <Card color="#3b82f6" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-12 h-12 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">{t('current_opd_load')}</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{stats.opd_load.current_load}</h3>
                                <p className={`text-sm font-medium flex items-center gap-1 ${stats.opd_load.status === 'High' ? 'text-red-400' : 'text-blue-400'}`}>
                                    <Activity className="w-3 h-3" />
                                    Status: {stats.opd_load.status}
                                </p>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                    <span>Predicted Next Hour</span>
                                    <span>{stats.opd_load.predicted_next_hour} Patients</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(stats.opd_load.predicted_next_hour * 2, 100)}%` }} />
                                </div>
                            </div>
                        </Card>

                        {/* Symptom Trends */}
                        <Card color="#ef4444" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Thermometer className="w-12 h-12 text-red-500" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">{t('epidemic_watch')}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-white leading-tight">Viral Spike</h3>
                                    <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/30">ALERT</span>
                                </div>
                                <p className="text-sm text-gray-400 flex items-start gap-2">
                                    <Activity className="w-3 h-3 mt-1 text-red-400 shrink-0" />
                                    {stats.symptom_trends.text}
                                </p>
                            </div>
                        </Card>

                        {/* Waiting Room */}
                        <Card color="#eab308" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="w-12 h-12 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">{t('waiting_room')}</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{stats.waiting_room.total}</h3>
                                <p className="text-sm text-yellow-400 flex items-center gap-1">
                                    Max Wait: {stats.waiting_room.max_wait}
                                    <span className="relative flex h-2 w-2 ml-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                    </span>
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Left Column: Appointments */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-blue-400" />
                                    {t('today_appointments')}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-400 hover:text-blue-300"
                                    onClick={() => navigate('/doctor/general/schedule')}
                                >
                                    View Calendar
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appointments.map(apt => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        doctorType="general"
                                        onStart={() => navigate('/doctor/general/consultations')}
                                        onViewProfile={(id) => navigate(`/doctor/patient/${id}`)}
                                    />
                                ))}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" />
                                    {t('patient_queue')}
                                </h2>
                                <div className="space-y-3">
                                    {patients.map(patient => (
                                        <PatientListRow
                                            key={patient.id}
                                            patient={patient}
                                            doctorType="general"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Actions & Diagnostics */}
                        <div className="space-y-4">
                            <Card color="#60a5fa" className="p-3">
                                <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> {t('priority_actions')}
                                </h3>
                                <div className="space-y-2">
                                    <Button className="w-full justify-between" size="sm" variant="secondary">
                                        <span>Review Lab Results (3)</span>
                                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Urgent</span>
                                    </Button>
                                    <Button className="w-full justify-start" size="sm" variant="outline">
                                        Approve Refill Requests (5)
                                    </Button>
                                </div>
                            </Card>

                        </div>
                    </div>
                </>
            )}

        </DashboardLayout>
    );
};

export default GeneralPhysicianDashboard;
