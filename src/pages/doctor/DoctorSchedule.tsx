import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    Filter,
    LayoutGrid,
    Calendar as CalendarIcon,
    Video,
    User,
    AlertTriangle,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Event {
    id: string;
    time: string;
    title: string;
    type: 'meeting' | 'surgery' | 'training' | 'appointment';
    patientName?: string;
    priority?: 'urgent' | 'normal' | 'low';
    color?: string;
}

interface DayData {
    day: number;
    isCurrentMonth: boolean;
    isToday?: boolean;
    events: Event[];
}

const DoctorSchedule = () => {
    const { doctorType } = useParams<{ doctorType: string }>();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');

    // Mock data for October 2023 to match screenshot
    const days: DayData[] = [
        // Previous month days (padding)
        { day: 1, isCurrentMonth: true, events: [] },
        {
            day: 2,
            isCurrentMonth: true,
            events: [{ id: '1', time: '09:00', title: 'Staff Meeting', type: 'meeting', color: 'bg-slate-700/50' }]
        },
        { day: 3, isCurrentMonth: true, events: [] },
        { day: 4, isCurrentMonth: true, events: [] },
        { day: 5, isCurrentMonth: true, events: [] },
        { day: 6, isCurrentMonth: true, events: [] },
        { day: 7, isCurrentMonth: true, events: [] },
        { day: 8, isCurrentMonth: true, events: [] },
        { day: 9, isCurrentMonth: true, events: [] },
        {
            day: 10,
            isCurrentMonth: true,
            events: [{ id: '2', time: '11:30', title: 'Surgery', type: 'surgery', color: 'bg-purple-900/40 text-purple-300 border-purple-500/30' }]
        },
        { day: 11, isCurrentMonth: true, events: [] },
        { day: 12, isCurrentMonth: true, events: [] },
        { day: 13, isCurrentMonth: true, events: [] },
        { day: 14, isCurrentMonth: true, events: [] },
        { day: 15, isCurrentMonth: true, events: [] },
        { day: 16, isCurrentMonth: true, events: [] },
        { day: 17, isCurrentMonth: true, events: [] },
        {
            day: 18,
            isCurrentMonth: true,
            events: [{ id: '3', time: '14:00', title: 'Training', type: 'training', color: 'bg-blue-900/40 text-blue-300 border-blue-500/30' }]
        },
        { day: 19, isCurrentMonth: true, events: [] },
        { day: 20, isCurrentMonth: true, events: [] },
        { day: 21, isCurrentMonth: true, events: [] },
        { day: 22, isCurrentMonth: true, events: [] },
        { day: 23, isCurrentMonth: true, events: [] },
        {
            day: 24,
            isCurrentMonth: true,
            isToday: true,
            events: [
                { id: '4', time: '10:00 AM', title: 'Video Consult', type: 'appointment', patientName: 'Rahul Sharma', priority: 'urgent', color: 'bg-blue-600/20 border-blue-500/50 text-blue-100' },
                { id: '5', time: '10:30 AM', title: 'OPD Visit', type: 'appointment', patientName: 'Anjali Gupta', priority: 'normal', color: 'bg-purple-600/20 border-purple-500/50 text-purple-100' },
                { id: '6', time: '11:00 AM', title: 'Follow-up', type: 'appointment', patientName: 'Vikram Singh', priority: 'low', color: 'bg-slate-800 border-slate-700 text-slate-300' }
            ]
        },
        {
            day: 25,
            isCurrentMonth: true,
            events: []
        },
        {
            day: 26,
            isCurrentMonth: true,
            events: [{ id: '7', time: '15:00', title: 'Dept Review', type: 'meeting', color: 'bg-slate-700/50' }]
        },
        { day: 27, isCurrentMonth: true, events: [] },
        { day: 28, isCurrentMonth: true, events: [] },
        { day: 29, isCurrentMonth: true, events: [] },
        { day: 30, isCurrentMonth: true, events: [] },
        { day: 31, isCurrentMonth: true, events: [] },
    ];

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getTitle = () => {
        if (!doctorType) return 'Doctor - Schedule';
        const type = doctorType.charAt(0).toUpperCase() + doctorType.slice(1);
        return `${type} - Schedule`;
    };

    return (
        <DashboardLayout role="doctor" doctorType={doctorType as any} title={getTitle()}>
            <div className="flex flex-col h-full bg-[#0a0a0c] -m-4 md:-m-8 p-4 md:p-8">
                {/* Calendar Header Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-bold text-white">October 2023</h2>
                        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-white/10">
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Today
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter events..."
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                <Filter className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/10">
                            {['Day', 'Week', 'Month'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setCurrentView(v.toLowerCase() as any)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                                        currentView === v.toLowerCase()
                                            ? "bg-slate-800 text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/10">
                            <button className="p-2 text-gray-500 hover:text-white rounded-lg">
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                                <CalendarIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 border border-white/5 rounded-2xl overflow-hidden bg-slate-900/20 backdrop-blur-3xl">
                    {/* Weekdays Header */}
                    <div className="grid grid-cols-7 border-b border-white/5">
                        {weekDays.map(day => (
                            <div key={day} className="py-4 text-center text-[10px] font-bold text-gray-500 tracking-widest uppercase border-r border-white/5 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 auto-rows-fr h-[calc(100vh-280px)]">
                        {days.map((dayData, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "p-2 border-r border-b border-white/5 group transition-colors hover:bg-white/[0.02]",
                                    (idx + 1) % 7 === 0 && "border-r-0",
                                    !dayData.isCurrentMonth && "bg-black/20"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-all",
                                        dayData.isToday
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 font-bold"
                                            : "text-gray-500 group-hover:text-gray-300",
                                        !dayData.isCurrentMonth && "opacity-20"
                                    )}>
                                        {dayData.day}
                                    </span>
                                    {dayData.isToday && (
                                        <span className="text-[10px] font-bold text-blue-500 mt-2 mr-2 uppercase tracking-tighter">Today</span>
                                    )}
                                </div>

                                <div className="space-y-1.5 overflow-y-auto max-h-[calc(100%-40px)] scrollbar-hide">
                                    {dayData.events.map(event => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "p-2 rounded-lg border text-xs cursor-pointer hover:brightness-110 transition-all group/event",
                                                event.color
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold opacity-80 flex items-center gap-1">
                                                    {event.type === 'appointment' && <Video className="w-3 h-3" />}
                                                    {event.time}
                                                </span>
                                                {event.priority === 'urgent' && <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />}
                                                {event.priority === 'normal' && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                                            </div>
                                            <div className="font-medium truncate">
                                                {event.patientName || event.title}
                                            </div>
                                            {event.patientName && (
                                                <div className="text-[10px] opacity-60 mt-0.5 mt-1 border-t border-white/5 pt-1 group-hover/event:border-white/10">
                                                    {event.title}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorSchedule;
