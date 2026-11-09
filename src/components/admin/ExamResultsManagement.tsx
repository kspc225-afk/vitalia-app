import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MedicalExam, ExamStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { PrintableResult } from '../common/PrintableResult';
import {
  Microscope,
  Plus,
  Search,
  CheckCircle2,
  Send,
  Eye,
  FileText,
  UploadCloud,
  FileCheck2,
  Clock,
  Printer,
} from 'lucide-react';

export const ExamResultsManagement: React.FC = () => {
  const {
    exams,
    patients,
    doctors,
    createExam,
    updateExamStatus,
    publishExamResult,
    currentUser,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditResultModalOpen, setIsEditResultModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<MedicalExam | null>(null);
  const [viewPrintResult, setViewPrintResult] = useState<MedicalExam | null>(null);

  // New Exam Form
  const [newExamData, setNewExamData] = useState({
    patientId: patients[0]?.id || '',
    prescribingDoctorId: doctors[0]?.id || '',
    examType: '',
    category: 'biologie' as 'biologie' | 'imagerie' | 'cardiologie' | 'autre',
    description: '',
  });

  // Edit/Add Results Form
  const [resultFindings, setResultFindings] = useState('');
  const [resultNormalValues, setResultNormalValues] = useState('');
  const [resultLabTech, setResultLabTech] = useState(currentUser.name);

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      `${e.patientName} ${e.examType} ${e.code} ${e.prescribingDoctorName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newExamData.patientId);
    const doc = doctors.find((d) => d.id === newExamData.prescribingDoctorId);
    if (!pat || !doc || !newExamData.examType) return;

    createExam({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      prescribingDoctorId: doc.id,
      prescribingDoctorName: `Dr. ${doc.firstName} ${doc.lastName}`,
      examType: newExamData.examType,
      category: newExamData.category,
      description: newExamData.description || 'Examen complémentaire diagnostique.',
    });

    setIsCreateModalOpen(false);
    setNewExamData({
      patientId: patients[0]?.id || '',
      prescribingDoctorId: doctors[0]?.id || '',
      examType: '',
      category: 'biologie',
      description: '',
    });
  };

  const handleOpenEditResult = (exam: MedicalExam) => {
    setSelectedExam(exam);
    setResultFindings(exam.findings || '');
    setResultNormalValues(exam.normalValues || '');
    setResultLabTech(exam.labTechName || currentUser.name);
    setIsEditResultModalOpen(true);
  };

  const handleSaveResult = (newStatus: ExamStatus) => {
    if (!selectedExam) return;

    updateExamStatus(selectedExam.id, newStatus, {
      findings: resultFindings,
      normalValues: resultNormalValues,
      labTechName: resultLabTech,
      fileName: `${selectedExam.examType.replace(/\s+/g, '_')}_${selectedExam.patientName.replace(/\s+/g, '_')}.pdf`,
      fileSize: '380 Ko',
    });

    setIsEditResultModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratoire & Résultats d'Examens Médicaux
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Circuit d'analyses : prescription, saisie des résultats, validation médicale et publication sécurisée.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Prescrire / Ajouter un Examen</span>
        </button>
      </div>

      {/* Workflow Explanatory Steps Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        {[
          { step: '1', title: 'En attente', desc: 'Prescription reçue' },
          { step: '2', title: 'En cours', desc: 'Prélèvement / Test' },
          { step: '3', title: 'Disponible', desc: 'Résultats saisis' },
          { step: '4', title: 'En validation', desc: 'Revue médicale' },
          { step: '5', title: 'Validé', desc: 'Signé par médecin' },
          { step: '6', title: 'Publié', desc: 'Visible au patient' },
        ].map((item) => (
          <div key={item.step} className="p-2 rounded bg-white border border-slate-200 text-center">
            <span className="font-bold text-[10px] text-slate-700 block">ÉTAPE {item.step}</span>
            <span className="font-bold text-slate-800 text-[11px] block">{item.title}</span>
            <span className="text-[10px] text-slate-400 block">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par patient, examen, code, médecin..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">Toutes catégories</option>
            <option value="biologie">Biologie médicale</option>
            <option value="imagerie">Imagerie & Échographie</option>
            <option value="cardiologie">Cardiologie (ECG, etc.)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente de réalisation</option>
            <option value="en_cours">En cours au laboratoire</option>
            <option value="disponible">Résultats disponibles</option>
            <option value="en_validation">En validation</option>
            <option value="valide">Validé (interne)</option>
            <option value="publie">Publié (espace patient)</option>
          </select>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Examen & Catégorie</th>
                <th className="py-3 px-4">Prescripteur</th>
                <th className="py-3 px-4">Date Prescription</th>
                <th className="py-3 px-4">Statut Workflow</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{exam.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{exam.patientName}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{exam.examType}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-600 mt-0.5">
                      {exam.category}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{exam.prescribingDoctorName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {new Date(exam.requestedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={exam.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Step Action Buttons */}
                      {exam.status === 'en_attente' && (
                        <button
                          onClick={() => updateExamStatus(exam.id, 'en_cours')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] cursor-pointer"
                        >
                          Lancer analyse
                        </button>
                      )}

                      {(exam.status === 'en_cours' || exam.status === 'disponible') && (
                        <button
                          onClick={() => handleOpenEditResult(exam)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Saisir résultats</span>
                        </button>
                      )}

                      {exam.status === 'en_validation' && (
                        <button
                          onClick={() => updateExamStatus(exam.id, 'valide')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Valider</span>
                        </button>
                      )}

                      {exam.status === 'valide' && (
                        <button
                          onClick={() => publishExamResult(exam.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publier au patient</span>
                        </button>
                      )}

                      {/* View & Print Result */}
                      {exam.findings && (
                        <button
                          onClick={() => setViewPrintResult(exam)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                          title="Voir le bulletin imprimable"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Prescribe / Add Exam */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Prescription ou Enregistrement d'un Examen"
        subtitle="Transmission au laboratoire d'analyses médicales ou service d'imagerie"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Patient concerné *</label>
            <select
              value={newExamData.patientId}
              onChange={(e) => setNewExamData({ ...newExamData, patientId: e.target.value })}
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
            <label className="block font-semibold text-slate-700 mb-1">Médecin prescripteur *</label>
            <select
              value={newExamData.prescribingDoctorId}
              onChange={(e) => setNewExamData({ ...newExamData, prescribingDoctorId: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} ({d.specialtyName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Intitulé de l'examen *</label>
              <input
                type="text"
                required
                placeholder="Ex: Hémogramme NFS, Scanner cérébral..."
                value={newExamData.examType}
                onChange={(e) => setNewExamData({ ...newExamData, examType: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
              <select
                value={newExamData.category}
                onChange={(e) => setNewExamData({ ...newExamData, category: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="biologie">Biologie Médicale</option>
                <option value="imagerie">Imagerie Médicale</option>
                <option value="cardiologie">Cardiologie</option>
                <option value="autre">Autre examen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Indication / Renseignements cliniques</label>
            <textarea
              rows={3}
              placeholder="Ex: Bilan pré-opératoire, suspicion de syndrome anémique..."
              value={newExamData.description}
              onChange={(e) => setNewExamData({ ...newExamData, description: e.target.value })}
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
              Créer la demande d'examen
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Saisie & Validation des résultats */}
      {selectedExam && (
        <Modal
          isOpen={isEditResultModalOpen}
          onClose={() => setIsEditResultModalOpen(false)}
          title={`Saisie des Résultats : ${selectedExam.examType}`}
          subtitle={`Dossier N° ${selectedExam.code} · Patient : ${selectedExam.patientName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Patient
                </span>
                <span className="font-bold text-slate-900">{selectedExam.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Prescripteur
                </span>
                <span className="font-bold text-slate-900">{selectedExam.prescribingDoctorName}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Résultats d'analyses & Chiffres observés *
              </label>
              <textarea
                rows={6}
                value={resultFindings}
                onChange={(e) => setResultFindings(e.target.value)}
                placeholder="Exemple :
Hémoglobine : 13.2 g/dL (N : 12.0 - 16.0)
Leucocytes : 7 200 /mm³ (N : 4 000 - 10 000)
Plaquettes : 280 000 /mm³ (N : 150 000 - 450 000)
Conclusion : NFS normale sans anomalie qualitative ou quantitative."
                className="w-full p-3 font-mono border border-slate-300 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Intervalles de référence ou valeurs normales
              </label>
              <input
                type="text"
                value={resultNormalValues}
                onChange={(e) => setResultNormalValues(e.target.value)}
                placeholder="Ex: Hb: 12-16 g/dL | GB: 4000-10000 | Plq: 150-450k"
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Biologiste ou technicien responsable
                </label>
                <input
                  type="text"
                  value={resultLabTech}
                  onChange={(e) => setResultLabTech(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fichier PDF / Document joint</label>
                <div className="p-2 border border-dashed border-slate-300 rounded-lg flex items-center justify-between text-slate-500">
                  <span className="truncate">{selectedExam.fileName || 'Bulletin_Analyse_Genere.pdf'}</span>
                  <UploadCloud className="w-4 h-4 text-slate-700 shrink-0" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <span className="text-[11px] text-slate-400">
                Statut actuel : <strong className="text-slate-700">{selectedExam.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveResult('disponible')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Sauvegarder brouillon
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveResult('en_validation')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Transmettre en validation
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveResult('publie')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Valider & Publier immédiatement</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Sheet Modal */}
      {viewPrintResult && (
        <PrintableResult
          exam={viewPrintResult}
          patient={patients.find((p) => p.id === viewPrintResult.patientId)}
          onClose={() => setViewPrintResult(null)}
        />
      )}
    </div>
  );
};
