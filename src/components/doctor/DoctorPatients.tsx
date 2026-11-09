import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  Stethoscope,
  Microscope,
  Pill,
  ChevronRight,
} from 'lucide-react';

interface DoctorPatientsProps {
  onStartConsultation: (patientId: string) => void;
}

export const DoctorPatients: React.FC<DoctorPatientsProps> = ({ onStartConsultation }) => {
  const { currentUser, doctors, patients, consultations, prescriptions, exams } = useStore();

  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Patients assigned to this doctor
  const assignedPatients = patients.filter((p) => p.assignedDoctorId === currentDoctor.id);

  const filteredPatients = assignedPatients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.patientCode} ${p.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const activePatient =
    assignedPatients.find((p) => p.id === selectedPatientId) || assignedPatients[0];

  const patientConsultations = consultations.filter((c) => c.patientId === activePatient?.id);
  const patientPrescriptions = prescriptions.filter((pr) => pr.patientId === activePatient?.id);
  const patientExams = exams.filter((e) => e.patientId === activePatient?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          File Active des Patients Attribués
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dossiers individuels sous votre responsabilité médicale directe ({assignedPatients.length} patient(s)).
        </p>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Assigned Patients List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher parmi vos patients..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucun patient trouvé dans votre file active.
              </div>
            ) : (
              filteredPatients.map((pat) => {
                const isSelected = pat.id === activePatient?.id;
                return (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatientId(pat.id)}
                    className={`p-4 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-slate-100 border-l-4 border-l-slate-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {pat.avatar ? (
                          <img
                            src={pat.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          `${pat.firstName.charAt(0)}${pat.lastName.charAt(0)}`
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {pat.firstName} {pat.lastName}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            {pat.patientCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Tél : <span className="font-mono">{pat.phone}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Patient Medical History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activePatient ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {/* Patient Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {activePatient.firstName} {activePatient.lastName}
                    </h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                      {activePatient.patientCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>
                      Né(e) le{' '}
                      {new Date(activePatient.birthDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span className="font-mono font-bold text-slate-700">
                      Gr. Sanguin : {activePatient.bloodGroup || 'N/A'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onStartConsultation(activePatient.id)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Nouvelle consultation</span>
                </button>
              </div>

              {/* Dossier Body */}
              <div className="p-6 space-y-6 text-xs">
                {/* Allergies Alert */}
                {activePatient.allergies && activePatient.allergies.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      <strong>Allergies signalées :</strong> {activePatient.allergies.join(', ')}
                    </span>
                  </div>
                )}

                {/* Consultations History */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                    Historique des Comptes Rendus de Consultation ({patientConsultations.length})
                  </h4>

                  {patientConsultations.length === 0 ? (
                    <p className="text-slate-400 italic">Aucune consultation passée enregistrée.</p>
                  ) : (
                    patientConsultations.map((cs) => (
                      <div
                        key={cs.id}
                        className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">
                            {cs.code} — {cs.specialtyName}
                          </span>
                          <span className="font-mono text-slate-500">
                            {cs.date} à {cs.time}
                          </span>
                        </div>
                        {cs.vitals && (
                          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
                            <span>TA: {cs.vitals.bloodPressure || 'N/A'}</span>
                            <span>·</span>
                            <span>Pouls: {cs.vitals.pulse} bpm</span>
                            <span>·</span>
                            <span>T°: {cs.vitals.temperature}°C</span>
                            <span>·</span>
                            <span>Poids: {cs.vitals.weight} kg</span>
                          </div>
                        )}
                        <p className="text-slate-700">
                          <strong>Observations :</strong> {cs.clinicalObservations}
                        </p>
                        <p className="text-slate-800 font-medium">
                          <strong>Diagnostic :</strong> {cs.diagnosis}
                        </p>
                        <p className="text-slate-600">
                          <strong>Traitement :</strong> {cs.treatment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Lab Results */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                    Analyses & Résultats Biologiques ({patientExams.length})
                  </h4>

                  {patientExams.length === 0 ? (
                    <p className="text-slate-400 italic">Aucun examen de laboratoire consigné.</p>
                  ) : (
                    patientExams.map((ex) => (
                      <div
                        key={ex.id}
                        className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{ex.examType}</span>
                          <StatusBadge status={ex.status} size="sm" />
                        </div>
                        {ex.findings && (
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 font-mono text-[11px] whitespace-pre-line text-slate-700">
                            {ex.findings}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center text-xs text-slate-400 rounded-xl border border-slate-200">
              Sélectionnez un patient pour consulter son historique médical complet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
