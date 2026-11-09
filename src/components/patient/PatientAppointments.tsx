import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { Appointment } from '../../types';
import { Calendar, Clock, AlertCircle, XCircle, ArrowRight, User } from 'lucide-react';

export const PatientAppointments: React.FC = () => {
  const { currentUser, patients, appointments, updateAppointmentStatus } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const myAppointments = appointments.filter((a) => a.patientId === currentPatient.id);

  const filteredAppointments = myAppointments.filter((a) => {
    if (activeFilter === 'upcoming') {
      return a.status !== 'termine' && a.status !== 'annule' && a.status !== 'refuse';
    }
    if (activeFilter === 'past') {
      return a.status === 'termine' || a.status === 'annule' || a.status === 'refuse';
    }
    return true;
  });

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Êtes-vous certain de vouloir annuler ce rendez-vous ?')) {
      updateAppointmentStatus(id, 'annule', 'Annulé par le patient en ligne.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Mes Rendez-vous Médicaux
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Suivi en temps réel de vos consultations programmées, passées et demandes en attente.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
          {(['all', 'upcoming', 'past'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#0a6b63] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'all'
                ? 'Tous'
                : filter === 'upcoming'
                ? 'À venir / En cours'
                : 'Passés & Annulés'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Aucun rendez-vous ne correspond à ce filtre.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4 hover:border-teal-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0a6b63]">{apt.code}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-bold text-slate-800">{apt.specialtyName}</span>
                </div>
                <StatusBadge status={apt.status} size="sm" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                    <Calendar className="w-4 h-4 text-teal-700" />
                    <span>
                      {new Date(apt.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[#0a6b63]">à {apt.time}</span>
                  </div>

                  <p className="text-xs text-slate-700">
                    Praticien : <strong>{apt.doctorName}</strong>
                  </p>

                  <p className="text-xs text-slate-600">
                    <strong>Motif :</strong> {apt.reason}
                  </p>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      « {apt.notes} »
                    </p>
                  )}
                </div>

                {/* Cancel Action if pending or confirmed */}
                {(apt.status === 'en_attente' || apt.status === 'confirme') && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto shrink-0"
                  >
                    Annuler le rendez-vous
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
