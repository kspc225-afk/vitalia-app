import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Doctor } from '../../types';
import { Modal } from '../common/Modal';
import {
  Stethoscope,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Edit2,
  Users,
} from 'lucide-react';

export const DoctorsManagement: React.FC = () => {
  const { doctors, specialties, appointments, addDoctor, updateDoctor, toggleDoctorActive } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [newDoctorData, setNewDoctorData] = useState({
    firstName: '',
    lastName: '',
    matricule: 'MED-CI-',
    specialtyId: specialties[0]?.id || '',
    phone: '+225 ',
    email: '',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    room: 'Bureau ',
    startTime: '08:30',
    endTime: '16:30',
    slotDurationMinutes: 30,
    availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'] as ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi')[],
    biography: '',
  });

  const allDays = [
    { key: 'lundi', label: 'Lun' },
    { key: 'mardi', label: 'Mar' },
    { key: 'mercredi', label: 'Mer' },
    { key: 'jeudi', label: 'Jeu' },
    { key: 'vendredi', label: 'Ven' },
    { key: 'samedi', label: 'Sam' },
  ] as const;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const spec = specialties.find((s) => s.id === newDoctorData.specialtyId);
    if (!spec) return;

    addDoctor({
      userId: '',
      firstName: newDoctorData.firstName,
      lastName: newDoctorData.lastName,
      matricule: newDoctorData.matricule || `MED-CI-${Math.floor(1000 + Math.random() * 9000)}`,
      specialtyId: newDoctorData.specialtyId,
      specialtyName: spec.name,
      phone: newDoctorData.phone,
      email: newDoctorData.email || `dr.${newDoctorData.lastName.toLowerCase()}@clinique-vitalia.ci`,
      photoUrl: newDoctorData.photoUrl,
      room: newDoctorData.room,
      consultationHours: {
        start: newDoctorData.startTime,
        end: newDoctorData.endTime,
        slotDurationMinutes: newDoctorData.slotDurationMinutes,
      },
      availableDays: newDoctorData.availableDays,
      isActive: true,
      biography: newDoctorData.biography,
    });

    setIsAddModalOpen(false);
  };

  const handleToggleDay = (day: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi') => {
    const current = newDoctorData.availableDays;
    if (current.includes(day)) {
      setNewDoctorData({ ...newDoctorData, availableDays: current.filter((d) => d !== day) });
    } else {
      setNewDoctorData({ ...newDoctorData, availableDays: [...current, day] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Corps Médical & Spécialistes Clinique Vitalia
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion des profils de praticiens, horaires de consultation, cabinets et disponibilités.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Médecin</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const docAppointments = appointments.filter((a) => a.doctorId === doc.id);
          return (
            <div
              key={doc.id}
              className={`bg-white rounded-xl border shadow-2xs overflow-hidden transition-all flex flex-col justify-between ${
                doc.isActive ? 'border-slate-200/80 hover:border-slate-400' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="p-5 flex items-start gap-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={doc.photoUrl}
                      alt={doc.lastName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        Dr. {doc.firstName} {doc.lastName}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 block truncate mt-0.5">
                      {doc.specialtyName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                      {doc.matricule}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.room}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {doc.consultationHours.start} — {doc.consultationHours.end} ({doc.consultationHours.slotDurationMinutes} min/patient)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex items-center gap-1">
                      {doc.availableDays.map((d) => (
                        <span
                          key={d}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase"
                        >
                          {d.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {doc.biography && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-100">
                      « {doc.biography} »
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>{doc.assignedPatientsCount || 0} patient(s)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDoctorActive(doc.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      doc.isActive
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {doc.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Doctor */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un Médecin Praticien"
        subtitle="Enregistrement officiel du praticien et configuration de ses disponibilités"
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={newDoctorData.firstName}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, firstName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Ex: Estelle"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={newDoctorData.lastName}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, lastName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Ex: Yao"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Spécialité *</label>
              <select
                value={newDoctorData.specialtyId}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, specialtyId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Matricule Ordre</label>
              <input
                type="text"
                value={newDoctorData.matricule}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, matricule: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                placeholder="MED-CI-4819"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bureau / Cabinet</label>
              <input
                type="text"
                value={newDoctorData.room}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, room: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Bureau 204 — Bâtiment Principal"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newDoctorData.phone}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, phone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Heure début</label>
              <input
                type="time"
                value={newDoctorData.startTime}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, startTime: e.target.value })}
                className="w-full p-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Heure fin</label>
              <input
                type="time"
                value={newDoctorData.endTime}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, endTime: e.target.value })}
                className="w-full p-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Durée (min)</label>
              <select
                value={newDoctorData.slotDurationMinutes}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, slotDurationMinutes: Number(e.target.value) })}
                className="w-full p-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Jours de consultation</label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(({ key, label }) => {
                const isSelected = newDoctorData.availableDays.includes(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleToggleDay(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Biographie / Titres</label>
            <textarea
              rows={2}
              value={newDoctorData.biography}
              onChange={(e) => setNewDoctorData({ ...newDoctorData, biography: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              placeholder="Diplômé de..."
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Enregistrer le médecin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
