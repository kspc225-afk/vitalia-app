import React, { useState } from 'react';
import { useStore } from '../../services/store';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Bell,
  Lock,
  HeartPulse,
  AlertCircle,
  FileText,
  KeyRound,
  Check,
  Edit2,
  Save,
} from 'lucide-react';

export const PatientProfile: React.FC = () => {
  const { currentUser, patients, doctors, updatePatient } = useStore();

  const currentPatient =
    patients.find((p) => p.userId === currentUser.id) ||
    patients.find((p) => p.id === 'pat-1') ||
    patients[0];

  const assignedDoctor = doctors.find((d) => d.id === currentPatient.assignedDoctorId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: currentPatient.phone,
    email: currentPatient.email,
    address: currentPatient.address,
    city: currentPatient.city,
    emergencyName: currentPatient.emergencyContact.name,
    emergencyPhone: currentPatient.emergencyContact.phone,
    emergencyRel: currentPatient.emergencyContact.relationship,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    sms: true,
    email: true,
    results: true,
    reminders: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(currentPatient.id, {
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRel,
      },
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#00796F] text-white font-bold text-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {currentPatient.avatar ? (
                <img
                  src={currentPatient.avatar}
                  alt={currentPatient.firstName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                `${currentPatient.firstName.charAt(0)}${currentPatient.lastName.charAt(0)}`
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#101513]">
                  {currentPatient.firstName} {currentPatient.lastName}
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5EF] text-[#00796F]">
                  {currentPatient.patientCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inscrit le {currentPatient.registeredAt} · Dossier individuel certifié
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Annuler' : 'Modifier mes infos'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-[#E8F5EF] text-[#00796F] rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Coordonnées mises à jour avec succès !</span>
          </div>
        )}

        {/* Medical Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-[#F3F5F4]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Groupe Sanguin</span>
            <span className="font-mono font-extrabold text-[#00796F] text-base">
              {currentPatient.bloodGroup || 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F3F5F4]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Date de Naissance</span>
            <span className="font-semibold text-slate-800 text-xs">
              {currentPatient.birthDate}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F3F5F4]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Médecin Référent</span>
            <span className="font-bold text-[#073D38] text-xs truncate block">
              {assignedDoctor ? `Dr. ${assignedDoctor.lastName}` : 'Attribution en cours'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F3F5F4]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sexe Biologique</span>
            <span className="font-semibold text-slate-800 text-xs">
              {currentPatient.gender === 'M' ? 'Masculin' : 'Féminin'}
            </span>
          </div>
        </div>
      </div>

      {/* Allergies & Conditions */}
      {currentPatient.allergies && currentPatient.allergies.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Facteurs de Vigilance & Allergies
            </h4>
            <p className="text-xs text-rose-600 font-semibold">
              Allergies déclarées : {currentPatient.allergies.join(', ')}
            </p>
            {currentPatient.chronicDiseases && currentPatient.chronicDiseases.length > 0 && (
              <p className="text-[11px] text-slate-500">
                Suivi au long cours : {currentPatient.chronicDiseases.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contact & Personal details */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#101513] flex items-center gap-2">
          <User className="w-4 h-4 text-[#00796F]" />
          <span>Coordonnées & Contact d'Urgence</span>
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse de résidence</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F3F5F4] space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                Personne à contacter en cas d'urgence
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="Nom & prénom"
                  className="p-2 border border-slate-300 rounded-xl bg-white text-xs"
                />
                <input
                  type="text"
                  value={formData.emergencyRel}
                  onChange={(e) => setFormData({ ...formData, emergencyRel: e.target.value })}
                  placeholder="Lien (ex: Épouse)"
                  className="p-2 border border-slate-300 rounded-xl bg-white text-xs"
                />
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="Téléphone urgence"
                  className="p-2 border border-slate-300 rounded-xl bg-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00796F] hover:bg-[#073D38] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer les coordonnées</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-[#00796F]" />
                <span className="font-mono">{currentPatient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-[#00796F]" />
                <span>{currentPatient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-[#00796F]" />
                <span>{currentPatient.address}, {currentPatient.city}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F3F5F4] space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-400 block">
                Contact d'Urgence Désigné
              </span>
              <p className="font-bold text-[#101513]">
                {currentPatient.emergencyContact.name}{' '}
                <span className="font-normal text-slate-500">
                  ({currentPatient.emergencyContact.relationship})
                </span>
              </p>
              <p className="font-mono text-slate-600 text-xs">
                {currentPatient.emergencyContact.phone}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#101513] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00796F]" />
          <span>Préférences de Notification</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F5F4] cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Rappels de rendez-vous par SMS</span>
              <span className="text-[11px] text-slate-500">Alerte 24h avant chaque consultation</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled.sms}
              onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, sms: e.target.checked })}
              className="accent-[#00796F] w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F5F4] cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Publication de nouveaux résultats</span>
              <span className="text-[11px] text-slate-500">Notification dès validation par votre biologiste</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled.results}
              onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, results: e.target.checked })}
              className="accent-[#00796F] w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Security & Confidentiality */}
      <div className="bg-[#073D38] text-white rounded-3xl p-6 shadow-md space-y-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#F5A900]" />
          <h4 className="font-bold text-sm">Protection des Données de Santé OSIRIX</h4>
        </div>
        <p className="text-teal-100 text-[11px] leading-relaxed">
          Vos informations médicales, examens et ordonnances sont chiffrés et réservés exclusivement
          à votre médecin traitant et aux équipes de soins autorisées de la clinique OSIRIX.
        </p>
      </div>
    </div>
  );
};
