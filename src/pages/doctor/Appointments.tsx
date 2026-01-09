import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AppointmentCard, type Appointment, type DoctorType } from '../../components/doctor/AppointmentCard';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';

// Mock data generator (duplicated/extended for standalone page availability)
const getMockAppointments = (): Appointment[] => {
    const base: Appointment[] = [
        {
            id: '1', patientName: 'Rahul Sharma', patientId: 'P001', time: '10:00 AM', type: 'Video', status: 'In Progress', condition: 'High Fever & Chills',
            general: { priority: 'Urgent', vitals: { bp: '140/90', temp: '102.5°F', spo2: '98%' }, pendingDiagnostics: true },
            homeopathy: { caseType: 'Acute', lastRemedy: 'Aconite 30', potencyReviewDue: false },
            ayurvedic: { dosha: 'Pitta', therapyType: 'Consultation' }
        },
        {
            id: '2', patientName: 'Anjali Gupta', patientId: 'P002', time: '10:30 AM', type: 'OPD', status: 'Waiting', condition: 'Chronic Migraine',
            general: { priority: 'Normal', vitals: { bp: '120/80', temp: '98.6°F', spo2: '99%' } },
            homeopathy: { caseType: 'Chronic', lastRemedy: 'Belladonna 200', potencyReviewDue: true, daysSinceLastConsult: 45 },
            ayurvedic: { dosha: 'Vata', therapyType: 'Panchakarma', sessionNumber: 3, totalSessions: 7 }
        },
        {
            id: '3', patientName: 'Vikram Singh', patientId: 'P003', time: '11:00 AM', type: 'Follow-up', status: 'Confirmed', condition: 'Type 2 Diabetes Control',
            general: { priority: 'Normal', vitals: { bp: '130/85', temp: '98.4°F', spo2: '97%' } },
            homeopathy: { caseType: 'Chronic', lastRemedy: 'Syzygium Jambolanum', potencyReviewDue: false },
            ayurvedic: { dosha: 'Kapha', therapyType: 'Diet Review' }
        }
    ];
    return base;
}

const Appointments = () => {
    const [viewType, setViewType] = useState<DoctorType>('general');
    const [appointments, setAppointments] = useState<Appointment[]>(getMockAppointments());

    return (
        <DashboardLayout role="doctor" title="Appointments">
            {/* Controls for Demo Purpose */}
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
                            placeholder="Search appointments..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon"><CalendarIcon className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((apt) => (
                    <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        doctorType={viewType}
                        onStart={(id) => console.log('Starting', id)}
                        onViewProfile={(id) => console.log('Profile', id)}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Appointments;
