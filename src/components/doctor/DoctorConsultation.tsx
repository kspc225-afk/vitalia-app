import React, { useState, useEffect } from 'react';
import { useStore } from '../../services/store';
import { PrescriptionItem, Prescription } from '../../types';
import { PrintablePrescription } from '../common/PrintablePrescription';
import {
  Stethoscope,
  Activity,
  Plus,
  Trash2,
  FileCheck2,
  Printer,
  Calendar,
  AlertCircle,
  Pill,
  Microscope,
  CheckCircle2,
} from 'lucide-react';

interface DoctorConsultationProps {
  initialAppointmentId?: string;
  initialPatientId?: string;
  onFinished?: () => void;
}

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  initialAppointmentId,
  initialPatientId,
  onFinished,
}) => {
  const {
    currentUser,
    doctors,
    patients,
    appointments,
    createConsultation,
    updateAppointmentStatus,
  } = useStore();

  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  // Selected patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || patients[0]?.id || ''
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    initialAppointmentId || ''
  );

  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Clinical Vitals Form State
  const [vitals, setVitals] = useState({
    bloodPressure: '125/80',
    pulse: 74,
    temperature: 37.0,
    weight: 76.5,
    glycemia: '0.95',
  });

  // Clinical Notes State
  const [reason, setReason] = useState('Contrôle de routine & renouvellement traitement');
  const [clinicalObservations, setClinicalObservations] = useState(
    'Patient en bon état général, conscient, coopérant. Auscultation cardio-pulmonaire normale. Bruits du cœur réguliers. Absence d’œdème des membres inférieurs.'
  );
  const [diagnosis, setDiagnosis] = useState(
    'Stabilité clinique satisfaisante sous traitement actuel.'
  );
  const [treatment, setTreatment] = useState(
    'Poursuite de la prise en charge médicale et mesures hygiéno-diététiques.'
  );
  const [recommendations, setRecommendations] = useState(
    'Maintien d’une alimentation pauvre en sel et activité physique d’endurance de 30 min 3 fois par semaine.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-12-10');

  // Exam requests
  const [examInput, setExamInput] = useState('');
  const [examsRequested, setExamsRequested] = useState<string[]>([]);

  // Prescription Rx items
  const [medications, setMedications] = useState<PrescriptionItem[]>([
    {
      id: 'item-1',
      medicationName: 'AMLODIPINE 5MG',
      dosage: '5 mg',
      frequency: '1 comprimé le matin',
      duration: '3 mois',
      instructions: 'Au cours du petit-déjeuner',
    },
  ]);

  const [createdPrescription, setCreatedPrescription] = useState<Prescription | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // If initialAppointmentId given, auto-populate reason
  useEffect(() => {
    if (initialAppointmentId) {
      const apt = appointments.find((a) => a.id === initialAppointmentId);
      if (apt) {
        setSelectedPatientId(apt.patientId);
        setReason(apt.reason);
      }
    }
  }, [initialAppointmentId, appointments]);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        id: `med-${Date.now()}`,
        medicationName: '',
        dosage: '',
        frequency: '1 comprimé par jour',
        duration: '1 mois',
        instructions: '',
      },
    ]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleUpdateMedication = (id: string, updates: Partial<PrescriptionItem>) => {
    setMedications(medications.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleAddExam = () => {
    if (!examInput.trim()) return;
    setExamsRequested([...examsRequested, examInput.trim()]);
    setExamInput('');
  };

  const handleRemoveExam = (index: number) => {
    setExamsRequested(examsRequested.filter((_, idx) => idx !== index));
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const validMeds = medications.filter((m) => m.medicationName.trim() !== '');

    const prescriptionPayload =
      validMeds.length > 0
        ? {
            patientId: activePatient.id,
            patientName: `${activePatient.firstName} ${activePatient.lastName}`,
            doctorId: currentDoctor.id,
            doctorName: `Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
            doctorMatricule: currentDoctor.matricule,
            date: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            medications: validMeds,
            instructions: recommendations,
            isSigned: true,
          }
        : undefined;

    const cs = createConsultation(
      {
        appointmentId: selectedAppointmentId || undefined,
        patientId: activePatient.id,
        patientName: `${activePatient.firstName} ${activePatient.lastName}`,
        doctorId: currentDoctor.id,
        doctorName: `Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}`,
        specialtyName: currentDoctor.specialtyName,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        reason,
        vitals,
        clinicalObservations,
        diagnosis,
        treatment,
        examsRequested,
        recommendations,
        followUpDate,
        status: 'cloturee',
      },
      prescriptionPayload
    );

    if (prescriptionPayload) {
      setCreatedPrescription({
        ...prescriptionPayload,
        id: cs.prescriptionId || 'ord-temp',
        code: 'ORD-2026-NEW',
      });
    }

    setIsSavedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Consultation Médicale & Rédaction d'Ordonnance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie des constantes, observations cliniques, prescription certifiée et transmission d'examens au laboratoire.
          </p>
        </div>

        {isSavedSuccess && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'ordonnance</span>
            </button>
          </div>
        )}
      </div>

      {isSavedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Consultation clôturée avec succès !</span>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Le compte rendu a été consigné au dossier du patient, l'ordonnance certifiée est prête,
                et les éventuels examens prescrits ont été transmis au laboratoire.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSavedSuccess(false);
              onFinished?.();
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
          >
            Nouvelle consultation
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveConsultation} className="space-y-6">
        {/* Patient Selection Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-3">
            <Stethoscope className="w-4 h-4 text-slate-700" />
            <span>Identification du Patient en Consultation</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sélectionner le patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white font-medium"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.patientCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Motif de consultation *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                placeholder="Ex: Céphalées, bilan tensionnel..."
              />
            </div>
          </div>

          {activePatient && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{activePatient.firstName} {activePatient.lastName}</span>
                <span>·</span>
                <span>Né(e) le {activePatient.birthDate}</span>
                <span>·</span>
                <span className="font-mono font-bold text-slate-700">{activePatient.bloodGroup}</span>
              </div>
              {activePatient.allergies && activePatient.allergies.length > 0 && (
                <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                  Allergie(s) : {activePatient.allergies.join(', ')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section: Constantes Vitales (Biométrie) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-3">
            <Activity className="w-4 h-4 text-slate-700" />
            <span>Prise des Constantes Vitales</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Tension Artérielle</label>
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold"
                placeholder="120/80"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">mmHg</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Pouls Cardiaque</label>
              <input
                type="number"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: Number(e.target.value) })}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">battements / min</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Température</label>
              <input
                type="number"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">°C</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Poids</label>
              <input
                type="number"
                step="0.5"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">kg</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-semibold text-slate-700 mb-1">Glycémie à jeun</label>
              <input
                type="text"
                value={vitals.glycemia}
                onChange={(e) => setVitals({ ...vitals, glycemia: e.target.value })}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">g / L</span>
            </div>
          </div>
        </div>

        {/* Section: Examen Clinique & Diagnostic */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-3">
            Observations Cliniques & Diagnostic
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Observations cliniques détaillées (Signes physiques, auscultation...) *
              </label>
              <textarea
                rows={4}
                required
                value={clinicalObservations}
                onChange={(e) => setClinicalObservations(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnostic retenu *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date de suivi / Prochain rendez-vous</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Traitement & Recommandations</label>
              <textarea
                rows={2}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section: Prescription d'Examens Complémentaires (Transmis au Labo) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Examens Complémentaires Prescrits (Circuit Laboratoire)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Ces demandes apparaîtront dans la file d'attente du laboratoire
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={examInput}
              onChange={(e) => setExamInput(e.target.value)}
              placeholder="Ex: Bilan lipidique complet, Échocardiographie Doppler, Créatininémie..."
              className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExam();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddExam}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter examen</span>
            </button>
          </div>

          {examsRequested.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {examsRequested.map((ex, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium"
                >
                  <span>{ex}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExam(idx)}
                    className="text-indigo-400 hover:text-indigo-700 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section: Rédaction de l'Ordonnance Médicale (Rx) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Prescription Médicamenteuse & Ordonnance Officielle
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddMedication}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un médicament</span>
            </button>
          </div>

          <div className="space-y-3">
            {medications.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px] uppercase">
                    Médicament #{idx + 1}
                  </span>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px]">Dénomination *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: AMLODIPINE"
                      value={item.medicationName}
                      onChange={(e) => handleUpdateMedication(item.id, { medicationName: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px]">Dosage</label>
                    <input
                      type="text"
                      placeholder="Ex: 5 mg"
                      value={item.dosage}
                      onChange={(e) => handleUpdateMedication(item.id, { dosage: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px]">Posologie / Prise</label>
                    <input
                      type="text"
                      placeholder="Ex: 1 comprimé le matin"
                      value={item.frequency}
                      onChange={(e) => handleUpdateMedication(item.id, { frequency: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5 text-[11px]">Durée traitement</label>
                    <input
                      type="text"
                      placeholder="Ex: 3 mois"
                      value={item.duration}
                      onChange={(e) => handleUpdateMedication(item.id, { duration: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Instructions particulières (ex: Au cours du repas, ne pas écraser...)"
                    value={item.instructions || ''}
                    onChange={(e) => handleUpdateMedication(item.id, { instructions: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs text-slate-600 italic"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Enregistrer le compte rendu & Clôturer la consultation</span>
          </button>
        </div>
      </form>

      {/* Printable Prescription Modal */}
      {showPrintModal && createdPrescription && (
        <PrintablePrescription
          prescription={createdPrescription}
          patient={activePatient}
          doctor={currentDoctor}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
