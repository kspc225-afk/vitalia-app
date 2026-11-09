import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Appointment, AppointmentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  CalendarClock,
  UserCheck,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  User,
  Search,
} from 'lucide-react';

export const AppointmentsManagement: React.FC = () => {
  const {
    appointments,
    patients,
    doctors,
    specialties,
    createAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    assignDoctorToAppointment,
  } = useStore();

  const [activeView, setActiveView] = useState<'day' | 'week' | 'month' | 'list'>('day');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-08');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [targetAppointment, setTargetAppointment] = useState<Appointment | null>(null);

  // Create form state
  const [newAppointmentData, setNewAppointmentData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    specialtyId: doctors[0]?.specialtyId || specialties[0]?.id || '',
    date: '2026-11-08',
    time: '11:30',
    durationMinutes: 30,
    reason: '',
    notes: '',
  });

  // Reschedule form state
  const [newDate, setNewDate] = useState('2026-11-08');
  const [newTime, setNewTime] = useState('14:00');
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Reassign form state
  const [reassignDoctorId, setReassignDoctorId] = useState(doctors[0]?.id || '');

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      `${apt.patientName} ${apt.code} ${apt.reason}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = selectedDoctorFilter === 'all' || apt.doctorId === selectedDoctorFilter;
    const matchesStatus = selectedStatusFilter === 'all' || apt.status === selectedStatusFilter;

    if (activeView === 'day') {
      return apt.date === selectedDate && matchesDoctor && matchesStatus && matchesSearch;
    }
    return matchesDoctor && matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const result = createAppointment({
      patientId: newAppointmentData.patientId,
      doctorId: newAppointmentData.doctorId,
      specialtyId: newAppointmentData.specialtyId,
      date: newAppointmentData.date,
      time: newAppointmentData.time,
      durationMinutes: newAppointmentData.durationMinutes,
      reason: newAppointmentData.reason,
      notes: newAppointmentData.notes,
    });

    if (!result.success) {
      setConflictError(result.message || 'Conflit de créneau détecté.');
      return;
    }

    setIsCreateModalOpen(false);
    setNewAppointmentData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      specialtyId: doctors[0]?.specialtyId || specialties[0]?.id || '',
      date: selectedDate,
      time: '14:00',
      durationMinutes: 30,
      reason: '',
      notes: '',
    });
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppointment) return;
    setConflictError(null);

    const result = rescheduleAppointment(targetAppointment.id, newDate, newTime);
    if (!result.success) {
      setConflictError(result.message || 'Ce créneau est déjà pris.');
      return;
    }
    setIsRescheduleModalOpen(false);
    setTargetAppointment(null);
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppointment || !reassignDoctorId) return;

    assignDoctorToAppointment(targetAppointment.id, reassignDoctorId);
    setIsReassignModalOpen(false);
    setTargetAppointment(null);
  };

  // Helper date controls
  const handleDateChange = (daysDelta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + daysDelta);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const hoursList = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Planification & Gestion des Rendez-vous
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordination des consultations, prévention des doubles réservations et pointage de l'accueil.
          </p>
        </div>

        <button
          onClick={() => {
            setConflictError(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Rendez-vous</span>
        </button>
      </div>

      {/* View Switcher, Date Bar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Views segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['day', 'week', 'month', 'list'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeView === view
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {view === 'day'
                  ? 'Vue Jour'
                  : view === 'week'
                  ? 'Vue Semaine'
                  : view === 'month'
                  ? 'Vue Mois'
                  : 'Vue Liste Complète'}
              </button>
            ))}
          </div>

          {/* Date Picker & Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>{selectedDate}</span>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
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

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par patient ou motif..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div>
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="all">Tous les médecins</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} ({d.specialtyName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente (Demandes en ligne)</option>
              <option value="confirme">Confirmé</option>
              <option value="arrive">Patient arrivé (Accueil)</option>
              <option value="en_consultation">En consultation</option>
              <option value="termine">Terminé</option>
              <option value="reporte">Reporté</option>
              <option value="annule">Annulé</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Day / Time Grid View */}
      {activeView === 'day' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Planning journalier du {selectedDate} ({filteredAppointments.length} rendez-vous)
            </span>
            <span className="text-xs text-slate-500 font-mono">08:00 — 17:00</span>
          </div>

          <div className="divide-y divide-slate-100">
            {hoursList.map((timeSlot) => {
              const slotAppointments = filteredAppointments.filter((a) => a.time === timeSlot);
              return (
                <div key={timeSlot} className="flex flex-col sm:flex-row items-start hover:bg-slate-50/50 transition-colors">
                  {/* Time label */}
                  <div className="w-24 p-4 text-xs font-mono font-bold text-slate-500 shrink-0 border-r border-slate-100">
                    {timeSlot}
                  </div>

                  {/* Appointments in slot */}
                  <div className="flex-1 p-3 flex flex-wrap gap-3 w-full">
                    {slotAppointments.length === 0 ? (
                      <span className="text-slate-300 text-xs italic py-1">Créneau disponible</span>
                    ) : (
                      slotAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex-1 min-w-[280px] p-3 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-400 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs">{apt.patientName}</span>
                                <span className="font-mono text-[10px] text-slate-400">({apt.code})</span>
                              </div>
                              <div className="text-[11px] text-slate-700 font-semibold">
                                {apt.doctorName} · {apt.specialtyName}
                              </div>
                            </div>
                            <StatusBadge status={apt.status} size="sm" />
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-1">
                            <strong>Motif :</strong> {apt.reason}
                          </p>

                          {apt.notes && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-1 bg-slate-50 p-1.5 rounded">
                              {apt.notes}
                            </p>
                          )}

                          {/* Quick Admin Actions Row */}
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              {apt.status === 'en_attente' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirme', 'Confirmé par le secrétariat.')}
                                  className="px-2 py-1 rounded bg-slate-800 text-white font-semibold text-[11px] hover:bg-slate-900 cursor-pointer"
                                >
                                  Confirmer
                                </button>
                              )}

                              {apt.status === 'confirme' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'arrive', 'Arrivée pointée à l’accueil.')}
                                  className="px-2 py-1 rounded bg-slate-700 text-white font-semibold text-[11px] hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Patient arrivé</span>
                                </button>
                              )}

                              {apt.status === 'arrive' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'en_consultation', 'Consultation démarrée.')}
                                  className="px-2 py-1 rounded bg-slate-800 text-white font-semibold text-[11px] hover:bg-slate-900 cursor-pointer flex items-center gap-1"
                                >
                                  <Stethoscope className="w-3 h-3" />
                                  <span>En consultation</span>
                                </button>
                              )}

                              {apt.status === 'en_consultation' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'termine', 'Consultation terminée.')}
                                  className="px-2 py-1 rounded bg-slate-800 text-white font-semibold text-[11px] hover:bg-slate-900 cursor-pointer"
                                >
                                  Terminer
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setTargetAppointment(apt);
                                  setNewDate(apt.date);
                                  setNewTime(apt.time);
                                  setConflictError(null);
                                  setIsRescheduleModalOpen(true);
                                }}
                                className="px-2 py-1 rounded border border-slate-300 text-slate-700 font-medium text-[11px] hover:bg-slate-100 cursor-pointer"
                              >
                                Reporter
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setTargetAppointment(apt);
                                  setReassignDoctorId(apt.doctorId);
                                  setIsReassignModalOpen(true);
                                }}
                                className="text-[11px] text-slate-700 hover:underline cursor-pointer"
                              >
                                Réassigner
                              </button>
                              <span>·</span>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'annule', 'Annulé par le secrétariat.')}
                                className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List / Full Table View */}
      {(activeView === 'list' || activeView === 'week' || activeView === 'month') && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Registre de l'ensemble des rendez-vous ({filteredAppointments.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Médecin & Spécialité</th>
                  <th className="py-3 px-4">Date & Créneau</th>
                  <th className="py-3 px-4">Motif</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{apt.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{apt.patientName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.specialtyName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-800">{apt.date}</div>
                      <div className="text-slate-500">{apt.time}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">{apt.reason}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'en_attente' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirme', 'Confirmé')}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-semibold text-[10px] hover:bg-emerald-700 cursor-pointer"
                          >
                            Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setTargetAppointment(apt);
                            setNewDate(apt.date);
                            setNewTime(apt.time);
                            setIsRescheduleModalOpen(true);
                          }}
                          className="px-2 py-1 rounded border border-slate-200 text-slate-700 text-[10px] hover:bg-slate-100 cursor-pointer"
                        >
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Appointment with Double Booking Prevention */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un Rendez-vous Médical"
        subtitle="Vérification automatique des conflits d'horaires et affectation de créneau"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {conflictError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{conflictError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Patient bénéficiaire *</label>
            <select
              required
              value={newAppointmentData.patientId}
              onChange={(e) => setNewAppointmentData({ ...newAppointmentData, patientId: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.patientCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Médecin & Spécialité *</label>
            <select
              required
              value={newAppointmentData.doctorId}
              onChange={(e) => {
                const doc = doctors.find((d) => d.id === e.target.value);
                setNewAppointmentData({
                  ...newAppointmentData,
                  doctorId: e.target.value,
                  specialtyId: doc?.specialtyId || newAppointmentData.specialtyId,
                });
              }}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} — {d.specialtyName} ({d.room})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={newAppointmentData.date}
                onChange={(e) => setNewAppointmentData({ ...newAppointmentData, date: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Créneau horaire *</label>
              <select
                value={newAppointmentData.time}
                onChange={(e) => setNewAppointmentData({ ...newAppointmentData, time: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {hoursList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Motif de consultation *</label>
            <input
              type="text"
              required
              placeholder="Ex: Suivi tensionnel, bilan annuel, renouvellement traitement..."
              value={newAppointmentData.reason}
              onChange={(e) => setNewAppointmentData({ ...newAppointmentData, reason: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observations administratives</label>
            <textarea
              rows={2}
              placeholder="Ex: Patient prévenu de venir à jeun..."
              value={newAppointmentData.notes}
              onChange={(e) => setNewAppointmentData({ ...newAppointmentData, notes: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Enregistrer le rendez-vous
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reschedule Appointment */}
      {targetAppointment && (
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title={`Reporter le rendez-vous ${targetAppointment.code}`}
          subtitle={`Patient : ${targetAppointment.patientName} · Médecin : ${targetAppointment.doctorName}`}
          maxWidth="md"
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
            {conflictError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nouvelle date *</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nouveau créneau *</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {hoursList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmer le report
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Reassign Doctor */}
      {targetAppointment && (
        <Modal
          isOpen={isReassignModalOpen}
          onClose={() => setIsReassignModalOpen(false)}
          title={`Réassigner le médecin pour ${targetAppointment.code}`}
          subtitle={`Patient : ${targetAppointment.patientName} le ${targetAppointment.date} à ${targetAppointment.time}`}
          maxWidth="md"
        >
          <form onSubmit={handleReassignSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nouveau médecin affecté *</label>
              <select
                value={reassignDoctorId}
                onChange={(e) => setReassignDoctorId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.specialtyName})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Valider la réaffectation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
