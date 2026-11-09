import React from 'react';
import { MedicalExam, Patient } from '../../types';
import { Printer, X, FileCheck2, ShieldCheck } from 'lucide-react';
import { OsirixLogo } from './OsirixLogo';

interface PrintableResultProps {
  exam: MedicalExam;
  patient?: Patient;
  onClose: () => void;
}

export const PrintableResult: React.FC<PrintableResultProps> = ({ exam, patient, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-800 text-teal-200">
              {exam.code}
            </span>
            <span>Bulletin officiel de résultats médicaux</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimer / Sauvegarder PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="printable-document p-8 md:p-12 bg-white text-slate-800 space-y-6 font-sans">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-6">
            <div className="space-y-1">
              <OsirixLogo size="lg" />
              <p className="text-xs text-slate-600 max-w-sm pt-1">
                Laboratoire d'Analyses Médicales & Imagerie Numérique
                <br />
                Agrément National de Santé Publique N° 2024/MSHPC/CAB
                <br />
                Abidjan — Tél : +225 27 22 00 11 23
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="font-mono text-xs font-semibold text-slate-500">
                Dossier N° : <span className="text-slate-900 font-bold">{exam.code}</span>
              </div>
              <p className="text-xs text-slate-500">
                Prélèvement :{' '}
                <span className="font-medium text-slate-800">
                  {exam.performedAt
                    ? new Date(exam.performedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Validation :{' '}
                <span className="font-medium text-slate-800">
                  {exam.validatedAt
                    ? new Date(exam.validatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'En attente'}
                </span>
              </p>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-200 text-xs">
            <div className="space-y-1 border-r border-slate-200 pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a6b63]">
                Patient(e)
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{exam.patientName}</h4>
              <p className="text-slate-600">
                Identifiant : <span className="font-mono font-medium">{patient?.patientCode || 'PT-2026-001'}</span>
              </p>
              {patient?.birthDate && (
                <p className="text-slate-500">
                  Né(e) le : {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <div className="space-y-1 pl-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a6b63]">
                Prescripteur & Responsable
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{exam.prescribingDoctorName}</h4>
              <p className="text-slate-600">
                Biologiste : {exam.labTechName || 'Ibrahim Diop (Biologiste)'}
              </p>
              <p className="text-slate-500">Catégorie : {exam.category.toUpperCase()}</p>
            </div>
          </div>

          {/* Exam Title */}
          <div className="p-4 bg-teal-50/70 rounded-lg border border-teal-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Examen Réalisé
              </span>
              <h3 className="text-base font-bold text-slate-900">{exam.examType}</h3>
              <p className="text-xs text-slate-600">{exam.description}</p>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 bg-white text-emerald-800 font-semibold rounded border border-emerald-200 inline-flex items-center gap-1.5 shadow-2xs">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                Résultat Validé
              </span>
            </div>
          </div>

          {/* Findings & Values */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Résultats & Observations Cliniques
            </h4>

            {exam.findings ? (
              <div className="p-4 bg-white border border-slate-200 rounded-lg whitespace-pre-line font-mono text-xs leading-relaxed text-slate-800">
                {exam.findings}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-xs">
                Résultats en cours de saisie par le laboratoire.
              </div>
            )}

            {exam.normalValues && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-700">Intervalles de référence :</span>{' '}
                {exam.normalValues}
              </div>
            )}
          </div>

          {/* Footer Validation Stamp */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Validé sous la responsabilité du Biologiste Médical — Clinique Vitalia</span>
            </div>
            <div className="text-right">
              <div className="w-44 h-20 border border-slate-300 rounded bg-slate-50 p-2 text-center flex flex-col justify-center">
                <span className="text-[9px] uppercase font-bold text-slate-900">
                  Laboratoire Central Vitalia
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {exam.labTechName || 'Dr. Ibrahim Diop'}
                </span>
                <span className="text-[9px] text-slate-500">Validation Biologique</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
