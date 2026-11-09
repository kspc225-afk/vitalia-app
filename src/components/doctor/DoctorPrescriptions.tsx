import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Prescription } from '../../types';
import { PrintablePrescription } from '../common/PrintablePrescription';
import { Pill, Printer, Search, FileText, CheckCircle2 } from 'lucide-react';

export const DoctorPrescriptions: React.FC = () => {
  const { currentUser, doctors, patients, prescriptions } = useStore();

  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const doctorPrescriptions = prescriptions.filter((pr) => pr.doctorId === currentDoctor.id);

  const filteredPrescriptions = doctorPrescriptions.filter((pr) =>
    `${pr.patientName} ${pr.code} ${pr.medications.map((m) => m.medicationName).join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Registre des Ordonnances Médicales
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Archivage certifié, conformité réglementaire et réimpression des ordonnances délivrées.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par patient, code ordonnance, médicament..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-300"
          />
        </div>
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrescriptions.map((pr) => {
          const patient = patients.find((p) => p.id === pr.patientId);
          return (
            <div
              key={pr.id}
              className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-400 shadow-2xs p-5 flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-800">{pr.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{pr.patientName}</h3>
                    <p className="text-xs text-slate-500">
                      Délivrée le{' '}
                      {new Date(pr.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Signée électroniquement
                  </span>
                </div>

                {/* Medications List preview */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Médicaments prescrits ({pr.medications.length}) :
                  </span>
                  {pr.medications.map((item, idx) => (
                    <div key={idx} className="flex items-baseline justify-between text-slate-700">
                      <span className="font-semibold">{item.medicationName} ({item.dosage})</span>
                      <span className="text-slate-500 font-mono text-[11px]">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Valable jusqu'au {pr.validUntil}
                </span>

                <button
                  onClick={() => setSelectedPrescription(pr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / Télécharger</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Modal */}
      {selectedPrescription && (
        <PrintablePrescription
          prescription={selectedPrescription}
          patient={patients.find((p) => p.id === selectedPrescription.patientId)}
          doctor={currentDoctor}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};
