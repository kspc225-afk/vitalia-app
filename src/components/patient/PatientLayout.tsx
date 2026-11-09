import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { PatientDashboard } from './PatientDashboard';
import { PatientBookAppointment } from './PatientBookAppointment';
import { PatientAppointments } from './PatientAppointments';
import { PatientDossierMedical } from './PatientDossierMedical';
import { PatientDoctorChat } from './PatientDoctorChat';
import { PatientProfile } from './PatientProfile';
import { PhoneMockup } from '../common/PhoneMockup';
import {
  Home,
  Calendar,
  FolderHeart,
  MessageSquare,
  User,
  Smartphone,
  Maximize2,
  Plus,
} from 'lucide-react';

export const PatientLayout: React.FC = () => {
  const { messages, exams, currentUser, patients } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'messages' | 'profile'>('dashboard');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMockupMode, setIsMockupMode] = useState(true);

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const unreadMessagesCount = messages.filter(
    (m) => m.receiverId === currentUser.id && !m.isRead
  ).length;

  const publishedExamsCount = exams.filter(
    (e) => e.patientId === currentPatient.id && e.status === 'publie'
  ).length;

  // The 5 strict mobile navigation items required by Section 3
  const navItems = [
    { id: 'dashboard' as const, label: 'Accueil', icon: Home },
    { id: 'appointments' as const, label: 'Rendez-vous', icon: Calendar },
    {
      id: 'records' as const,
      label: 'Dossier',
      icon: FolderHeart,
      badge: publishedExamsCount > 0 ? `${publishedExamsCount}` : undefined,
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
    },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  const renderActiveScreen = () => {
    if (isBookingOpen) {
      return (
        <div className="p-4 sm:p-5">
          <button
            onClick={() => setIsBookingOpen(false)}
            className="mb-3 text-xs font-bold text-[#00796F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Retour à l'accueil
          </button>
          <PatientBookAppointment onSuccess={() => { setIsBookingOpen(false); setActiveTab('appointments'); }} />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4 sm:p-5">
            <PatientDashboard
              onNavigate={(tab) => {
                if (tab === 'book') setIsBookingOpen(true);
                else if (tab === 'appointments') setActiveTab('appointments');
                else if (tab === 'records' || tab === 'results' || tab === 'record' || tab === 'prescriptions') setActiveTab('records');
                else if (tab === 'chat') setActiveTab('messages');
                else if (tab === 'profile') setActiveTab('profile');
              }}
            />
          </div>
        );
      case 'appointments':
        return (
          <div className="p-4 sm:p-5">
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#00796F] text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau RDV</span>
              </button>
            </div>
            <PatientAppointments />
          </div>
        );
      case 'records':
        return (
          <div className="p-4 sm:p-5">
            <PatientDossierMedical />
          </div>
        );
      case 'messages':
        return (
          <div className="p-4 sm:p-5">
            <PatientDoctorChat />
          </div>
        );
      case 'profile':
        return (
          <div className="p-4 sm:p-5">
            <PatientProfile />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F3F5F4] flex flex-col">
      {/* Top Controls Bar: Switch between Smartphone Mockup View and Fullscreen Mode */}
      <div className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs sticky top-16 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#101513]">Application Patient OSIRIX</span>
            <span className="text-slate-400">·</span>
            <span className="text-[#00796F] font-semibold">Mobile-First</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMockupMode(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMockupMode
                  ? 'bg-[#073D38] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mockup Smartphone</span>
            </button>
            <button
              onClick={() => setIsMockupMode(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                !isMockupMode
                  ? 'bg-[#00796F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plein Écran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {isMockupMode ? (
        /* Realistic Phone Mockup Mode (Matches Reference Visual Direction) */
        <div className="flex-1 py-4 px-2 sm:py-8 flex justify-center items-start bg-radial from-slate-200/50 to-transparent">
          <PhoneMockup>
            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto pb-16">{renderActiveScreen()}</div>

            {/* Bottom 5-Tab Navigation Bar inside the Phone */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-30 shadow-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !isBookingOpen;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsBookingOpen(false);
                      setActiveTab(item.id);
                    }}
                    className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer relative ${
                      isActive ? 'text-[#00796F]' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-2 bg-[#F5A900] text-[#101513] text-[9px] font-extrabold px-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${isActive ? 'font-extrabold text-[#00796F]' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </PhoneMockup>
        </div>
      ) : (
        /* Fullscreen Responsive Mode */
        <div className="flex-1 max-w-2xl mx-auto w-full pb-20">
          {renderActiveScreen()}

          {/* Sticky Bottom Navigation in Fullscreen */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around z-40 shadow-lg max-w-2xl mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isBookingOpen;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsBookingOpen(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer relative ${
                    isActive ? 'text-[#00796F]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 bg-[#F5A900] text-[#101513] text-[9px] font-extrabold px-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'font-extrabold text-[#00796F]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
