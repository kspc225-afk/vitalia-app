import React from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Microscope,
  FileCheck2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    patients,
    doctors,
    appointments,
    consultations,
    exams,
    auditLogs,
    specialties,
  } = useStore();

  const TODAY = '2026-11-08';

  // Dynamic KPI computations from real store data
  const totalPatients = patients.length;
  const newPatientsThisMonth = patients.filter((p) => p.registeredAt.startsWith('2026-11')).length;
  const todayAppointments = appointments.filter((a) => a.date === TODAY);
  const pendingAppointments = appointments.filter((a) => a.status === 'en_attente');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirme');
  const completedConsultations = consultations.length;
  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const pendingValidationExams = exams.filter(
    (e) => e.status === 'disponible' || e.status === 'en_validation'
  );

  // Specialty consultation count distribution
  const specialtyStats = specialties.map((spec) => {
    const count = appointments.filter((a) => a.specialtyId === spec.id).length;
    return {
      name: spec.name,
      code: spec.code,
      count,
    };
  });

  const nextAppointments = [...appointments]
    .filter((a) => a.status !== 'termine' && a.status !== 'annule')
    .slice(0, 5);

  const recentLogs = auditLogs.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Supervision Clinique en Direct
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Tableau de Bord Administratif
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs consolidés en temps réel pour l'ensemble des services de la Clinique Vitalia.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-mono">
          <Calendar className="w-4 h-4 text-slate-700" />
          <span>Dimanche 8 Novembre 2026</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-900">
            <span className="text-xs font-semibold text-slate-500">Patients Enregistrés</span>
            <Users className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalPatients}
            </span>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              +{newPatientsThisMonth} ce mois
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dossiers médicaux actifs</p>
        </div>

        {/* RDV du jour */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-900">
            <span className="text-xs font-semibold text-slate-500">Rendez-vous du Jour</span>
            <Calendar className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {todayAppointments.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {todayAppointments.filter((a) => a.status === 'termine').length} terminés
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {todayAppointments.filter((a) => a.status === 'arrive').length} patient(s) en salle
          </p>
        </div>

        {/* RDV en attente */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600">
            <span className="text-xs font-semibold text-slate-500">Demandes en Attente</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {pendingAppointments.length}
            </span>
            {pendingAppointments.length > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Action requise
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">À valider par le secrétariat</p>
        </div>

        {/* Résultats en attente */}
        <div
          onClick={() => onNavigate('exams')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
            <span className="text-xs font-semibold text-slate-500">Examens à Valider</span>
            <Microscope className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {pendingValidationExams.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Biologie / Imagerie</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avant publication au patient</p>
        </div>
      </div>

      {/* Second Row: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-emerald-800 font-semibold">Consultations Clôturées</div>
            <div className="text-lg font-bold text-emerald-950 tabular-nums">
              {completedConsultations} actes médicaux
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-700 font-semibold">Médecins Actifs</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {activeDoctors} praticiens disponibles
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-700 font-semibold">Rendez-vous Confirmés</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {confirmedAppointments.length} rendez-vous programmés
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Appointments & Specialties Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prochains Rendez-vous & Alertes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Alerts Box if any pending */}
          {pendingAppointments.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingAppointments.length} Demande(s) de consultation en ligne reçue(s)
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Des patients attendent la confirmation de leur créneau horaire ou l'attribution d'un praticien.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
              >
                Traiter maintenant
              </button>
            </div>
          )}

          {/* Prochains Rendez-vous Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Prochains Rendez-vous</h3>
                <p className="text-xs text-slate-500">Planning général de la clinique</p>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-slate-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Voir le calendrier complet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Réf.</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Médecin & Spécialité</th>
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nextAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">{apt.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{apt.patientName}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{apt.specialtyName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-medium text-slate-800">{apt.date}</div>
                        <div className="text-slate-500">{apt.time} ({apt.durationMinutes} min)</div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Répartition par spécialités & Dernières Activités */}
        <div className="space-y-6">
          {/* Répartition par Spécialité */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activité par Spécialité</h3>
                <p className="text-xs text-slate-500">Volume de consultations planifiées</p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-700" />
            </div>

            <div className="space-y-3">
              {specialtyStats.map((item) => {
                const total = appointments.length || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={item.code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <span className="font-mono text-slate-500">{item.count} rdv ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-slate-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dernières Activités / Audit Log preview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Journal d'Audit Récent</h3>
                <p className="text-xs text-slate-500">Traçabilité des actions utilisateurs</p>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-b border-slate-100 last:border-0 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-1">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span>Par : {log.userName}</span>
                    <span>·</span>
                    <span className="uppercase">{log.entity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
