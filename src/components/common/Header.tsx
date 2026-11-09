import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { OsirixLogo } from './OsirixLogo';
import { UserRole } from '../../types';
import {
  Bell,
  CheckCircle,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Info,
  Check,
} from 'lucide-react';

interface HeaderProps {
  onOpenDemoInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemoInfo,
}) => {
  const {
    currentUser,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDatabase,
  } = useStore();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Filter notifications relevant to current user or role
  const relevantNotifs = notifications.filter(
    (n) => n.userId === currentUser.id || n.targetRole === currentUser.role || !n.targetRole
  );
  const unreadCount = relevantNotifs.filter((n) => !n.isRead).length;

  const rolesList: { role: UserRole; label: string; name: string; badge: string }[] = [
    { role: 'admin', label: 'Administration', name: 'Dr. Amadou Touré', badge: 'Admin Général' },
    { role: 'secretary', label: 'Secrétariat', name: 'Mariam Coulibaly', badge: 'Accueil & Planning' },
    { role: 'doctor', label: 'Espace Médecin', name: 'Dr. Estelle Yao', badge: 'Cardiologie' },
    { role: 'lab', label: 'Laboratoire', name: 'Ibrahim Diop', badge: 'Biologiste' },
    { role: 'patient', label: 'Espace Patient', name: 'Koffi Jean-Marc', badge: 'Patient ID #001' },
  ];

  const handleRoleSelect = (r: UserRole) => {
    switchRole(r);
    setShowRoleMenu(false);
  };

  const handleReset = () => {
    if (resetConfirm) {
      resetDatabase();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark & Logo */}
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <OsirixLogo size="md" />
            <div className="hidden xl:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Abidjan</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Plateforme V1 Active
              </span>
            </div>
          </div>

          {/* Interactive Role Switcher Pill Bar */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            {rolesList.map((item) => {
              const isActive = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item.role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`Tester en tant que ${item.name} (${item.label})`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Zone: Controls, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Mobile/Tablet Role Switcher Dropdown */}
            <div className="relative lg:hidden">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              >
                <span>Espace : {rolesList.find((r) => r.role === currentUser.role)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Changer d'espace utilisateur
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleSelect(item.role)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        currentUser.role === item.role ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.name}</div>
                      </div>
                      {currentUser.role === item.role && <Check className="w-4 h-4 text-slate-800" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Demo & Architecture Guide button */}
            <button
              onClick={onOpenDemoInfo}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Guide des rôles & Architecture Clinique Vitalia"
              aria-label="Guide de démonstration"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleReset}
              className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                resetConfirm
                  ? 'bg-rose-100 text-rose-700 font-bold border border-rose-300'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={
                resetConfirm
                  ? 'Cliquer pour confirmer la réinitialisation'
                  : 'Réinitialiser la base de démonstration'
              }
              aria-label="Réinitialiser données"
            >
              <RotateCcw className={`w-4 h-4 ${resetConfirm ? 'animate-spin' : ''}`} />
              {resetConfirm && <span className="hidden sm:inline text-[11px]">Confirmer ?</span>}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-slate-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                          {unreadCount} nouvelle(s)
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-medium text-slate-700 hover:underline cursor-pointer"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {relevantNotifs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      relevantNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-slate-100/70' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`font-semibold ${
                                !n.isRead ? 'text-slate-950 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {n.title}
                            </span>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(n.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current Active User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 leading-none uppercase">
                  {currentUser.role === 'admin'
                    ? 'Administrateur'
                    : currentUser.role === 'secretary'
                    ? 'Secrétariat'
                    : currentUser.role === 'doctor'
                    ? 'Médecin'
                    : currentUser.role === 'lab'
                    ? 'Laboratoire'
                    : 'Patient'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
