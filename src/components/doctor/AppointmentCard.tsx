import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    Clock,
    Video,
    AlertCircle,
    Activity,
    Users
} from 'lucide-react';
import { clsx } from 'clsx';

export type DoctorType = 'general' | 'homeopathy' | 'ayurvedic';

export interface Appointment {
    id: string;
    patientName: string;
    patientId: string;
    time: string;
    type: string; // e.g., 'Video', 'OPD', 'Follow-up'
    status: 'Confirmed' | 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
    condition: string;
    avatar?: string;
    // Dynamic fields based on doctor type
    homeopathy?: {
        caseType: 'Initial' | 'Follow-up' | 'Chronic' | 'Acute';
        lastRemedy?: string;
        potencyReviewDue?: boolean;
        daysSinceLastConsult?: number;
    };
    ayurvedic?: {
        therapyType?: string;
        dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';
        sessionNumber?: number;
        totalSessions?: number;
    };
    general?: {
        priority: 'Normal' | 'Urgent' | 'Emergency';
        vitals?: {
            bp: string;
            temp: string;
            spo2: string;
        };
        pendingDiagnostics?: boolean;
    };
}

interface AppointmentCardProps {
    appointment: Appointment;
    doctorType: DoctorType;
    onStart?: (id: string, doctorType: string) => void;
    onViewProfile?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    doctorType,
    onStart,
    onViewProfile
}) => {
    const navigate = useNavigate();

    // Helper for Status Badge Styling
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.1)]';
            case 'Waiting':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'Confirmed':
                return 'bg-slate-700/50 text-slate-300 border-slate-600';
            case 'Completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            default:
                return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const handleStart = () => {
        if (onStart) {
            onStart(appointment.id, doctorType);
        } else {
            navigate(`/doctor/${doctorType}/consultations`);
        }
    };

    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(appointment.id);
        } else {
            navigate(`/doctor/patient/${appointment.id}`);
        }
    };

    return (
        <Card className="group relative overflow-hidden bg-[#0d1117] border-white/5 hover:border-primary/20 transition-all duration-500 shadow-2xl">
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="relative p-3.5 flex flex-col gap-3">
                {/* Header: Avatar, Name, Time, Status */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/10 flex items-center justify-center text-primary font-bold border border-blue-500/20 shadow-inner text-sm">
                                {appointment.avatar || appointment.patientName.charAt(0)}
                            </div>
                            {appointment.status === 'In Progress' && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0d1117] rounded-full animate-pulse" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm tracking-tight group-hover:text-primary transition-colors cursor-pointer" onClick={handleViewProfile}>
                                {appointment.patientName}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>{appointment.time}</span>
                                    <span className="text-slate-700">•</span>
                                    <span>{appointment.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(
                        "text-[9px] uppercase font-black px-2 py-0.5 rounded-md border tracking-wider",
                        getStatusStyles(appointment.status)
                    )}>
                        {appointment.status}
                    </div>
                </div>

                {/* Reason Section */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                    <p className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-300 leading-relaxed ml-2.5">
                        <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest mr-2">Reason:</span>
                        {appointment.condition}
                    </p>
                </div>

                {/* Patient Indicators (Urgent, Pending) */}
                {(appointment.general?.priority === 'Urgent' || appointment.general?.pendingDiagnostics) && (
                    <div className="flex flex-wrap gap-1.5">
                        {appointment.general?.priority === 'Urgent' && (
                            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase animate-pulse">
                                <AlertCircle className="w-2.5 h-2.5" /> Urgent
                            </div>
                        )}
                        {appointment.general?.pendingDiagnostics && (
                            <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                Diagnostics Pending
                            </div>
                        )}
                    </div>
                )}

                {/* Vitals Section */}
                {appointment.general?.vitals && (
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">BP</span>
                            <span className="text-blue-400 font-bold text-xs tracking-tight">{appointment.general.vitals.bp}</span>
                        </div>
                        <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">Temp</span>
                            <span className="text-red-400 font-bold text-xs tracking-tight">{appointment.general.vitals.temp}</span>
                        </div>
                        <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase mb-0.5">SpO2</span>
                            <span className="text-green-400 font-bold text-xs tracking-tight">{appointment.general.vitals.spo2}</span>
                        </div>
                    </div>
                )}

                {/* AI Alerts */}
                {appointment.condition.toLowerCase().includes('fever') && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2">
                        <div className="p-1 bg-red-500/20 rounded-md">
                            <Activity className="w-3 h-3 text-red-400" />
                        </div>
                        <p className="text-[10px] font-semibold text-red-300">
                            AI Alert: Repeat symptoms within 7 days
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-0.5">
                    <Button
                        className="flex-1 h-9 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/10 text-xs"
                        onClick={handleStart}
                    >
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Start
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 h-9 border-white/10 hover:bg-white/5 text-white rounded-lg text-xs"
                        onClick={handleViewProfile}
                    >
                        <Users className="w-3.5 h-3.5 mr-1.5" /> Profile
                    </Button>
                </div>
            </div>
        </Card>
    );
};
