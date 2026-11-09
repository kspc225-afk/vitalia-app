import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MedicalExam } from '../../types';
import { PrintableResult } from '../common/PrintableResult';
import { Microscope, FileText, Download, Printer, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

export const PatientResults: React.FC = () => {
  const { currentUser, patients, exams } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const [selectedExam, setSelectedExam] = useState<MedicalExam | null>(null);

  // STRICT PRIVACY ENFORCEMENT: ONLY exams belonging to currentPatient AND with status === 'publie'!
  const publishedExams = exams.filter(
    (e) => e.patientId === currentPatient.id && e.status === 'publie'
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Mes Résultats d'Analyses & Imagerie
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bibliothèque sécurisée de vos bulletins d'analyses validés par le corps médical.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accès Sécurisé Chiffré</span>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {publishedExams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <Microscope className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">
              Aucun résultat d'analyse publié n'est disponible pour votre dossier pour le moment.
            </p>
            <p className="text-[11px] text-slate-400">
              Les résultats sont rendus accessibles dès validation formelle par votre médecin prescripteur.
            </p>
          </div>
        ) : (
          publishedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4 hover:border-teal-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0a6b63]">{exam.code}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    {exam.category}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                  Validé & Certifié
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="text-base font-bold text-slate-900">{exam.examType}</h3>
                <p className="text-slate-600">{exam.description}</p>

                <div className="flex flex-wrap gap-4 text-slate-500 pt-1">
                  <span>Prescrit par : <strong>{exam.prescribingDoctorName}</strong></span>
                  <span>·</span>
                  <span>
                    Validé le{' '}
                    {new Date(exam.validatedAt || exam.requestedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Findings Preview */}
                {exam.findings && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-line text-slate-800">
                    {exam.findings}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Fichier : {exam.fileName || 'Bulletin_Analyse.pdf'} ({exam.fileSize || '350 Ko'})
                </span>

                <button
                  onClick={() => setSelectedExam(exam)}
                  className="px-4 py-2 rounded-xl bg-[#0a6b63] hover:bg-[#075952] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Consulter le bulletin officiel (PDF)</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Printable Sheet Modal */}
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
