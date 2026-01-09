import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AppointmentCard, type Appointment } from '../../components/doctor/AppointmentCard';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';

const getMockAppointments = (): Appointment[] => {
    return [
        {
            id: '1', patientName: 'Rahul Sharma', patientId: 'P001', time: '10:00 AM', type: 'Video', status: 'In Progress', condition: 'High Fever & Chills',
            general: { priority: 'Urgent', vitals: { bp: '140/90', temp: '102.5°F', spo2: '98%' }, pendingDiagnostics: true },
        },
        {
            id: '2', patientName: 'Anjali Gupta', patientId: 'P002', time: '10:30 AM', type: 'OPD', status: 'Waiting', condition: 'Chronic Migraine',
            general: { priority: 'Normal', vitals: { bp: '120/80', temp: '98.6°F', spo2: '99%' } },
        },
        {
            id: '3', patientName: 'Vikram Singh', patientId: 'P003', time: '11:00 AM', type: 'Follow-up', status: 'Confirmed', condition: 'Type 2 Diabetes Control',
            general: { priority: 'Normal', vitals: { bp: '130/85', temp: '98.4°F', spo2: '97%' } },
        }
    ];
}

const GeneralAppointments = () => {
    const navigate = useNavigate();
    const [appointments] = useState<Appointment[]>(getMockAppointments());

    return (
        <DashboardLayout role="doctor" doctorType="general" title="General - Appointments">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto ml-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/doctor/general/schedule')}
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((apt) => (
                    <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        doctorType="general"
                        onStart={() => navigate('/doctor/general/consultations')}
                        onViewProfile={(id) => navigate(`/doctor/patient/${id}`)}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default GeneralAppointments;
