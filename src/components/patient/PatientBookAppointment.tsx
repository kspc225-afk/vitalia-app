import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Specialty, Doctor } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  Baby,
  Stethoscope,
  ShieldAlert,
} from 'lucide-react';

interface PatientBookAppointmentProps {
  onSuccess: () => void;
}

export const PatientBookAppointment: React.FC<PatientBookAppointmentProps> = ({ onSuccess }) => {
  const { specialties, doctors, currentUser, patients, createAppointment } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  // Wizard steps: 1 = Spécialité, 2 = Médecin, 3 = Date & Créneau, 4 = Motif & Confirmation
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(specialties[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-10');
  const [selectedTime, setSelectedTime] = useState<string>('09:30');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Filter doctors by selected specialty
  const activeSpecialty = specialties.find((s) => s.id === selectedSpecialtyId);
  const availableDoctors = doctors.filter(
    (d) => d.specialtyId === selectedSpecialtyId && d.isActive
  );
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const hoursList = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleSpecialtySelect = (specId: string) => {
    setSelectedSpecialtyId(specId);
    // Auto select first doctor if available
    const doc = doctors.find((d) => d.specialtyId === specId && d.isActive);
    if (doc) setSelectedDoctorId(doc.id);
    setStep(2);
  };

  const handleDoctorSelect = (docId: string) => {
    setSelectedDoctorId(docId);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Veuillez indiquer le motif de votre consultation.');
      return;
    }
    setErrorMsg(null);

    const result = createAppointment({
      patientId: currentPatient.id,
      doctorId: selectedDoctorId,
      specialtyId: selectedSpecialtyId,
      date: selectedDate,
      time: selectedTime,
      reason: reason.trim(),
      notes: 'Demande soumise en ligne depuis l’espace patient.',
    });

    if (!result.success) {
      setErrorMsg(result.message || 'Ce créneau est déjà réservé. Veuillez en choisir un autre.');
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center max-w-lg mx-auto space-y-5 my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Demande de Rendez-vous Envoyée !
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Votre demande a été transmise au secrétariat médical d'OSIRIX. Vous recevrez une notification
            dès confirmation de votre créneau.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-medium">
          <div className="flex justify-between text-slate-600">
            <span>Spécialité :</span>
            <strong className="text-slate-900">{activeSpecialty?.name}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Praticien :</span>
            <strong className="text-[#0a6b63]">Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Date & Heure :</span>
            <strong className="text-slate-900">{selectedDate} à {selectedTime}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Statut :</span>
            <span className="text-amber-700 font-bold">En attente de validation secrétariat</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onSuccess}
            className="px-6 py-2.5 rounded-xl bg-[#0a6b63] hover:bg-[#075952] text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Voir mes rendez-vous
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Prendre un Rendez-vous Médical
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Réservation en ligne en 4 étapes simples · Confirmation sous 2 heures par le secrétariat.
        </p>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-[10px] font-bold uppercase tracking-wider">
          <div className={`p-1.5 rounded-lg ${step >= 1 ? 'bg-teal-50 text-[#0a6b63] border border-teal-200' : 'text-slate-400'}`}>
            1. Spécialité
          </div>
          <div className={`p-1.5 rounded-lg ${step >= 2 ? 'bg-teal-50 text-[#0a6b63] border border-teal-200' : 'text-slate-400'}`}>
            2. Médecin
          </div>
          <div className={`p-1.5 rounded-lg ${step >= 3 ? 'bg-teal-50 text-[#0a6b63] border border-teal-200' : 'text-slate-400'}`}>
            3. Date & Heure
          </div>
          <div className={`p-1.5 rounded-lg ${step >= 4 ? 'bg-teal-50 text-[#0a6b63] border border-teal-200' : 'text-slate-400'}`}>
            4. Motif
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Choisir la Spécialité */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Étape 1 : Choisissez le Pôle ou la Spécialité</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => handleSpecialtySelect(spec.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedSpecialtyId === spec.id
                    ? 'border-[#0a6b63] bg-teal-50/60 ring-1 ring-[#0a6b63]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{spec.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{spec.description}</p>
                </div>
                <span className="text-[10px] font-bold text-[#0a6b63] flex items-center gap-1">
                  Choisir ce pôle <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Sélectionner le Médecin */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Étape 2 : Choisissez votre Médecin</h3>
              <p className="text-xs text-slate-500">Pôle : {activeSpecialty?.name}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-[#0a6b63] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Changer spécialité
            </button>
          </div>

          <div className="space-y-3">
            {availableDoctors.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-6 text-center">
                Aucun praticien n'est actuellement disponible dans ce pôle.
              </p>
            ) : (
              availableDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDoctorSelect(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDoctorId === doc.id
                      ? 'border-[#0a6b63] bg-teal-50/60 ring-1 ring-[#0a6b63]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={doc.photoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Dr. {doc.firstName} {doc.lastName}
                      </h4>
                      <p className="text-xs text-slate-500">{doc.room}</p>
                      <div className="text-[10px] font-mono text-teal-800 mt-0.5">
                        Consultations : {doc.consultationHours.start} — {doc.consultationHours.end}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Step 3: Date & Créneau */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Étape 3 : Date & Créneau Horaire</h3>
              <p className="text-xs text-slate-500">
                Avec Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-[#0a6b63] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Changer médecin
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date souhaitée</label>
              <input
                type="date"
                value={selectedDate}
                min="2026-11-08"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Sélectionnez une heure de passage :
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {hoursList.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedTime === time
                        ? 'bg-[#0a6b63] text-white border-[#0a6b63] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-xl bg-[#0a6b63] hover:bg-[#075952] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Étape suivante : Motif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Motif & Confirmation finale */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Étape 4 : Motif & Confirmation</h3>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-[#0a6b63] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Modifier date
            </button>
          </div>

          {/* Recap Box */}
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Spécialité :</span>
              <strong>{activeSpecialty?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Médecin :</span>
              <strong className="text-[#0a6b63]">Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Date & Créneau :</span>
              <strong>{selectedDate} à {selectedTime}</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block font-semibold text-slate-700">
              Précisez le motif de votre consultation *
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Douleurs thoraciques intermittentes, suivi d'hypertension, renouvellement d'ordonnance, bilan de santé..."
              className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Retour
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Confirmer & Envoyer la demande</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
