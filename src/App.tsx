import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';

import HomeopathyDashboard from './pages/doctor/HomeopathyDashboard';
import AyurvedicDashboard from './pages/doctor/AyurvedicDashboard';
import GeneralPhysicianDashboard from './pages/doctor/GeneralPhysicianDashboard';
import GeneralAppointments from './pages/doctor/GeneralAppointments';
import GeneralPatients from './pages/doctor/GeneralPatients';
import HomeopathyAppointments from './pages/doctor/HomeopathyAppointments';
import HomeopathyPatients from './pages/doctor/HomeopathyPatients';
import AyurvedicAppointments from './pages/doctor/AyurvedicAppointments';
import AyurvedicPatients from './pages/doctor/AyurvedicPatients';
import Consultation from './pages/doctor/Consultation';
import VideoConsultation from './pages/doctor/VideoConsultation';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import PatientProfile from './pages/doctor/PatientProfile';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import PharmacyInventory from './pages/pharmacy/Inventory';
import { NavBar } from './components/ui/tubelight-navbar';
import { Home, User, Phone, ShieldCheck } from 'lucide-react';
import AuthCallback from './pages/AuthCallback';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const ProtectedRoute = ({ children, requiredRole = 'doctor' }: { children: React.ReactNode; requiredRole?: 'doctor' | 'admin' }) => {
  const token = localStorage.getItem(requiredRole === 'admin' ? 'adminToken' : 'doctorToken');

  if (!token) {
    return <Navigate to={requiredRole === 'admin' ? "/admin/login" : "/login"} replace />;
  }

  // In a production app, we would decode the JWT here to check status.
  // For now, we'll assume the presence of the token means authenticated,
  // but Login.tsx already handles the logic of not giving a token if rejected.
  return <>{children}</>;
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const isPublic = ['/', '/about', '/contact', '/admin/login', '/login', '/auth/callback'].includes(location.pathname);

  const navItems = [
    { name: t('nav_home'), url: '/', icon: Home },
    { name: t('nav_about'), url: '/about', icon: User },
    { name: t('nav_contact'), url: '/contact', icon: Phone },
    { name: t('nav_admin'), url: '/admin/login', icon: ShieldCheck },
  ];

  return (
    <>
      {isPublic && (
        <>
          <NavBar items={navItems} />
          {/* Unified Public Header */}
          <header className="fixed top-0 left-0 right-0 z-[100] px-3 md:px-6 py-3 md:py-4 pointer-events-none">
            <div className="container mx-auto flex items-center justify-between gap-2 md:gap-4">
              {/* Left: Logo & Language */}
              <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                <div className="text-sm md:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 shrink-0 hidden xs:block">
                  Care4You
                </div>

                <div className="flex items-center p-0.5 bg-slate-900/60 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-xl text-[8px] md:text-[10px] font-bold transition-all ${language === 'hi' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    हिं
                  </button>
                  <button
                    onClick={() => setLanguage('bn')}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-xl text-[8px] md:text-[10px] font-bold transition-all ${language === 'bn' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    বাং
                  </button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                <a
                  href="https://aushadi.free.nf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-[10px] md:text-xs font-bold px-2 hidden lg:block"
                >
                  AUSHADI
                </a>

                <Link to="/login">
                  <button className="text-gray-400 hover:text-white transition-colors text-[10px] md:text-xs font-bold px-3 py-2 uppercase tracking-widest hidden sm:block">
                    {t('login')}
                  </button>
                </Link>

                <button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white text-[8px] md:text-[10px] px-3 md:px-5 h-8 md:h-10 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20 shrink-0">
                  {t('download_app')}
                </button>
              </div>
            </div>
          </header>
        </>
      )}
      {children}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <PublicLayout>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Doctor Routes */}
            <Route path="/doctor/homeopathy" element={<ProtectedRoute><HomeopathyDashboard /></ProtectedRoute>} />
            <Route path="/doctor/homeopathy/appointments" element={<ProtectedRoute><HomeopathyAppointments /></ProtectedRoute>} />
            <Route path="/doctor/homeopathy/patients" element={<ProtectedRoute><HomeopathyPatients /></ProtectedRoute>} />

            <Route path="/doctor/ayurvedic" element={<ProtectedRoute><AyurvedicDashboard /></ProtectedRoute>} />
            <Route path="/doctor/ayurvedic/appointments" element={<ProtectedRoute><AyurvedicAppointments /></ProtectedRoute>} />
            <Route path="/doctor/ayurvedic/patients" element={<ProtectedRoute><AyurvedicPatients /></ProtectedRoute>} />

            <Route path="/doctor/general" element={<ProtectedRoute><GeneralPhysicianDashboard /></ProtectedRoute>} />
            <Route path="/doctor/general/appointments" element={<ProtectedRoute><GeneralAppointments /></ProtectedRoute>} />
            <Route path="/doctor/general/patients" element={<ProtectedRoute><GeneralPatients /></ProtectedRoute>} />

            <Route path="/doctor/:doctorType/schedule" element={<ProtectedRoute><DoctorSchedule /></ProtectedRoute>} />

            <Route path="/doctor/consultations" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/doctor/:doctorType/consultations" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/doctor/video-consult" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/:doctorType/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/patient/:patientId" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
            <Route path="/pharmacy/inventory" element={<PharmacyInventory />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PublicLayout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
