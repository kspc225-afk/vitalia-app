/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './services/store';
import { Header } from './components/common/Header';
import { DemoSwitcherModal } from './components/common/DemoSwitcherModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { DoctorLayout } from './components/doctor/DoctorLayout';
import { PatientLayout } from './components/patient/PatientLayout';
import { LabLayout } from './components/lab/LabLayout';

const AppContent: React.FC = () => {
  const { currentUser } = useStore();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const renderActiveSpace = () => {
    switch (currentUser.role) {
      case 'admin':
      case 'secretary':
        return <AdminLayout />;
      case 'doctor':
        return <DoctorLayout />;
      case 'lab':
        return <LabLayout />;
      case 'patient':
        return <PatientLayout />;
      default:
        return <AdminLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-slate-700 selection:text-white">
      {/* Top Header with official logo & role switcher */}
      <Header
        onOpenDemoInfo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Role-Specific Space */}
      <div className="flex-1 flex flex-col">{renderActiveSpace()}</div>

      {/* Demo Switcher & Technical Guide Modal */}
      <DemoSwitcherModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Persistent Interconnection Notice Bar */}
      <footer className="no-print bg-slate-900 text-slate-400 py-3 px-4 border-t border-slate-800 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span>
              <strong>Système Centralisé Clinique Vitalia :</strong> Les modifications effectuées par l'un des espaces
              sont immédiatement répercutées en temps réel sur les autres interfaces.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-slate-300 hover:text-white hover:underline font-semibold cursor-pointer"
            >
              Guide & Comptes Démo
            </button>
            <span>·</span>
            <span>Clinique Vitalia © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
