import React from 'react';
import { Prescription, Patient, Doctor } from '../../types';
import { Printer, X, ShieldCheck, QrCode } from 'lucide-react';
import { OsirixLogo } from './OsirixLogo';

interface PrintablePrescriptionProps {
  prescription: Prescription;
  patient?: Patient;
  doctor?: Doctor;
  onClose: () => void;
}

export const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({
  prescription,
  patient,
  doctor,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Modal Controls Toolbar (Hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-800 text-teal-200">
              {prescription.code}
            </span>
            <span>Ordonnance médicale officielle</span>
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

        {/* Printable Document Body */}
        <div className="printable-document p-8 md:p-12 bg-white text-slate-800 space-y-8 font-sans">
          {/* Header with Clinique Vitalia letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-6">
            <div className="space-y-1.5">
              <OsirixLogo size="lg" />
              <p className="text-xs text-slate-600 max-w-sm pt-1">
                Clinique Médico-Chirurgicale & Centre de Spécialités
                <br />
                Boulevard Mitterrand — Abidjan, Côte d'Ivoire
                <br />
                Urgences 24/7 : +225 27 22 00 11 22 · contact@clinique-vitalia.ci
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="font-mono text-xs font-semibold text-slate-500">
                N° : <span className="text-slate-900 font-bold">{prescription.code}</span>
              </div>
              <p className="text-xs text-slate-500">
                Date :{' '}
                <span className="font-medium text-slate-800">
                  {new Date(prescription.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Valable jusqu'au : {new Date(prescription.validUntil).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Practitioner & Patient Meta Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
            {/* Prescriber */}
            <div className="space-y-1 border-r border-slate-200 pr-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Médecin Prescripteur
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Dr. {prescription.doctorName.replace(/^Dr\.\s*/i, '')}
              </h4>
              <p className="text-xs text-slate-600">
                {doctor?.specialtyName || 'Cardiologie & Médecine Interne'}
              </p>
              <p className="text-xs font-mono text-slate-500">
                N° Ordre : {prescription.doctorMatricule || doctor?.matricule || 'MED-CI-4819'}
              </p>
            </div>

            {/* Patient */}
            <div className="space-y-1 pl-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Bénéficiaire des soins
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{prescription.patientName}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                {patient?.birthDate && (
                  <span>
                    Né(e) le {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {patient?.patientCode && (
                  <span className="font-mono text-slate-500">({patient.patientCode})</span>
                )}
              </div>
              {patient?.allergies && patient.allergies.length > 0 && (
                <p className="text-[11px] text-rose-600 font-medium">
                  Allergie(s) connue(s) : {patient.allergies.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Prescription symbol */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-serif italic font-bold text-slate-800">Rx</span>
            <div className="h-0.5 flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prescription Thérapeutique
            </span>
          </div>

          {/* Medications list */}
          <div className="space-y-5 min-h-[180px]">
            {prescription.medications.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      0{index + 1}.
                    </span>
                    <span className="font-bold text-slate-900 text-sm tracking-tight uppercase">
                      {item.medicationName}
                    </span>
                    <span className="text-xs font-medium text-slate-600">({item.dosage})</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Durée : {item.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-700 pl-6 font-medium">
                  → Posologie : {item.frequency}
                </p>
                {item.instructions && (
                  <p className="text-xs text-slate-500 pl-6 italic">
                    Note : {item.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* General instructions */}
          {prescription.instructions && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                Conseils thérapeutiques & précautions :
              </span>
              <p>{prescription.instructions}</p>
            </div>
          )}

          {/* Signature & Stamp Footer */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between">
            {/* Security QR verification badge */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded flex items-center justify-center p-1">
                <QrCode className="w-full h-full text-slate-700" />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5 max-w-[200px]">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Document Certifié Clinique Vitalia</span>
                </div>
                <p>Signature numérique horodatée et archivée au dossier médical centralisé.</p>
              </div>
            </div>

            {/* Doctor Stamp & Signature Box */}
            <div className="text-right space-y-2">
              <p className="text-xs text-slate-500">Cachet et Signature du Praticien</p>
              <div className="w-48 h-24 border border-dashed border-slate-400 rounded-lg bg-slate-50 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-900 uppercase">
                  Clinique Vitalia
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Dr. {prescription.doctorName.replace(/^Dr\.\s*/i, '')}
                </span>
                <span className="text-[9px] font-mono text-slate-600">
                  {prescription.doctorMatricule}
                </span>
                <div className="text-[10px] text-slate-600 italic mt-1 font-serif">
                  Signé électroniquement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
