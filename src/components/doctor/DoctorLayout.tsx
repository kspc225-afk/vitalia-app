import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { DoctorDashboard } from './DoctorDashboard';
import { DoctorPlanning } from './DoctorPlanning';
import { DoctorPatients } from './DoctorPatients';
import { DoctorConsultation } from './DoctorConsultation';
import { DoctorPrescriptions } from './DoctorPrescriptions';
import { DoctorMessaging } from './DoctorMessaging';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Pill,
  MessageSquare,
} from 'lucide-react';

export const DoctorLayout: React.FC = () => {
  const { messages, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [consultationMeta, setConsultationMeta] = useState<{
    appointmentId?: string;
    patientId?: string;
  }>({});

  const unreadMessagesCount = messages.filter(
    (m) => m.receiverId === currentUser.id && !m.isRead
  ).length;

  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'consultation' && meta) {
      setConsultationMeta(meta);
    }
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'planning', label: 'Mon planning', icon: Calendar },
    { id: 'patients', label: 'Mes patients', icon: Users },
    { id: 'consultation', label: 'Consultation', icon: Stethoscope },
    { id: 'prescriptions', label: 'Ordonnances', icon: Pill },
    {
      id: 'messages',
      label: 'Messagerie',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col">
      {/* Doctor Top Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 shadow-2xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-slate-700 text-slate-100 font-extrabold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <DoctorDashboard onNavigate={handleNavigate} />}
        {activeTab === 'planning' && (
          <DoctorPlanning
            onStartConsultation={(aptId, patId) =>
              handleNavigate('consultation', { appointmentId: aptId, patientId: patId })
            }
          />
        )}
        {activeTab === 'patients' && (
          <DoctorPatients
            onStartConsultation={(patId) => handleNavigate('consultation', { patientId: patId })}
          />
        )}
        {activeTab === 'consultation' && (
          <DoctorConsultation
            initialAppointmentId={consultationMeta.appointmentId}
            initialPatientId={consultationMeta.patientId}
            onFinished={() => setActiveTab('planning')}
          />
        )}
        {activeTab === 'prescriptions' && <DoctorPrescriptions />}
        {activeTab === 'messages' && <DoctorMessaging />}
      </main>
    </div>
  );
};
