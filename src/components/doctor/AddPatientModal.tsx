import { useState } from 'react';
import {
    X, User, Stethoscope, Leaf, Sparkles, Activity,
    ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { clsx } from 'clsx';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorType: 'general' | 'ayurvedic' | 'homeopathy';
}

export const AddPatientModal = ({ isOpen, onClose, doctorType }: AddPatientModalProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        // General Questions
        chiefComplaint: '',
        medicalHistory: '',
        currentMedications: '',
        // Ayurvedic Questions
        prakriti: '',
        digestion: '',
        sleepPattern: '',
        // Homeopathy Questions
        constitution: '',
        mentalSymptoms: '',
        physicalModalities: ''
    });

    if (!isOpen) return null;

    const steps = [
        { id: 1, title: 'Personal Info', icon: User },
        { id: 2, title: 'Medical Case', icon: Stethoscope },
        { id: 3, title: 'Specialized Questionnaire', icon: doctorType === 'ayurvedic' ? Leaf : doctorType === 'homeopathy' ? Sparkles : Activity }
    ];

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = () => {
        console.log('Final Data:', formData);
        alert('Patient Added Successfully (Mock)');
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                placeholder="Enter patient name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <Input
                                label="Age"
                                placeholder="e.g. 45"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-400">Gender</label>
                                <select
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary/50 outline-none"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="Phone Number"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <Input
                            label="Email Address"
                            placeholder="patient@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-400">Chief Complaint</label>
                            <textarea
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none h-24 resize-none"
                                placeholder="What is the primary reason for consultation?"
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-400">Medical History</label>
                            <textarea
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none h-24 resize-none"
                                placeholder="Mention any chronic conditions (Diabetes, HTN, etc.)"
                                value={formData.medicalHistory}
                                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {doctorType === 'general' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                                    <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                                    <p className="text-xs text-blue-200/70 italic">Please collect current vitals if available during registration.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Temperature (°F)" placeholder="98.6" />
                                    <Input label="Blood Pressure" placeholder="120/80" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Current Medications</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary/50 outline-none"
                                        placeholder="List any medicine being taken"
                                    />
                                </div>
                            </div>
                        )}
                        {doctorType === 'ayurvedic' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Prakriti (Constitutional Type)</label>
                                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-green-500/50 outline-none">
                                            <option value="">Select Prakriti</option>
                                            <option value="Vata">Vata</option>
                                            <option value="Pitta">Pitta</option>
                                            <option value="Kapha">Kapha</option>
                                            <option value="Vata-Pitta">Vata-Pitta</option>
                                            <option value="Pitta-Kapha">Pitta-Kapha</option>
                                            <option value="Vata-Kapha">Vata-Kapha</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Agni (Digestive Fire)</label>
                                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-green-500/50 outline-none">
                                            <option value="">Select Agni State</option>
                                            <option value="Sama">Sama (Balanced)</option>
                                            <option value="Vishama">Vishama (Irregular)</option>
                                            <option value="Tikshna">Tikshna (Sharp)</option>
                                            <option value="Manda">Manda (Weak)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Koshtha (Bowel Habits)</label>
                                    <textarea
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none h-20 resize-none"
                                        placeholder="Describe frequency, consistency and ease..."
                                    />
                                </div>
                            </div>
                        )}
                        {doctorType === 'homeopathy' && (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Constitutional Analysis</label>
                                    <textarea
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none h-20 resize-none"
                                        placeholder="Dominant physical and mental traits..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Thermal Reaction</label>
                                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500/50 outline-none">
                                            <option value="">Select Type</option>
                                            <option value="Chilly">Chilly</option>
                                            <option value="Hot">Hot</option>
                                            <option value="Ambithermal">Ambithermal</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400">Miasmatic Pattern</label>
                                        <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500/50 outline-none">
                                            <option value="">Select Miasm</option>
                                            <option value="Psora">Psora</option>
                                            <option value="Sycosis">Sycosis</option>
                                            <option value="Syphilis">Syphilis</option>
                                            <option value="Tubercular">Tubercular</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400">Mental State & Dispositions</label>
                                    <input
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500/50 outline-none"
                                        placeholder="Key personality traits (e.g. Anxiety, Anger, Timid)"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary/10 via-transparent to-transparent">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/20">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            New Patient Registration
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Fill the details to create a new medical record</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[500px]">
                    {/* Stepper Sidebar */}
                    <div className="w-full md:w-64 bg-white/[0.02] border-r border-white/5 p-6 flex flex-col gap-6">
                        {steps.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;

                            return (
                                <div key={s.id} className="flex items-center gap-4 relative">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                                        isActive ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(82,39,255,0.4)]" :
                                            isCompleted ? "bg-green-500/20 border-green-500/30 text-green-400" :
                                                "bg-slate-800 border-white/5 text-slate-500"
                                    )}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={clsx(
                                            "text-xs font-bold uppercase tracking-widest",
                                            isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-slate-600"
                                        )}>Step 0{s.id}</span>
                                        <span className={clsx(
                                            "text-sm font-semibold",
                                            isActive ? "text-white" : "text-slate-400"
                                        )}>{s.title}</span>
                                    </div>
                                    {s.id < steps.length && (
                                        <div className="absolute left-5 top-10 w-0.5 h-6 bg-white/5" />
                                    )}
                                </div>
                            );
                        })}

                        <div className="mt-auto p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-white">AI Suggestion</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                "The patient portal is now synced with your selected questionnaire."
                            </p>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1 p-8 flex flex-col">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {renderStep()}
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                disabled={step === 1}
                                onClick={prevStep}
                                className="text-slate-400 hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            {step < 3 ? (
                                <Button onClick={nextStep}>
                                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-green-500 hover:bg-green-600 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                >
                                    Complete Entry <Check className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
