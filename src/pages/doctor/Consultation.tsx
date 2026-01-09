import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    MessageSquare, Brain, FileText,
    Sparkles, Loader2, AlertCircle,
    Plus, ClipboardCheck,
    Camera, ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { useLanguage } from '../../context/LanguageContext';

const GEMINI_API_KEY = "AIzaSyCpVPGQa8eoB_a-ttot7WJrKbzSymgVx5o";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const Consultation = () => {
    const { t } = useLanguage();
    const { doctorType = 'general' } = useParams();
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [isAiActive, setIsAiActive] = useState(true);
    const [isConsulting, setIsConsulting] = useState(false);
    const [showPermissionBridge, setShowPermissionBridge] = useState(false);
    const [isGranting, setIsGranting] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // AI & Transcription States
    const [transcript, setTranscript] = useState<string[]>([]);
    const [extractedSymptoms, setExtractedSymptoms] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [clinicalInsights, setClinicalInsights] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);
    const transcriptBufferRef = useRef<string>("");

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const text = event.results[i][0].transcript;
                        setTranscript(prev => [...prev, "Patient: " + text]);
                        transcriptBufferRef.current += " " + text;
                    }
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error === 'no-speech' && isConsulting) {
                    // Restart if it stops due to silence
                    try { recognitionRef.current.start(); } catch (e) { }
                }
            };
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // Periodic AI Analysis (every 7 seconds)
    useEffect(() => {
        if (!isConsulting || !isAiActive) return;

        const interval = setInterval(() => {
            if (transcriptBufferRef.current.trim().length > 10) {
                analyzeWithGemini(transcriptBufferRef.current);
                transcriptBufferRef.current = ""; // Clear buffer after sending
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [isConsulting, isAiActive, extractedSymptoms, prescriptions]);

    const analyzeWithGemini = async (text: string) => {
        setIsAnalyzing(true);
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `You are a highly precise Medical Scribe AI for a ${doctorType} consultation. Your task is to process live consultation transcript and extract clinical data into a structured JSON format.
                
                Current JSON State:
                - Symptoms: ${JSON.stringify(extractedSymptoms)}
                - Prescription: ${JSON.stringify(prescriptions)}

                Strict Guidelines:
                1. Update the record based ONLY on the NEW transcript provided.
                2. If the user mentions a NEW symptom, add it. If they clarify duration, update it.
                3. Medications should include name, dosage, and frequency.
                4. clinical_notes should be a concise summary of new info.
                5. Return ONLY a JSON object. No markdown.
                
                Output Schema:
                {
                  "real_time_symptoms": [{"name": "string", "duration": "string", "severity": "Mild/Moderate/High"}],
                  "clinical_insights": ["point 1", "point 2"],
                  "prescription": [{"medication": "string", "dosage": "string", "frequency": "string"}]
                }`
            });

            const prompt = `NEW Transcript Snippet: "${text}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonText = response.text().replace(/```json|```/g, "").trim();
            const data = JSON.parse(jsonText);

            if (data.real_time_symptoms && data.real_time_symptoms.length > 0) {
                setExtractedSymptoms(prev => {
                    const combined = [...prev];
                    data.real_time_symptoms.forEach((newS: any) => {
                        const index = combined.findIndex(s => s.name.toLowerCase() === newS.name.toLowerCase());
                        if (index > -1) combined[index] = newS;
                        else combined.push(newS);
                    });
                    return combined;
                });
            }

            if (data.clinical_insights && data.clinical_insights.length > 0) {
                setClinicalInsights(prev => {
                    const combined = [...prev];
                    data.clinical_insights.forEach((insight: string) => {
                        if (!combined.includes(insight)) combined.push(insight);
                    });
                    return combined;
                });
            }

            if (data.prescription && data.prescription.length > 0) {
                setPrescriptions(prev => {
                    const combined = [...prev];
                    data.prescription.forEach((newP: any) => {
                        const index = combined.findIndex(p => p.medication.toLowerCase() === newP.medication.toLowerCase());
                        if (index > -1) combined[index] = newP;
                        else combined.push(newP);
                    });
                    return combined;
                });
            }

        } catch (error) {
            console.error("Gemini AI Analysis Error:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const requestPermissions = async () => {
        setIsGranting(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            // Artificial delay to show visual feedback as requested
            setTimeout(() => {
                setIsConsulting(true);
                setShowPermissionBridge(false);
                setIsGranting(false);
                if (recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (e) { }
                }
            }, 1000);

        } catch (err) {
            console.error("Permission denied:", err);
            setIsGranting(false);
            alert("Camera and Microphone access is required to start the consultation.");
        }
    };

    const handleToggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const handleToggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setVideoOn(videoTrack.enabled);
        }
    };

    const downloadClinicalReport = () => {
        setIsGeneratingPdf(true);
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleString();

            // Header
            doc.setFillColor(2, 6, 23); // Slate 950
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text("Care4You Healthcare", 20, 20);
            doc.setFontSize(10);
            doc.text(`Clinical Consultation Report | ${date}`, 20, 30);

            // Body
            doc.setTextColor(20, 20, 20);
            doc.setFontSize(14);
            doc.text("Patient Records & AI Intelligence", 20, 55);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 58, 190, 58);

            // Symptoms
            doc.setFontSize(12);
            doc.text("Extracted Symptoms:", 20, 70);
            doc.setFontSize(10);
            extractedSymptoms.forEach((s, i) => {
                doc.text(`• ${s.name} (${s.severity}) - Duration: ${s.duration}`, 25, 80 + (i * 7));
            });

            // Insights
            const insightStart = 90 + (extractedSymptoms.length * 7);
            doc.setFontSize(12);
            doc.text("AI Clinical Insights & Observations:", 20, insightStart);
            doc.setFontSize(10);
            clinicalInsights.forEach((insight, i) => {
                const lines = doc.splitTextToSize(insight, 160);
                doc.text(lines, 25, insightStart + 10 + (i * 10));
            });

            // Suggestions
            const suggestionStart = insightStart + 20 + (clinicalInsights.length * 10);
            doc.setFontSize(12);
            doc.text("Prescribed Medications & Suggestions:", 20, suggestionStart);
            doc.setFontSize(10);
            prescriptions.forEach((p, i) => {
                doc.text(`${i + 1}. ${p.medication} - ${p.dosage} (${p.frequency})`, 25, suggestionStart + 10 + (i * 7));
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Generated by Impectus AI Medical Assistant", 105, 285, { align: 'center' });

            doc.save(`clinical_report_${Date.now()}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleFinalize = async () => {
        try {
            await api.post('/api/consultation/finalize', {
                sessionId: 'session-' + Date.now(),
                finalRecord: { symptoms: extractedSymptoms, insights: clinicalInsights },
                finalRx: prescriptions
            });
            alert("Consultation finalized and records updated.");
            window.history.back();
        } catch (err) {
            console.error("Finalization failed:", err);
            alert("Failed to sync records. Proceeding anyway.");
            window.history.back();
        }
    };

    return (
        <DashboardLayout role="doctor" doctorType={doctorType as any} title="Live Consultation">
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[calc(100vh-8rem)]">

                {/* Main Video Area */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 relative bg-slate-950 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">

                        {/* Live Video Feed */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={clsx(
                                "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                                isConsulting && videoOn ? "opacity-100 scale-100" : "opacity-0 scale-105"
                            )}
                        />

                        {/* Waiting State Overlay */}
                        {!isConsulting && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl">
                                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
                                    <div className="relative inline-block">
                                        <div className="w-40 h-40 rounded-full bg-primary/10 border-2 border-white/5 flex items-center justify-center">
                                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                                            <Camera className="absolute w-12 h-12 text-primary opacity-50" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Ready to Connect</h2>
                                        <p className="text-slate-400 max-w-[280px] mx-auto text-sm font-medium">Your medical consultation is ready to begin.</p>
                                    </div>
                                    <Button
                                        onClick={() => setShowPermissionBridge(true)}
                                        className="bg-primary hover:bg-primary/90 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                                    >
                                        {t('established_link')}
                                        <ShieldCheck className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* AI Status Badge */}
                        <div className="absolute top-8 left-8 z-40 flex items-center gap-3 bg-black/40 backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-full">
                            <div className={clsx(
                                "w-2.5 h-2.5 rounded-full shadow-lg",
                                isAiActive && isConsulting ? "bg-emerald-400 shadow-emerald-500/50 animate-pulse" : "bg-white/20"
                            )} />
                            <div className="flex items-center gap-2">
                                <Brain className={clsx("w-4 h-4", isAiActive && isConsulting ? "text-blue-400" : "text-white/40")} />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                    {isAiActive && isConsulting ? "Neural Processing Active" : "Neural Link Idle"}
                                </span>
                            </div>
                        </div>

                        {/* Transcript Overlay */}
                        {isConsulting && transcript.length > 0 && (
                            <div className="absolute bottom-36 left-8 right-8 z-40 flex flex-col items-start gap-3 pointer-events-none">
                                {transcript.slice(-2).map((line, idx) => (
                                    <div
                                        key={idx}
                                        className={clsx(
                                            "bg-black/60 backdrop-blur-3xl px-6 py-3.5 rounded-[1.5rem] border border-white/10 text-sm font-semibold animate-in slide-in-from-bottom-4 duration-500 shadow-2xl",
                                            line.startsWith('Doctor') ? "text-blue-400 border-blue-500/20" : "text-white"
                                        )}
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Floating Patient Avatar */}
                        {isConsulting && (
                            <div className="absolute bottom-36 right-8 w-52 aspect-square bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-right-12 duration-1000 group-hover:scale-105 transition-transform">
                                <img
                                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=Gurpreet"
                                    alt="Patient"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center justify-between border border-white/5">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Gurpreet</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                </div>
                            </div>
                        )}

                        {/* Controls Bar */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-3xl px-6 py-3.5 rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] z-50 max-w-[90vw] md:max-w-none overflow-x-auto no-scrollbar">
                            <ControlBtn icon={micOn ? Mic : MicOff} isActive={micOn} onClick={handleToggleMic} />
                            <ControlBtn icon={videoOn ? Video : VideoOff} isActive={videoOn} onClick={handleToggleVideo} />
                            <ControlBtn
                                icon={PhoneOff}
                                isActive={false}
                                onClick={handleFinalize}
                                className="bg-rose-500 hover:bg-rose-600 border-none text-white w-12 h-12 md:w-14 md:h-14 shadow-2xl shadow-rose-500/30"
                            />
                            <ControlBtn icon={Brain} isActive={isAiActive} onClick={() => setIsAiActive(!isAiActive)} />
                            <ControlBtn icon={MessageSquare} isActive={false} onClick={() => { }} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Panel */}
                <div className="w-full lg:w-[440px] flex flex-col gap-5 h-full overflow-y-auto pr-1 pb-10 no-scrollbar">

                    {/* AI Processed Extraction */}
                    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl p-6 shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary relative">
                                    <Sparkles className="w-5 h-5" />
                                    {isAnalyzing && <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Clinical AI</h3>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Extraction</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-2.5 h-2.5" /> {t('symptoms')}
                                </h4>
                                <div className="space-y-2">
                                    {extractedSymptoms.length > 0 ? (
                                        extractedSymptoms.slice(0, 2).map((s, i) => (
                                            <div key={i} className="flex items-center justify-between p-3.5 rounded-[1.2rem] bg-white/[0.03] border border-white/5 group hover:border-primary/30 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx(
                                                        "w-2 h-2 rounded-full",
                                                        s.severity.toLowerCase() === 'high' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                    )} />
                                                    <div>
                                                        <p className="font-bold text-white text-xs">{s.name}</p>
                                                        <p className="text-[8px] text-gray-500 font-bold uppercase">{s.duration} • {s.severity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-6 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-white/5 rounded-[1.8rem]">
                                            <Loader2 className="w-6 h-6 mb-2 animate-spin text-primary" />
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em]">Syncing...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ClipboardCheck className="w-2.5 h-2.5" /> {t('rx_suggestions')}
                                </h4>
                                <div className="space-y-2">
                                    {prescriptions.map((px, i) => (
                                        <div key={i} className="p-3.5 rounded-[1.2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between animate-in slide-in-from-right duration-500">
                                            <div>
                                                <p className="font-black text-indigo-400 text-xs tracking-wide uppercase">{px.medication}</p>
                                                <p className="text-[8px] text-gray-400 font-bold mt-0.5">{px.dosage} • {px.frequency}</p>
                                            </div>
                                            <button className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                <Plus className="w-3 h-3 text-indigo-400" />
                                            </button>
                                        </div>
                                    ))}
                                    {prescriptions.length === 0 && (
                                        <div className="p-3.5 rounded-[1.2rem] bg-white/[0.02] border border-white/5 text-center">
                                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest py-1">Awaiting prescriptions</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* New AI Insights Section */}
                            <div className="pt-4 border-t border-white/5">
                                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles className="w-2.5 h-2.5" /> {t('discovery_points')}
                                </h4>
                                <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar">
                                    {clinicalInsights.map((insight, i) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 animate-in fade-in duration-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            <p className="text-[10px] text-gray-300 font-medium leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                    {clinicalInsights.length === 0 && (
                                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest italic text-center py-2">Listening to patient details...</p>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={downloadClinicalReport}
                                disabled={isGeneratingPdf || (clinicalInsights.length === 0 && extractedSymptoms.length === 0)}
                                className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-2"
                            >
                                {isGeneratingPdf ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                                {t('export_pdf')}
                            </Button>
                        </div>
                    </Card>

                </div>
            </div>

            {showPermissionBridge && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-[12px] animate-in fade-in duration-500 px-6">
                    <Card className="w-full max-w-lg bg-slate-900/90 border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-secondary" />

                        <div className="flex flex-col items-center text-center space-y-8">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{t('clinical_protocol')}</h1>
                                <p className="text-gray-400 text-base leading-relaxed font-medium">
                                    To begin your session, we need optical and audio intake access.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                                    <Camera className={clsx("w-7 h-7 transition-colors", stream?.getVideoTracks().length ? "text-emerald-400" : "text-gray-600")} />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Optical</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                                    <Mic className={clsx("w-7 h-7 transition-colors", stream?.getAudioTracks().length ? "text-emerald-400" : "text-gray-600")} />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Audio</span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full pt-2">
                                <Button
                                    onClick={() => setShowPermissionBridge(false)}
                                    variant="ghost"
                                    className="flex-1 h-12 rounded-xl border border-white/5 font-bold text-gray-500 uppercase tracking-widest text-[9px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={requestPermissions}
                                    disabled={isGranting}
                                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-sm shadow-xl shadow-primary/20"
                                >
                                    {isGranting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : t('access_system')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

const ControlBtn = ({ icon: Icon, isActive, onClick, className }: any) => (
    <button
        onClick={onClick}
        className={clsx(
            "p-3.5 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] transition-all duration-500 border flex items-center justify-center shadow-xl group",
            className || (isActive
                ? "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95"
                : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 hover:scale-110 active:scale-95")
        )}
    >
        <Icon className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-6 transition-transform" />
    </button>
);

export default Consultation;
