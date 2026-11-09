import React from 'react';
import { useStore } from '../../services/store';
import { Stethoscope, Calendar, Activity, Pill, ShieldCheck } from 'lucide-react';

export const PatientMedicalRecord: React.FC = () => {
  const { currentUser, patients, consultations, doctors } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const assignedDoctor = doctors.find((d) => d.id === currentPatient.assignedDoctorId);
  const myConsultations = consultations.filter((c) => c.patientId === currentPatient.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Mon Dossier Médical Partagé
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Historique chronologique consolidé de vos consultations, diagnostics et bilans cliniques.
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Identifiant</span>
            <span className="font-mono font-bold text-slate-800">{currentPatient.patientCode}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Groupe Sanguin</span>
            <span className="font-mono font-bold text-slate-800">{currentPatient.bloodGroup || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Médecin Référent</span>
            <span className="font-bold text-[#0a6b63]">
              {assignedDoctor ? `Dr. ${assignedDoctor.lastName}` : 'Attribution en cours'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Inscription</span>
            <span className="font-mono text-slate-600">{currentPatient.registeredAt}</span>
          </div>
        </div>
      </div>

      {/* Allergies / Pathologies Warning */}
      {currentPatient.allergies && currentPatient.allergies.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block">
            Allergies & Intolérances enregistrées :
          </span>
          <p className="font-semibold text-rose-700">{currentPatient.allergies.join(', ')}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Parcours Médical & Consultations Réalisées ({myConsultations.length})
        </h3>

        {myConsultations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Aucun compte rendu de consultation consigné pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {myConsultations.map((cs) => (
              <div
                key={cs.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0a6b63]">{cs.code}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="font-bold text-slate-900 text-sm">{cs.specialtyName}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500">
                    {new Date(cs.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    à {cs.time}
                  </span>
                </div>

                {/* Vitals summary if recorded */}
                {cs.vitals && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Tension</span>
                      <strong className="text-slate-800">{cs.vitals.bloodPressure || 'N/A'} mmHg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Pouls</span>
                      <strong className="text-slate-800">{cs.vitals.pulse} bpm</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Température</span>
                      <strong className="text-slate-800">{cs.vitals.temperature}°C</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Poids</span>
                      <strong className="text-slate-800">{cs.vitals.weight} kg</strong>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Motif & Observations :</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{cs.clinicalObservations}</p>
                  </div>

                  <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                    <span className="font-bold text-teal-950 block">Diagnostic Médical :</span>
                    <p className="text-teal-900 font-semibold mt-0.5">{cs.diagnosis}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block">Traitement prescrit :</span>
                    <p className="text-slate-600 mt-0.5">{cs.treatment}</p>
                  </div>

                  {cs.recommendations && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900">
                      <span className="font-bold text-[11px] uppercase tracking-wider block">
                        Recommandations & Hygiène de vie :
                      </span>
                      <p className="text-xs mt-0.5">{cs.recommendations}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Praticien : <strong>{cs.doctorName}</strong></span>
                  {cs.followUpDate && (
                    <span className="font-mono text-teal-800 font-semibold">
                      Prochain contrôle conseillé : {cs.followUpDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
