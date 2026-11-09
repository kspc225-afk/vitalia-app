import React from 'react';
import { useStore } from '../../services/store';
import { ExamResultsManagement } from '../admin/ExamResultsManagement';
import { Microscope, FlaskConical, CheckCircle2, Clock } from 'lucide-react';

export const LabLayout: React.FC = () => {
  const { exams } = useStore();

  const pendingExams = exams.filter((e) => e.status === 'en_attente').length;
  const inProgressExams = exams.filter((e) => e.status === 'en_cours').length;
  const inValidationExams = exams.filter((e) => e.status === 'en_validation' || e.status === 'disponible').length;
  const publishedExams = exams.filter((e) => e.status === 'publie').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Lab Header Strip */}
      <div className="bg-gradient-to-r from-slate-900 to-[#063d37] p-6 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              Plateau Technique & Analyses Médicales
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Espace Laboratoire & Biologie Médicale
            </h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Traitement des échantillons, saisie biomédicale, contrôle qualité et validation des résultats.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center font-mono shrink-0">
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="block text-[10px] text-teal-200">En attente</span>
            <strong className="text-base text-amber-300">{pendingExams}</strong>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="block text-[10px] text-teal-200">En cours</span>
            <strong className="text-base text-sky-300">{inProgressExams}</strong>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="block text-[10px] text-teal-200">Validation</span>
            <strong className="text-base text-indigo-300">{inValidationExams}</strong>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="block text-[10px] text-teal-200">Publiés</span>
            <strong className="text-base text-emerald-300">{publishedExams}</strong>
          </div>
        </div>
      </div>

      {/* Embedded Complete Exam Workflow Engine */}
      <ExamResultsManagement />
    </div>
  );
};
