import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PatientListRow, type Patient } from '../../components/doctor/PatientListRow';
import { type DoctorType } from '../../components/doctor/AppointmentCard'; // Sharing type
import { Button } from '../../components/ui/Button';
import { Search, UserPlus } from 'lucide-react';

const mockPatients: Patient[] = [
    {
        id: '1', name: 'Rahul Sharma', age: 45, gender: 'M', lastVisit: '2 days ago', condition: 'Hypertension', riskLevel: 'High', adherenceScore: 65,
        homeopathy: { constitution: 'Sulphur', improvementRate: 15 },
        ayurvedic: { prakriti: 'Pitta-Vata', compliance: 'Fair' },
        general: { chronicConditions: ['HTN'], nextFollowUpDue: '2024-02-10' }
    },
    {
        id: '2', name: 'Anjali Gupta', age: 32, gender: 'F', lastVisit: '1 week ago', condition: 'Migraine', riskLevel: 'Low', adherenceScore: 92,
        homeopathy: { constitution: 'Natrum Mur', improvementRate: 85 },
        ayurvedic: { prakriti: 'Vata', compliance: 'Good' },
        general: { chronicConditions: [], nextFollowUpDue: '2024-03-01' }
    },
    {
        id: '3', name: 'Vikram Singh', age: 58, gender: 'M', lastVisit: 'Yesterday', condition: 'Diabetes T2', riskLevel: 'Moderate', adherenceScore: 78,
        homeopathy: { constitution: 'Lycopodium', improvementRate: 40 },
        ayurvedic: { prakriti: 'Kapha', compliance: 'Good' },
        general: { chronicConditions: ['Diabetes'], nextFollowUpDue: '2024-01-20' }
    }
];

const Patients = () => {
    const [viewType, setViewType] = useState<DoctorType>('general');

    return (
        <DashboardLayout role="doctor" title="Patients">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    {(['general', 'homeopathy', 'ayurvedic'] as DoctorType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setViewType(t)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${viewType === t ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {t} View
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <Button><UserPlus className="w-4 h-4 mr-2" /> Add Patient</Button>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <span>Patient Details</span>
                    <span>Insights ({viewType})</span>
                </div>
                <div className="divide-y divide-white/5">
                    {mockPatients.map((patient) => (
                        <PatientListRow
                            key={patient.id}
                            patient={patient}
                            doctorType={viewType}
                            onClick={(id) => console.log('Clicked patient', id)}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Patients;
