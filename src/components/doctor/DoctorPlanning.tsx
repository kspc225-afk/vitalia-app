import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Stethoscope,
  Filter,
} from 'lucide-react';

interface DoctorPlanningProps {
  onStartConsultation: (appointmentId: string, patientId: string) => void;
}

export const DoctorPlanning: React.FC<DoctorPlanningProps> = ({ onStartConsultation }) => {
  const { currentUser, doctors, appointments, updateAppointmentStatus } = useStore();

  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  const [selectedDate, setSelectedDate] = useState('2026-11-08');
  const [filterStatus, setFilterStatus] = useState('all');

  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor.id);
  const dateAppointments = doctorAppointments.filter((a) => {
    const matchesDate = a.date === selectedDate;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const handleDateShift = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mon Planning de Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Créneaux réservés, patients en attente et historique de vos consultations.
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>{selectedDate}</span>
          </div>
          <button
            onClick={() => handleDateShift(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedDate('2026-11-08')}
            className="text-xs font-semibold text-slate-700 hover:underline px-2 cursor-pointer"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Doctor Schedule Rules Summary */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800">
        <div>
          <span className="font-bold">Horaires officiels de consultation :</span>{' '}
          <span className="font-mono">
            {currentDoctor.consultationHours.start} à {currentDoctor.consultationHours.end} ({currentDoctor.consultationHours.slotDurationMinutes} min / créneau)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-medium">Jours actifs :</span>
          {currentDoctor.availableDays.map((d) => (
            <span key={d} className="px-1.5 py-0.5 rounded bg-white font-semibold text-[10px] uppercase text-slate-700 border border-slate-300">
              {d.substring(0, 3)}
            </span>
          ))}
        </div>
      </div>

      {/* Appointments List for Selected Date */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            {dateAppointments.length} rendez-vous programmés pour le {selectedDate}
          </span>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1 px-2 border border-slate-300 rounded text-xs bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="arrive">En salle d'attente</option>
              <option value="confirme">Confirmé</option>
              <option value="en_consultation">En consultation</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>

        {dateAppointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Aucun rendez-vous sur cette date. Vos créneaux sont libres.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dateAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-300 flex flex-col items-center justify-center shrink-0 font-mono">
                    <span className="text-xs font-bold text-slate-800">{apt.time}</span>
                    <span className="text-[9px] text-slate-400">{apt.durationMinutes}m</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{apt.patientName}</h4>
                      <span className="font-mono text-xs text-slate-400">({apt.code})</span>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Motif :</strong> {apt.reason}
                    </p>
                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        « {apt.notes} »
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {apt.status === 'arrive' && (
                    <button
                      onClick={() => onStartConsultation(apt.id, apt.patientId)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Faire entrer le patient</span>
                    </button>
                  )}

                  {apt.status === 'confirme' && (
                    <button
                      onClick={() => onStartConsultation(apt.id, apt.patientId)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-400 text-slate-800 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                    >
                      Démarrer
                    </button>
                  )}

                  {apt.status === 'termine' && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                      Consultation clôturée
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
