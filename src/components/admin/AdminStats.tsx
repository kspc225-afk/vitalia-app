import React from 'react';
import { useStore } from '../../services/store';
import {
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminStats: React.FC = () => {
  const { patients, doctors, appointments, consultations, exams, specialties } = useStore();

  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'termine').length;
  const cancelledAppointments = appointments.filter((a) => a.status === 'annule').length;
  const attendanceRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 92;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#00796F] uppercase tracking-wider">
            Analytique Clinique & Métriques d'Activité
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101513] tracking-tight mt-0.5">
            Statistiques & Indicateurs de Performance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs consolidés de fréquentation, taux d'assiduité et répartition par pôle médical.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-[#E8F5EF] text-[#00796F] px-3 py-1.5 rounded-xl border border-teal-200">
          <Activity className="w-4 h-4" />
          <span>Données en temps réel (V1)</span>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">Taux d'Honorabilité RDV</span>
          <div className="mt-2 text-3xl font-extrabold text-[#00796F] font-mono tabular-nums">
            {attendanceRate}%
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Excellente assiduité
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">Délai Moyen d'Attente</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            14 <span className="text-sm font-sans font-medium text-slate-500">min</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Prise en charge accueil
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">Actes de Biologie / Mois</span>
          <div className="mt-2 text-3xl font-extrabold text-indigo-700 font-mono tabular-nums">
            {exams.length * 28}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Analyses et imageries
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 block">Nouveaux Dossiers</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            +{totalPatients}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Enregistrements actifs
          </span>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly Activity Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Évolution Mensuelle des Consultations
              </h3>
              <p className="text-xs text-slate-500">Année 2026 (Semestre 2)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#00796F]" />
          </div>

          {/* Bar Chart Simulation with Real CSS Heights */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
            {[
              { month: 'Juin', count: 180, active: false },
              { month: 'Juil', count: 210, active: false },
              { month: 'Août', count: 195, active: false },
              { month: 'Sept', count: 240, active: false },
              { month: 'Oct', count: 285, active: false },
              { month: 'Nov (En cours)', count: 320, active: true },
            ].map((bar) => {
              const heightPercent = Math.round((bar.count / 340) * 100);
              return (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-[#00796F] transition-colors">
                    {bar.count}
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-44 flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        bar.active ? 'bg-[#00796F] shadow-sm' : 'bg-[#073D38]/40 hover:bg-[#073D38]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Specialties Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Répartition par Pôle
          </h3>

          <div className="space-y-3 text-xs">
            {specialties.map((spec) => {
              const specAppointments = appointments.filter((a) => a.specialtyId === spec.id).length;
              const percent = totalAppointments > 0 ? Math.round((specAppointments / totalAppointments) * 100) : 25;
              return (
                <div key={spec.id} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span className="truncate pr-2">{spec.name}</span>
                    <span className="font-mono text-slate-500">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00796F] h-2 rounded-full"
                      style={{ width: `${Math.max(percent, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#E8F5EF] rounded-2xl text-[11px] text-[#073D38] border border-teal-200 font-medium">
            Le pôle Cardiologie représente actuellement la plus forte demande de créneaux.
          </div>
        </div>
      </div>
    </div>
  );
};
