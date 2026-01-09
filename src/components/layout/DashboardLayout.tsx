import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Users,
  Calendar,
  Settings, User,
  LogOut,
  Menu,
  Bell,
  Search,
  Clock,
} from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "../../context/LanguageContext";


interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  translationKey: string;
}

const Sidebar = ({
  isOpen,
  onClose,
  role,
  doctorType,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: "doctor" | "admin" | "pharmacist";
  doctorType?: string;
}) => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const doctorItems: SidebarItem[] = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      translationKey: "nav_overview",
      path: doctorType ? `/doctor/${doctorType}` : "/doctor/general",
    },
    {
      icon: Clock,
      label: "Appointments",
      translationKey: "nav_appointments",
      path: doctorType ? `/doctor/${doctorType}/appointments` : "/doctor/general/appointments",
    },
    {
      icon: Calendar,
      label: "Schedule",
      translationKey: "nav_schedule",
      path: doctorType ? `/doctor/${doctorType}/schedule` : "/doctor/general/schedule",
    },
    {
      icon: Users,
      label: "Patients",
      translationKey: "nav_patients",
      path: doctorType ? `/doctor/${doctorType}/patients` : "/doctor/general/patients",
    },
    { icon: Video, label: "Consultations", translationKey: "nav_consultations", path: "/doctor/consultations" },
    { icon: User, label: "Profile", translationKey: "nav_profile", path: doctorType ? `/doctor/${doctorType}/profile` : "/doctor/profile" },
  ];

  const adminItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Overview", translationKey: "nav_overview", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", translationKey: "nav_patients", path: "/admin/users" },
    { icon: Calendar, label: "Reports", translationKey: "nav_schedule", path: "/admin/reports" },
    { icon: Settings, label: "System Settings", translationKey: "nav_overview", path: "/admin/settings" },
  ];

  const pharmacistItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Inventory", translationKey: "nav_overview", path: "/pharmacy/inventory" },
    { icon: Calendar, label: "Prescriptions", translationKey: "nav_appointments", path: "/pharmacy/prescriptions" },
    { icon: Users, label: "Orders", translationKey: "nav_patients", path: "/pharmacy/orders" },
  ];

  const items =
    role === "doctor"
      ? doctorItems
      : role === "admin"
        ? adminItems
        : pharmacistItems;

  const handleSignOut = async () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('adminToken');
    navigate("/", { replace: true });
  };

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary shrink-0">
              Care4You
            </span>

            {/* Language Selector Next to Logo in Sidebar */}
            <div className="flex items-center p-0.5 bg-white/5 rounded-xl border border-white/10 ml-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg text-[8px] font-bold transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg text-[8px] font-bold transition-all ${language === 'hi' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                हिं
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded-lg text-[8px] font-bold transition-all ${language === 'bn' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                বাং
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {items.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/doctor' && item.path !== '/admin' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-5 h-5",
                      isActive
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-white"
                    )}
                  />
                  <span className="font-medium">{t(item.translationKey)}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#FF9FFC]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('sign_out')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({
  onMenuClick,
  title,
  doctorType,
}: {
  onMenuClick: () => void;
  title: string;
  doctorType?: string;
}) => {
  return (
    <header className="h-16 md:h-20 sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-white truncate max-w-[150px] xs:max-w-none">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search - hidden on mobile for MVP brevity */}
        <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search patients..."
            className="bg-transparent border-none focus:outline-none text-sm w-48 text-white placeholder:text-gray-500"
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
        </button>

        <Link
          to={doctorType ? `/doctor/${doctorType}/profile` : "/doctor/profile"}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 hover:scale-110 transition-transform cursor-pointer"
        >
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-full h-full rounded-full bg-slate-900"
          />
        </Link>
      </div>
    </header>
  );
};

export const DashboardLayout = ({
  children,
  role = "doctor",
  doctorType,
  title = "Dashboard",
}: {
  children: React.ReactNode;
  role?: "doctor" | "admin" | "pharmacist";
  doctorType?: "general" | "homeopathy" | "ayurvedic";
  title?: string;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        doctorType={doctorType}
      />

      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} doctorType={doctorType} />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};
