import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MedicalExam, Prescription, Consultation } from '../../types';
import { PrintablePrescription } from '../common/PrintablePrescription';
import { PrintableResult } from '../common/PrintableResult';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Microscope,
  Pill,
  Stethoscope,
  Printer,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const PatientDossierMedical: React.FC = () => {
  const { currentUser, patients, exams, prescriptions, consultations, doctors } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const [activeTab, setActiveTab] = useState<'all' | 'exams' | 'prescriptions' | 'consultations'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedExam, setSelectedExam] = useState<MedicalExam | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  // STRICT PRIVACY: Current patient only!
  const myExams = exams.filter((e) => e.patientId === currentPatient.id && e.status === 'publie');
  const myPrescriptions = prescriptions.filter((p) => p.patientId === currentPatient.id);
  const myConsultations = consultations.filter((c) => c.patientId === currentPatient.id);

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#00796F] block">
              Bibliothèque Médicale Personnelle
            </span>
            <h2 className="text-xl font-extrabold text-[#101513]">Mon Dossier Médical</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifiant Patient : <strong className="font-mono text-[#00796F]">{currentPatient.patientCode}</strong>
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-[#E8F5EF] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00796F]" />
            <span>Sécurisé</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-[#00796F] text-white shadow-xs'
                : 'bg-[#F3F5F4] text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({myExams.length + myPrescriptions.length + myConsultations.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'exams'
                ? 'bg-[#00796F] text-white shadow-xs'
                : 'bg-[#F3F5F4] text-slate-600 hover:text-slate-900'
            }`}
          >
            Analyses ({myExams.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-[#00796F] text-white shadow-xs'
                : 'bg-[#F3F5F4] text-slate-600 hover:text-slate-900'
            }`}
          >
            Ordonnances ({myPrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'consultations'
                ? 'bg-[#00796F] text-white shadow-xs'
                : 'bg-[#F3F5F4] text-slate-600 hover:text-slate-900'
            }`}
          >
            Comptes Rendus ({myConsultations.length})
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {/* Lab Exams Section */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <>
            {myExams.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 hover:border-[#00796F] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Microscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Résultat d'analyse
                      </span>
                      <h4 className="font-extrabold text-sm text-[#101513]">{ex.examType}</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F5EF] px-2 py-0.5 rounded-full">
                    Publié
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Prescripteur :</span>
                    <strong className="text-slate-800">{ex.prescribingDoctorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Date de réalisation :</span>
                    <span className="font-mono text-slate-700">{ex.performedAt?.split('T')[0] || '18/10/2026'}</span>
                  </div>
                </div>

                {ex.findings && (
                  <div className="p-3 bg-[#F3F5F4] rounded-2xl font-mono text-[11px] text-slate-800 whitespace-pre-line leading-relaxed">
                    {ex.findings}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedExam(ex)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00796F] hover:bg-[#073D38] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Consulter le bulletin officiel (PDF)</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Prescriptions Section */}
        {(activeTab === 'all' || activeTab === 'prescriptions') && (
          <>
            {myPrescriptions.map((pr) => (
              <div
                key={pr.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 hover:border-[#00796F] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                        Ordonnance Médicale
                      </span>
                      <h4 className="font-extrabold text-sm text-[#101513]">
                        {pr.code} · {pr.doctorName}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F5EF] px-2 py-0.5 rounded-full">
                    Certifiée
                  </span>
                </div>

                <div className="p-3 bg-[#F3F5F4] rounded-2xl space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Médicaments :</span>
                  {pr.medications.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-slate-800">
                      <span>{m.medicationName} ({m.dosage})</span>
                      <span className="font-mono text-slate-500">{m.duration}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Valable jusqu'au {pr.validUntil}</span>
                  <button
                    onClick={() => setSelectedPrescription(pr)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00796F] hover:bg-[#073D38] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer l'ordonnance</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Consultations Section */}
        {(activeTab === 'all' || activeTab === 'consultations') && (
          <>
            {myConsultations.map((cs) => (
              <div
                key={cs.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 hover:border-[#00796F] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00796F] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00796F]">
                        Compte Rendu Clinique
                      </span>
                      <h4 className="font-extrabold text-sm text-[#101513]">
                        {cs.code} · {cs.specialtyName}
                      </h4>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-500">{cs.date}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong>Diagnostic :</strong> {cs.diagnosis}</p>
                  <p className="text-slate-500"><strong>Traitement :</strong> {cs.treatment}</p>
                  {cs.recommendations && (
                    <div className="p-2.5 bg-amber-50 rounded-xl text-amber-900 text-[11px] border border-amber-200">
                      <strong>Recommandations :</strong> {cs.recommendations}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  Praticien responsable : <strong>{cs.doctorName}</strong>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal Printable Prescription */}
      {selectedPrescription && (
        <PrintablePrescription
          prescription={selectedPrescription}
          patient={currentPatient}
          doctor={doctors.find((d) => d.id === selectedPrescription.doctorId)}
          onClose={() => setSelectedPrescription(null)}
        />
      )}

      {/* Modal Printable Result */}
      {selectedExam && (
        <PrintableResult
          exam={selectedExam}
          patient={currentPatient}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};
