import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    User, Phone, Mail, Calendar,
    Activity, ArrowLeft,
    FileText, Video,
    ShieldAlert, History, Download,
    Plus
} from 'lucide-react';

const PatientProfile = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock Patient Data
    const patientData = {
        id: patientId || 'P-101',
        name: 'Rahul Sharma',
        age: 45,
        gender: 'M',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        bloodGroup: 'O+',
        lastVisit: '2024-01-05',
        condition: 'Hypertension, Type 2 Diabetes',
        riskLevel: 'Moderate',
        vitals: {
            bp: '130/85',
            temp: '98.6°F',
            spo2: '98%',
            weight: '78kg',
            height: '175cm'
        },
        medicalHistory: [
            { date: '2024-01-05', diagnosis: 'Standard Follow-up', treatment: 'Amlodipine 5mg', doctor: 'Dr. Sameer' },
            { date: '2023-11-20', diagnosis: 'Acute Bronchitis', treatment: 'Azithromycin Course', doctor: 'Dr. Sameer' },
            { date: '2023-08-15', diagnosis: 'Diabetes T2 - Diagnosis', treatment: 'Metformin 500mg', doctor: 'Dr. Verma' }
        ],
        recentReports: [
            { id: 'R1', name: 'Comprehensive Blood Count', date: '2024-01-02', type: 'Lab' },
            { id: 'R2', name: 'HbA1c Level', date: '2024-01-02', type: 'Lab' },
            { id: 'R3', name: 'Chest X-Ray', date: '2023-11-20', type: 'Imaging' }
        ]
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="doctor" doctorType="general" title="Patient Profile">
                <div className="flex items-center justify-center h-[60vh] text-slate-500 animate-pulse">
                    Loading Medical Records...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="doctor" doctorType="general" title={`Patient: ${patientData.name}`}>
            <div className="space-y-6">
                {/* Top Nav & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Appointments
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" /> Export EHR
                        </Button>
                        <Button size="sm" onClick={() => navigate('/doctor/consultations')}>
                            <Video className="w-4 h-4 mr-2" /> Start Consultation
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Personal Info & Vitals */}
                    <div className="space-y-6">
                        <Card className="bg-[#0d1117] border-white/5 p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                                    {patientData.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">{patientData.name}</h2>
                                <p className="text-slate-500 text-sm font-medium mb-4">{patientData.id} • {patientData.age} yr • {patientData.gender}</p>

                                <div className="flex gap-3 w-full">
                                    <div className="flex-1 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Blood Group</p>
                                        <p className="text-red-400 font-bold">{patientData.bloodGroup}</p>
                                    </div>
                                    <div className="flex-1 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Risk Status</p>
                                        <p className="text-yellow-500 font-bold">{patientData.riskLevel}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Phone className="w-4 h-4" /> <span>{patientData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Mail className="w-4 h-4" /> <span>{patientData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <ShieldAlert className="w-4 h-4" /> <span>{patientData.condition}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-[#0d1117] border-white/5 p-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Current Vitals
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase">Blood Pressure</p>
                                    <p className="text-white text-base font-bold">{patientData.vitals.bp}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase">Temperature</p>
                                    <p className="text-white text-base font-bold">{patientData.vitals.temp}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase">SpO2</p>
                                    <p className="text-white text-base font-bold">{patientData.vitals.spo2}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase">Weight</p>
                                    <p className="text-white text-base font-bold">{patientData.vitals.weight}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Middle Column: History & Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#0d1117] border-white/5 p-0 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4" /> Consultation History
                                </h3>
                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View All</Button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {patientData.medicalHistory.map((item, idx) => (
                                    <div key={idx} className="p-6 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-white font-bold mb-1">{item.diagnosis}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.doctor}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Detail Records
                                            </Button>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 inline-block">
                                            <p className="text-xs text-slate-400">Treatment: <span className="text-blue-300 font-medium">{item.treatment}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-[#0d1117] border-white/5 p-6">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Lab Reports
                                </h3>
                                <div className="space-y-3">
                                    {patientData.recentReports.map((report) => (
                                        <div key={report.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                                    <Download className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{report.name}</p>
                                                    <p className="text-[10px] text-slate-500">{report.date} • {report.type}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-[#0d1117] border-white/5 p-6 border-l-4 border-l-primary flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">New Entry?</h3>
                                    <p className="text-sm text-slate-400 mb-4">Add new diagnostics or prescriptions to Rahul's record.</p>
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-2" /> Add Medical Data
                                    </Button>
                                </div>
                                <FileText className="w-16 h-16 text-primary/10" />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PatientProfile;
