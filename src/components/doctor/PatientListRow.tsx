import React from 'react';
import { Button } from '../ui/Button';
import {
    ChevronRight,
    TrendingUp,
    Video,
    User
} from 'lucide-react';
import type { DoctorType } from './AppointmentCard';

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'M' | 'F' | 'O';
    lastVisit: string;
    condition: string;
    avatar?: string;
    // Dynamic fields
    riskLevel?: 'Low' | 'Moderate' | 'High';
    adherenceScore?: number; // 0-100
    homeopathy?: {
        constitution?: string;
        improvementRate?: number; // %
    };
    ayurvedic?: {
        prakriti?: string; // e.g. "Vata-Pitta"
        compliance?: 'Good' | 'Fair' | 'Poor';
    };
    general?: {
        chronicConditions?: string[];
        nextFollowUpDue?: string; // Date string
    };
}

interface PatientListRowProps {
    patient: Patient;
    doctorType: DoctorType;
    onClick?: (id: string) => void;
    onStart?: (id: string, doctorType: string) => void;
    onViewProfile?: (id: string) => void;
}

export const PatientListRow: React.FC<PatientListRowProps> = ({
    patient,
    doctorType,
    onClick,
    onStart,
    onViewProfile
}) => {

    // Helper: Risk Badge
    const renderRiskBadge = () => {
        if (!patient.riskLevel) return null;
        const colors = {
            Low: 'text-green-400 bg-green-400/10 border-green-400/20',
            Moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            High: 'text-red-400 bg-red-400/10 border-red-400/20 animate-pulse'
        };

        return (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[patient.riskLevel]}`}>
                {patient.riskLevel} Risk
            </span>
        );
    };

    // Helper: Doctor Specific Columns
    const renderSpecificInfo = () => {
        switch (doctorType) {
            case 'homeopathy':
                return (
                    <div className="flex flex-col items-end mr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400">Constitution:</span>
                            <span className="text-xs text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                                {patient.homeopathy?.constitution || 'Analyzing...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400 font-semibold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            {patient.homeopathy?.improvementRate}% Improvement
                        </div>
                    </div>
                );
            case 'ayurvedic':
                return (
                    <div className="flex flex-col items-end mr-4 text-right">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400">Prakriti:</span>
                            <span className="text-xs text-orange-300 font-medium bg-orange-900/20 px-2 py-0.5 rounded border border-orange-500/20">
                                {patient.ayurvedic?.prakriti || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <span>Compliance:</span>
                            <span className={patient.ayurvedic?.compliance === 'Good' ? 'text-green-400' : 'text-yellow-400'}>
                                {patient.ayurvedic?.compliance || 'Avg'}
                            </span>
                        </div>
                    </div>
                );
            case 'general':
                return (
                    <div className="flex flex-col items-end mr-4 min-w-[100px]">
                        <div className="flex justify-between w-full text-xs mb-1">
                            <span className="text-slate-400">Adherence</span>
                            <span className={patient.adherenceScore && patient.adherenceScore > 80 ? 'text-green-400' : 'text-red-400'}>
                                {patient.adherenceScore}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full">
                            <div
                                className={`h-full rounded-full ${(patient.adherenceScore || 0) > 80 ? 'bg-green-500' :
                                    (patient.adherenceScore || 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${patient.adherenceScore || 0}%` }}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div
            className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            onClick={() => onClick?.(patient.id)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${doctorType === 'ayurvedic' ? 'bg-orange-900/20 text-orange-400' :
                        doctorType === 'homeopathy' ? 'bg-pink-900/20 text-pink-400' :
                            'bg-slate-800 text-slate-300'}`}>
                    {patient.avatar || patient.name.charAt(0)}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                            {patient.name}
                        </h4>
                        {renderRiskBadge()}
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>{patient.age}y / {patient.gender}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                        <span>Last: {patient.lastVisit}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {renderSpecificInfo()}
                <div className="hidden group-hover:flex items-center gap-1 pr-1 animate-in fade-in slide-in-from-right-2 duration-200">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-blue-400 hover:bg-blue-500/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStart?.(patient.id, doctorType);
                        }}
                    >
                        <Video className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-slate-400 hover:bg-white/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewProfile?.(patient.id);
                        }}
                    >
                        <User className="w-3.5 h-3.5" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 group-hover:text-white h-8 w-8">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
