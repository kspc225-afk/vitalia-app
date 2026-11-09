import React from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Stethoscope,
  ArrowRight,
  FileText,
  User,
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { currentUser, doctors, appointments, consultations, messages } = useStore();

  // Find corresponding doctor record
  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  const TODAY = '2026-11-08';

  // Doctor's today appointments
  const todayAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id && a.date === TODAY
  );
  const waitingPatients = todayAppointments.filter((a) => a.status === 'arrive');
  const inConsultation = todayAppointments.find((a) => a.status === 'en_consultation');
  const completedToday = todayAppointments.filter((a) => a.status === 'termine');

  // Next patient in line
  const nextPatient = inConsultation || waitingPatients[0] || todayAppointments.find((a) => a.status === 'confirme');

  // Unread messages for this doctor
  const unreadMessagesCount = messages.filter(
    (m) => m.receiverId === currentUser.id && !m.isRead
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-300 shrink-0">
            <img
              src={currentDoctor.photoUrl}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Espace Praticien · {currentDoctor.specialtyName}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Bonjour, Dr. {currentDoctor.firstName} {currentDoctor.lastName}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cabinet : {currentDoctor.room} · Matricule Ordre : {currentDoctor.matricule}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('consultation')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Démarrer une consultation</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* RDV du jour */}
        <div
          onClick={() => onNavigate('planning')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-800">
            <span className="text-xs font-semibold text-slate-500">Rendez-vous du Jour</span>
            <Calendar className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {todayAppointments.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Aujourd'hui</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Planning personnel</p>
        </div>

        {/* Salle d'attente */}
        <div
          onClick={() => onNavigate('planning')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-800">
            <span className="text-xs font-semibold text-slate-500">Salle d'Attente</span>
            <UserCheck className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {waitingPatients.length}
            </span>
            {waitingPatients.length > 0 && (
              <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                Patients présents
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pointés par l'accueil</p>
        </div>

        {/* Consultations terminées */}
        <div
          onClick={() => onNavigate('planning')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-800">
            <span className="text-xs font-semibold text-slate-500">Clôturées Aujourd'hui</span>
            <CheckCircle2 className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {completedToday.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              Terminé(s)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Comptes rendus archivés</p>
        </div>

        {/* Messages non lus */}
        <div
          onClick={() => onNavigate('messages')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-800">
            <span className="text-xs font-semibold text-slate-500">Messages Patients</span>
            <MessageSquare className="w-5 h-5 text-slate-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {unreadMessagesCount}
            </span>
            {unreadMessagesCount > 0 && (
              <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                Non lu(s)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Messagerie sécurisée</p>
        </div>
      </div>

      {/* Next Patient Card Focus */}
      {nextPatient ? (
        <div className="p-6 rounded-xl bg-slate-100 border border-slate-300 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                Patient en file d'attente
              </span>
              <StatusBadge status={nextPatient.status} size="sm" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {nextPatient.patientName} — {nextPatient.time}
            </h3>
            <p className="text-xs text-slate-600">
              <strong>Motif :</strong> {nextPatient.reason}
            </p>
            {nextPatient.notes && (
              <p className="text-[11px] text-slate-500 italic">« {nextPatient.notes} »</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('consultation', { appointmentId: nextPatient.id, patientId: nextPatient.patientId })}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Lancer la consultation</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
          Aucun patient en attente dans votre file d'attente pour le moment.
        </div>
      )}

      {/* Today's Full Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Planning des Consultations du Jour</h3>
            <p className="text-xs text-slate-500">Dimanche 8 Novembre 2026</p>
          </div>
          <button
            onClick={() => onNavigate('planning')}
            className="text-xs font-semibold text-slate-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Voir le planning complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Heure</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Motif</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{apt.time}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{apt.patientName}</td>
                  <td className="py-3 px-4 text-slate-700">{apt.reason}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={apt.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('consultation', { appointmentId: apt.id, patientId: apt.patientId })}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Consulter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
