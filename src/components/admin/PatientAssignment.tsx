import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { UserCheck, Clock, CheckCircle2, History, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';

export const PatientAssignment: React.FC = () => {
  const { patients, doctors, assignPatientToDoctor, currentUser } = useStore();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const currentAssignedDoctor = doctors.find((d) => d.id === selectedPatient?.assignedDoctorId);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDoctorId) return;

    assignPatientToDoctor(selectedPatientId, selectedDoctorId, assignmentNote);

    const doc = doctors.find((d) => d.id === selectedDoctorId);
    setSuccessMessage(
      `Le patient ${selectedPatient?.firstName} ${selectedPatient?.lastName} a bien été attribué au Dr. ${doc?.firstName} ${doc?.lastName}.`
    );
    setAssignmentNote('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Module d'Attribution & Réaffectation des Patients
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Affectation formelle d'un patient à un médecin référent, traçabilité de l'auteur et notification instantanée du praticien.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Main Split: Form on Left | Doctor Availability & History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Attribution Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-3">
            <UserPlus className="w-4 h-4 text-slate-700" />
            <span>Sélection & Attribution</span>
          </h3>

          <form onSubmit={handleAssign} className="space-y-4 text-xs">
            {/* Patient Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                1. Sélectionner le patient *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setSelectedDoctorId('');
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                {patients.map((p) => {
                  const doc = doctors.find((d) => d.id === p.assignedDoctorId);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientCode}) — Actuel : {doc ? `Dr. ${doc.lastName}` : 'Aucun'}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Current State Info */}
            {selectedPatient && (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500 font-medium">Attribution actuelle :</div>
                <div className="font-bold text-slate-900">
                  {currentAssignedDoctor ? (
                    <span className="text-slate-900 font-semibold">
                      Dr. {currentAssignedDoctor.firstName} {currentAssignedDoctor.lastName} ({currentAssignedDoctor.specialtyName})
                    </span>
                  ) : (
                    <span className="text-amber-700">Patient sans médecin référent</span>
                  )}
                </div>
              </div>
            )}

            {/* Target Doctor Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                2. Sélectionner le médecin d'affectation *
              </label>
              <select
                value={selectedDoctorId}
                required
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="">-- Choisir un praticien disponible --</option>
                {doctors
                  .filter((d) => d.isActive)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} — {d.specialtyName} ({d.assignedPatientsCount || 0} patient(s))
                    </option>
                  ))}
              </select>
            </div>

            {/* Notes / Motivation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                3. Motif ou notes d'attribution (archivé au dossier)
              </label>
              <textarea
                rows={3}
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="Ex: Suivi tensionnel de routine, orientation suite à consultation d'urgence, réaffectation à la demande du patient..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Audit author mention */}
            <div className="text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded border border-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
              <span>
                Auteur consigné : <strong>{currentUser.name}</strong> ({currentUser.role})
              </span>
            </div>

            <button
              type="submit"
              disabled={!selectedDoctorId}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Valider l'attribution & Notifier le médecin</span>
            </button>
          </form>
        </div>

        {/* Right Col: Doctors Availability Grid & Assignment History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Doctors Availability & Capacity Roster */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Disponibilités & Charge des Médecins
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctors.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-800 bg-slate-100 ring-1 ring-slate-800'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img
                          src={doc.photoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs">
                          Dr. {doc.firstName} {doc.lastName}
                        </div>
                        <div className="text-[11px] text-slate-700 font-semibold truncate">
                          {doc.specialtyName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {doc.room}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Jours : {doc.availableDays.length}j / sem.</span>
                      <span className="font-semibold text-slate-800">
                        {doc.assignedPatientsCount || 0} patient(s) actif(s)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Assignment History */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Historique des Attributions de ce Patient</span>
              </h3>
              {selectedPatient && (
                <span className="font-mono text-xs text-slate-800 font-bold">
                  {selectedPatient.patientCode}
                </span>
              )}
            </div>

            {selectedPatient?.assignmentHistory && selectedPatient.assignmentHistory.length > 0 ? (
              <div className="space-y-2">
                {selectedPatient.assignmentHistory.map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{hist.doctorName}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(hist.assignedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Attribué par : <strong>{hist.assignedBy}</strong>
                    </div>
                    {hist.notes && (
                      <p className="text-[11px] text-slate-500 italic">« {hist.notes} »</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-4 text-center">
                Aucun historique d'attribution préalable pour ce patient.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
