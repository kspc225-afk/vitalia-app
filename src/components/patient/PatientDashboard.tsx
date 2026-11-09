import React from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Bell,
  Pill,
  FileText,
  User,
  ChevronRight,
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { currentUser, patients, appointments, exams, notifications, doctors } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const assignedDoctor = doctors.find((d) => d.id === currentPatient.assignedDoctorId);

  // Appointments for this patient
  const myAppointments = appointments.filter((a) => a.patientId === currentPatient.id);
  const upcomingAppointment = myAppointments.find(
    (a) =>
      a.status === 'confirme' ||
      a.status === 'en_attente' ||
      a.status === 'arrive' ||
      a.status === 'en_consultation'
  );

  // Only published exams!
  const publishedExams = exams.filter(
    (e) => e.patientId === currentPatient.id && e.status === 'publie'
  );

  const myNotifs = notifications
    .filter((n) => n.userId === currentUser.id || n.targetRole === 'patient')
    .slice(0, 3);

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-4">
      {/* 1. Salutation du Patient Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-[#00796F] uppercase tracking-wider block">
            Espace Patient OSIRIX
          </span>
          <h2 className="text-2xl font-extrabold text-[#101513] tracking-tight">
            Bonjour, {currentPatient.firstName} !
          </h2>
        </div>
        <div
          onClick={() => onNavigate('profile')}
          className="w-11 h-11 rounded-full bg-[#00796F] text-white font-bold text-sm flex items-center justify-center overflow-hidden cursor-pointer shadow-xs"
        >
          {currentPatient.avatar ? (
            <img
              src={currentPatient.avatar}
              alt={currentPatient.firstName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            `${currentPatient.firstName.charAt(0)}${currentPatient.lastName.charAt(0)}`
          )}
        </div>
      </div>

      {/* 2. Prochain Rendez-vous dans une GRANDE CARTE VERTE (#00796F) */}
      {upcomingAppointment ? (
        <div className="rounded-[28px] bg-[#00796F] text-white p-6 shadow-lg space-y-4 relative overflow-hidden">
          {/* Subtle geometric medical cross watermark */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F5A900]" />
              <span>Prochain Rendez-vous</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#00796F] shadow-2xs">
              {upcomingAppointment.status === 'confirme'
                ? 'Confirmé'
                : upcomingAppointment.status === 'en_attente'
                ? 'En attente'
                : upcomingAppointment.status === 'arrive'
                ? 'Arrivé'
                : 'En consultation'}
            </span>
          </div>

          <div className="space-y-1 relative z-10">
            <h3 className="text-xl font-extrabold text-white">
              {upcomingAppointment.doctorName}
            </h3>
            <p className="text-xs text-teal-100 font-medium">
              {upcomingAppointment.specialtyName}
            </p>
          </div>

          {/* Date & Time pill row */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between text-xs font-mono relative z-10 border border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5A900]" />
              <span className="font-bold">
                {new Date(upcomingAppointment.date).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <span className="font-bold text-[#F5A900] text-sm">{upcomingAppointment.time}</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 relative z-10">
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Consulter les détails</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('appointments')}
              className="px-4 py-2 rounded-xl bg-white text-[#00796F] hover:bg-teal-50 font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Gérer ce RDV
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] bg-[#073D38] text-white p-6 shadow-md space-y-3 text-center">
          <Calendar className="w-8 h-8 text-[#F5A900] mx-auto" />
          <h3 className="font-bold text-sm">Aucun rendez-vous à venir</h3>
          <p className="text-xs text-teal-100 max-w-xs mx-auto">
            Consultez nos spécialistes en cardiologie, pédiatrie, gynécologie et médecine générale.
          </p>
          <button
            onClick={() => onNavigate('appointments')}
            className="px-5 py-2.5 rounded-xl bg-[#F5A900] hover:bg-amber-400 text-[#101513] font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Prendre un rendez-vous
          </button>
        </div>
      )}

      {/* 3. Raccourci pour Prendre un Rendez-vous */}
      <button
        onClick={() => onNavigate('appointments')}
        className="w-full p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#00796F] transition-all flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EF] text-[#00796F] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="font-bold text-slate-900 text-xs block">Prendre un nouveau rendez-vous</span>
            <span className="text-[11px] text-slate-500 block">Choisissez votre médecin et votre créneau</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#00796F] group-hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 4. Derniers Résultats Médicaux */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#101513] flex items-center gap-1.5">
            <Microscope className="w-4 h-4 text-[#00796F]" />
            <span>Derniers Résultats d'Analyses</span>
          </span>
          <button
            onClick={() => onNavigate('records')}
            className="text-xs font-bold text-[#00796F] hover:underline cursor-pointer"
          >
            Voir tout
          </button>
        </div>

        {publishedExams.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2 text-center">
            Aucun résultat d'analyse publié pour le moment.
          </p>
        ) : (
          <div className="space-y-2">
            {publishedExams.slice(0, 2).map((exam) => (
              <div
                key={exam.id}
                onClick={() => onNavigate('records')}
                className="p-3.5 rounded-2xl bg-[#F3F5F4] hover:bg-[#E8F5EF] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{exam.examType}</h4>
                  <p className="text-[11px] text-slate-500">
                    Prescrit par {exam.prescribingDoctorName} · {exam.validatedAt?.split('T')[0]}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#00796F] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Bulletin Validé
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Dernières Notifications */}
      {myNotifs.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#101513] flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#F5A900]" />
            <span>Dernières Notifications</span>
          </span>

          <div className="space-y-2">
            {myNotifs.map((n) => (
              <div key={n.id} className="p-3 rounded-2xl bg-[#F3F5F4] text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{n.title}</div>
                <p className="text-slate-600 text-[11px]">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
