import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const VideoConsultation = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<RTCPeerConnection | null>(null);
    const ROOM_ID = "consultation-room-1"; // Hardcoded for Demo

    useEffect(() => {
        setupCamera();

        socket.emit('join-room', ROOM_ID, 'doctor-1');

        socket.on('user-connected', (userId) => {
            console.log("User connected:", userId);
            setStatus('Patient Connected - Ready to Call');
        });

        socket.on('offer', async (offer) => {
            console.log("Received Offer");
            const peer = createPeer();
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit('answer', { answer, roomId: ROOM_ID });
            connectionRef.current = peer;
            setStatus('Call Active');
        });

        socket.on('answer', async (answer) => {
            console.log("Received Answer");
            if (connectionRef.current) {
                await connectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setStatus('Call Active');
            }
        });

        socket.on('ice-candidate', async (candidate) => {
            if (connectionRef.current) {
                await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socket.off('user-connected');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setupCamera = async () => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatus('Camera Error');
        }
    };

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate, roomId: ROOM_ID });
            }
        };

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            if (userVideo.current) {
                userVideo.current.srcObject = event.streams[0];
            }
        };

        if (stream) {
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        return peer;
    };

    const startCall = async () => {
        setStatus('Calling...');
        const peer = createPeer();
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit('offer', { offer, roomId: ROOM_ID });
        connectionRef.current = peer;
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !isVideoOff;
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        connectionRef.current?.close();
        setStatus('Call Ended');
        setRemoteStream(null);
        window.location.reload();
    };

    return (
        <DashboardLayout role="doctor" title="Tele-Consultation">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8 h-auto lg:h-[calc(100vh-10rem)] pb-20 lg:pb-0">
                {/* Main Video Area */}
                <Card className="lg:col-span-2 relative overflow-hidden bg-black border-slate-800 flex flex-col">
                    <div className="flex-1 relative">
                        {/* Remote Video (Patient) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {remoteStream ? (
                                <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <Users className="w-16 h-16 mb-4 opacity-50" />
                                    <p>Waiting for patient to join...</p>
                                    <p className="text-xs mt-2 text-slate-600">ID: {ROOM_ID}</p>
                                </div>
                            )}
                        </div>

                        {/* Local Video (Doctor) */}
                        <div className="absolute bottom-4 right-4 w-32 h-24 xs:w-48 xs:h-36 bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
                            <video ref={myVideo} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="h-20 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex items-center justify-center gap-6">
                        <Button
                            variant="secondary"
                            size="icon"
                            className={`rounded-full shadow-lg ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : ''}`}
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </Button>

                        <Button
                            variant="secondary"
                            size="icon"
                            className={`rounded-full shadow-lg ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : ''}`}
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </Button>

                        <Button
                            className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                            onClick={endCall}
                        >
                            <PhoneOff className="w-5 h-5 mr-2" /> End Call
                        </Button>
                        <Button
                            className="rounded-full px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                            onClick={startCall}
                            disabled={status === 'Calling...' || status === 'Call Active'}
                        >
                            <Video className="w-5 h-5 mr-2" /> Start Call
                        </Button>
                    </div>
                </Card>

                {/* Sidebar: Patient Info & Chat */}
                <div className="space-y-6 flex flex-col h-full">
                    <Card>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                                RS
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Rahul Sharma</h3>
                                <p className="text-sm text-gray-400">Age: 32 • ID: #P-1249</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Chief Complaint</p>
                                <p className="text-sm text-gray-200">Severe joint pain, difficulty moving left arm.</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Vitals (Live)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">BP</p>
                                        <p className="font-mono font-medium text-white">120/80</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Pulse</p>
                                        <p className="font-mono font-medium text-white">72 bpm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="flex-1 p-4 flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-400 mb-4">Session Notes</h3>
                        <textarea
                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-primary/50"
                            placeholder="Type consultation notes here..."
                        />
                        <Button className="mt-4" variant="outline" size="sm">Save to EMR</Button>
                    </Card>

                    <div className="text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status === 'Call Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-gray-400'}`}>
                            Status: {status}
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VideoConsultation;
