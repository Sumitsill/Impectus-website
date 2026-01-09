import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PatientListRow, type Patient } from '../../components/doctor/PatientListRow';
import { Button } from '../../components/ui/Button';
import { Search, UserPlus } from 'lucide-react';
import { AddPatientModal } from '../../components/doctor/AddPatientModal';

const mockPatients: Patient[] = [
    {
        id: '1', name: 'Rahul Sharma', age: 45, gender: 'M', lastVisit: '2 days ago', condition: 'Hypertension', riskLevel: 'High', adherenceScore: 65,
        ayurvedic: { prakriti: 'Pitta-Vata', compliance: 'Fair' },
    },
    {
        id: '2', name: 'Anjali Gupta', age: 32, gender: 'F', lastVisit: '1 week ago', condition: 'Migraine', riskLevel: 'Low', adherenceScore: 92,
        ayurvedic: { prakriti: 'Vata', compliance: 'Good' },
    },
    {
        id: '3', name: 'Vikram Singh', age: 58, gender: 'M', lastVisit: 'Yesterday', condition: 'Diabetes T2', riskLevel: 'Moderate', adherenceScore: 78,
        ayurvedic: { prakriti: 'Kapha', compliance: 'Good' },
    }
];

const AyurvedicPatients = () => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <DashboardLayout role="doctor" doctorType="ayurvedic" title="Ayurvedic - Patients">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto ml-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Add Patient
                    </Button>
                </div>
            </div>

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                doctorType="ayurvedic"
            />

            <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <span>Patient Details</span>
                    <span>Insights (Ayurvedic)</span>
                </div>
                <div className="divide-y divide-white/5">
                    {mockPatients.map((patient) => (
                        <PatientListRow
                            key={patient.id}
                            patient={patient}
                            doctorType="ayurvedic"
                            onStart={() => navigate('/doctor/ayurvedic/consultations')}
                            onViewProfile={(id) => navigate(`/doctor/patient/${id}`)}
                            onClick={(id) => navigate(`/doctor/patient/${id}`)}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AyurvedicPatients;
