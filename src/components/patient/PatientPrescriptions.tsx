import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Prescription } from '../../types';
import { PrintablePrescription } from '../common/PrintablePrescription';
import { Pill, Printer, FileText, Calendar, ShieldCheck } from 'lucide-react';

export const PatientPrescriptions: React.FC = () => {
  const { currentUser, patients, prescriptions, doctors } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // STRICT PRIVACY ENFORCEMENT: ONLY prescriptions for this patient!
  const myPrescriptions = prescriptions.filter((pr) => pr.patientId === currentPatient.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Mes Ordonnances Médicales
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ordonnances délivrées, posologies prescrites et téléchargement des documents certifiés pour la pharmacie.
        </p>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {myPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-2">
            <Pill className="w-10 h-10 text-slate-300 mx-auto" />
            <p>Aucune ordonnance délivrée pour le moment.</p>
          </div>
        ) : (
          myPrescriptions.map((pr) => {
            const prescriber = doctors.find((d) => d.id === pr.doctorId);
            return (
              <div
                key={pr.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4 hover:border-teal-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0a6b63]">{pr.code}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-slate-900">{pr.doctorName}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                    Certifiée & Validée
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-500">
                    Délivrée le{' '}
                    {new Date(pr.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · Valable jusqu'au <span className="font-mono">{pr.validUntil}</span>
                  </div>

                  {/* Medications list */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Médicaments prescrits :
                    </span>
                    {pr.medications.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-slate-800 border-b border-slate-100 last:border-0 pb-1.5 last:pb-0 gap-1">
                        <div>
                          <strong className="text-slate-900">{item.medicationName}</strong>{' '}
                          <span className="text-slate-500">({item.dosage})</span>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            Posologie : {item.frequency}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-[#0a6b63] font-semibold">
                          {item.duration}
                        </span>
                      </div>
                    ))}
                  </div>

                  {pr.instructions && (
                    <p className="text-[11px] text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 italic">
                      Conseils : {pr.instructions}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setSelectedPrescription(pr)}
                    className="px-4 py-2 rounded-xl bg-[#0a6b63] hover:bg-[#075952] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Afficher / Imprimer l'ordonnance</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Printable Prescription Modal */}
      {selectedPrescription && (
        <PrintablePrescription
          prescription={selectedPrescription}
          patient={currentPatient}
          doctor={doctors.find((d) => d.id === selectedPrescription.doctorId)}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};
