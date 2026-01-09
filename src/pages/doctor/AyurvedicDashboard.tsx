import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Video, Leaf, Coffee, Activity, ArrowRight, BookOpen } from 'lucide-react';
import { AddPatientModal } from '../../components/doctor/AddPatientModal';
import { AppointmentCard } from '../../components/doctor/AppointmentCard';
import type { Appointment } from '../../components/doctor/AppointmentCard';
import { PatientListRow } from '../../components/doctor/PatientListRow';
import type { Patient } from '../../components/doctor/PatientListRow';
import { io } from 'socket.io-client';
import api from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

const socket = io('http://localhost:5000');

// Mock Data for Ayurveda
const generateMockAppointments = (): Appointment[] => [
    {
        id: 'a1',
        patientName: 'Ravi Verma',
        patientId: 'P-501',
        time: '09:00 AM',
        type: 'Therapy Session',
        status: 'In Progress',
        condition: 'Arthritis (Sandhivata)',
        ayurvedic: {
            therapyType: 'Abhyanga',
            dosha: 'Vata',
            sessionNumber: 3,
            totalSessions: 7
        }
    },
    {
        id: 'a2',
        patientName: 'Sneha Patel',
        patientId: 'P-502',
        time: '10:15 AM',
        type: 'Video Consult',
        status: 'Confirmed',
        condition: 'Indigestion (Ajeerna)',
        ayurvedic: {
            dosha: 'Pitta',
        }
    }
];

const generateMockPatients = (): Patient[] => [
    {
        id: 'P-601',
        name: 'Amit Kumar',
        age: 50,
        gender: 'M',
        lastVisit: '5 days ago',
        condition: 'Obesity',
        ayurvedic: {
            prakriti: 'Kapha-Vata',
            compliance: 'Fair'
        }
    },
    {
        id: 'P-602',
        name: 'Pooja Reddy',
        age: 29,
        gender: 'F',
        lastVisit: '2 weeks ago',
        condition: 'Skin Allergy',
        ayurvedic: {
            prakriti: 'Pitta',
            compliance: 'Good'
        }
    }
];

const AyurvedicDashboard = () => {
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
                const response = await api.get('/api/dashboard/ayurvedic');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.warn("Using fallback stats due to API error/missing endpoint", error);
                setData({
                    assessments: { total: 15, details: { dominant: 'Vata', vata: 60, pitta: 25, kapha: 15 } },
                    panchakarma: { active: 8, completing: 2 },
                    critical_patients: []
                });
                setLoading(false);
            }
        };

        fetchData();

        socket.on('dashboard:update', (update: any) => {
            if (update.type === 'AYURVEDIC_UPDATE') {
                setData((prev: any) => ({
                    ...prev,
                    assessments: { ...prev?.assessments, details: update.data }
                }));
            }
        });

        return () => {
            socket.off('dashboard:update');
        };
    }, []);

    return (
        <DashboardLayout role="doctor" doctorType="ayurvedic" title={t('hero_title')}>
            {loading || !data ? (
                <div className="flex items-center justify-center h-[60vh] text-gray-500 animate-pulse">
                    Loading Lifecycle Insights...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Dynamic KPI: Dosha Assessments */}
                        <Card color="#5227FF" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Leaf className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Dosha Assessments</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{data.assessments.total}</h3>
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    {data.assessments.details.dominant} dominance ↑ {data.assessments.details.vata}%
                                </p>
                            </div>
                            {/* Visual Dosha Ring (Simple Bar for MVP) */}
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                    <span>Vata/Pitta/Kapha Balance</span>
                                    <span>{data.assessments.details.vata}% / {data.assessments.details.pitta}% / {data.assessments.details.kapha}%</span>
                                </div>
                                <div className="flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 transition-all duration-500" style={{ width: `${data.assessments.details.vata}%` }} title="Vata" />
                                    <div className="bg-red-400 transition-all duration-500" style={{ width: `${data.assessments.details.pitta}%` }} title="Pitta" />
                                    <div className="bg-green-400 transition-all duration-500" style={{ width: `${data.assessments.details.kapha}%` }} title="Kapha" />
                                </div>
                            </div>
                            <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                <span>Vata</span><span>Pitta</span><span>Kapha</span>
                            </div>
                        </Card>

                        <Card color="#f97316" className="relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Coffee className="w-12 h-12 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">{t('panchakarma_active')}</p>
                                <h3 className="text-3xl font-bold text-white mb-2">{data.panchakarma.active}</h3>
                                <p className="text-sm text-orange-400">
                                    {data.panchakarma.completing} nearing completion
                                </p>
                            </div>
                        </Card>

                        {/* Simulated AI Insight Panel */}
                        <Card color="#6366f1" className="md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> {t('practice_intelligence')}
                                    </h4>
                                    <p className="text-indigo-100 text-sm mb-4">
                                        3 patients today show similar digestive imbalance patterns. Consider recommending standard <strong>Nadi Pariksha</strong> for this cluster.
                                    </p>
                                    <Button size="sm" variant="outline" className="text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10">
                                        View Cluster Details <ArrowRight className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent/Urgent Patients List */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Appointments */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-end">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-green-400" />
                                    {t('daily_schedule')}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-400 hover:text-green-300"
                                    onClick={() => navigate('/doctor/ayurvedic/schedule')}
                                >
                                    View Calendar
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appointments.map(apt => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        doctorType="ayurvedic"
                                        onStart={() => navigate('/doctor/ayurvedic/consultations')}
                                        onViewProfile={(id) => navigate(`/doctor/patient/${id}`)}
                                    />
                                ))}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" />
                                    {t('patient_tracker')}
                                </h2>
                                <div className="space-y-3">
                                    {patients.map(patient => (
                                        <PatientListRow
                                            key={patient.id}
                                            patient={patient}
                                            doctorType="ayurvedic"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Key Actions */}
                        <div className="space-y-4">
                            <Card color="#f97316" className="p-4">
                                <h3 className="text-sm font-semibold text-orange-300 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Quick Reference
                                </h3>
                                <div className="space-y-2 text-xs text-orange-200">
                                    <div className="flex justify-between p-2 bg-black/20 rounded">
                                        <span>Vata Time</span>
                                        <span>2:00 PM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-black/20 rounded">
                                        <span>Sunset Today</span>
                                        <span>6:45 PM</span>
                                    </div>
                                </div>
                            </Card>

                            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                            <Card className="p-4 space-y-3">
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    <Users className="w-4 h-4 mr-2" /> New Patient Entry
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Leaf className="w-4 h-4 mr-2" /> Prescribe Herbals
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Video className="w-4 h-4 mr-2" /> Start Tele-Consult
                                </Button>
                            </Card>
                        </div>
                    </div>
                </>
            )}

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                doctorType="ayurvedic"
            />
        </DashboardLayout>
    );
};

export default AyurvedicDashboard;
