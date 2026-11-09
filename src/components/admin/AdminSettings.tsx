import React, { useState } from 'react';
import { useStore } from '../../services/store';
import {
  Settings,
  Building,
  ShieldCheck,
  RotateCcw,
  Clock,
  Phone,
  Mail,
  Save,
  Check,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { resetDatabase } = useStore();

  const [clinicData, setClinicData] = useState({
    name: 'Clinique Vitalia',
    agrement: 'N° 2024/MSHPC/CAB — Ministère de la Santé CI',
    address: 'Boulevard Mitterrand',
    city: 'Abidjan',
    phone: '+225 27 22 00 11 22',
    email: 'contact@clinique-vitalia.ci',
    urgences: '+225 07 00 11 22 33',
    slotDuration: '30',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (resetConfirm) {
      resetDatabase();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#101513] tracking-tight">
          Paramètres Généraux de la Clinique
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configuration des coordonnées d'établissement, règles de réservation et conformité des données médicales.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-slate-100 text-slate-800 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-slate-300">
          <Check className="w-4 h-4 text-slate-700" />
          <span>Paramètres de la clinique mis à jour avec succès !</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-sm text-slate-900">Coordonnées Officielles & Entité Juridique</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Dénomination de la clinique</label>
            <input
              type="text"
              value={clinicData.name}
              onChange={(e) => setClinicData({ ...clinicData, name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">N° d'Agrément Sanitaire</label>
            <input
              type="text"
              value={clinicData.agrement}
              onChange={(e) => setClinicData({ ...clinicData, agrement: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Adresse physique</label>
            <input
              type="text"
              value={clinicData.address}
              onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ville</label>
            <input
              type="text"
              value={clinicData.city}
              onChange={(e) => setClinicData({ ...clinicData, city: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard téléphonique</label>
            <input
              type="text"
              value={clinicData.phone}
              onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ligne Urgences 24/7</label>
            <input
              type="text"
              value={clinicData.urgences}
              onChange={(e) => setClinicData({ ...clinicData, urgences: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-rose-700 font-bold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">E-mail institutionnel</label>
            <input
              type="email"
              value={clinicData.email}
              onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Scheduling Rules */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h4 className="font-bold text-slate-900">Règles de Planification Clinique</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-100 space-y-1">
              <span className="font-semibold text-slate-800 block">Prévention des doubles réservations</span>
              <p className="text-[11px] text-slate-500">
                Verrouillage automatique pour interdire deux patients simultanés sur le même créneau praticien.
              </p>
              <span className="text-[10px] font-bold text-slate-700 uppercase block mt-1">
                ✓ Actif & Enforcé
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 space-y-1">
              <span className="font-semibold text-slate-800 block">Délai de notification patient</span>
              <p className="text-[11px] text-slate-500">
                Envoi automatique d'une confirmation de RDV et notification push lors de la validation.
              </p>
              <span className="text-[10px] font-bold text-slate-700 uppercase block mt-1">
                ✓ Temps réel
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>
      </form>

      {/* Database Maintenance & Reset */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Maintenance de la Base de Démonstration</span>
        </h3>
        <p className="text-slate-500 leading-relaxed">
          Pour les démonstrations et tests, vous pouvez restaurer à tout moment le jeu de données initial
          (médecins, patients, ordonnances, résultats d'examens).
        </p>

        <button
          onClick={handleResetData}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            resetConfirm
              ? 'bg-rose-600 text-white shadow-md'
              : 'border border-rose-300 text-rose-700 hover:bg-rose-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetConfirm ? 'Confirmer la réinitialisation complète ?' : 'Réinitialiser la base de données démo'}</span>
        </button>
      </div>
    </div>
  );
};
