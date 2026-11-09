import React from 'react';
import { Modal } from './Modal';
import { useStore } from '../../services/store';
import { UserRole } from '../../types';
import {
  Users,
  ShieldCheck,
  Building2,
  Stethoscope,
  Microscope,
  CalendarCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { OsirixLogo } from './OsirixLogo';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, switchUser, currentUser } = useStore();

  const demoAccounts = [
    {
      role: 'admin' as UserRole,
      title: 'Administrateur Général & Directeur Médical',
      name: 'Dr. Amadou Touré',
      email: 'admin@clinique-vitalia.ci',
      icon: Building2,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Gestion globale : vue d’ensemble des statistiques en direct, gestion des médecins, spécialités, personnel, calendrier hospitalier et journal d’audit.',
    },
    {
      role: 'secretary' as UserRole,
      title: 'Secrétariat Médical & Accueil',
      name: 'Mariam Coulibaly',
      email: 'secretariat@clinique-vitalia.ci',
      icon: Users,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Admissions : enregistrement des patients, attribution à un médecin, confirmation des demandes en attente, pointage des arrivées en salle d’attente.',
    },
    {
      role: 'doctor' as UserRole,
      title: 'Médecin Praticien (Cardiologie)',
      name: 'Dr. Estelle Yao',
      email: 'dr.yao@clinique-vitalia.ci',
      icon: Stethoscope,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Cockpit consultation : planning personnel, accès aux dossiers patients attribués, rédaction de comptes rendus, prescription d’ordonnances certifiées et d’examens.',
    },
    {
      role: 'lab' as UserRole,
      title: 'Laboratoire d’Analyses Médicales',
      name: 'Ibrahim Diop',
      email: 'labo@clinique-vitalia.ci',
      icon: Microscope,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Biologie & Imagerie : réception des examens prescrits, saisie des résultats biologiques, soumission pour validation et publication patient.',
    },
    {
      role: 'patient' as UserRole,
      title: 'Patient (Suivi Cardiovasculaire)',
      name: 'Koffi Jean-Marc (PT-2026-001)',
      email: 'koffi.jeanmarc@gmail.com',
      icon: CalendarCheck,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Espace personnel responsive : réservation de consultation en ligne, suivi des rendez-vous, accès sécurisé aux résultats d’analyses publiés, ordonnances téléchargeables.',
    },
  ];

  const handleSelect = (r: UserRole) => {
    switchRole(r);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plateforme Clinique Vitalia — Guide V1"
      subtitle="Architecture centralisée, comptes de démonstration et flux inter-espaces"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-slate-600">
        {/* Banner with clinic hero */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="space-y-1.5 max-w-md z-10">
            <OsirixLogo size="md" whiteVariant={true} />
            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              Plateforme hospitalière numérique connectant en temps réel l'administration, le corps
              médical, les laboratoires et les patients.
            </p>
          </div>
          <img
            src="/assets/aistudio/image_6b2d37ad.png"
            alt="Personnel Médical Clinique Vitalia"
            className="w-24 h-24 rounded-full object-cover border-2 border-white/30 shrink-0 shadow-lg"
          />
        </div>

        {/* Demo Roles Grid */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <span>Sélectionnez un rôle pour tester son interface dédiée :</span>
          </h4>

          <div className="space-y-2">
            {demoAccounts.map((acc) => {
              const isSelected = currentUser.role === acc.role;
              const Icon = acc.icon;
              return (
                <div
                  key={acc.role}
                  onClick={() => handleSelect(acc.role)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-slate-800 bg-slate-100/90 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${acc.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{acc.title}</span>
                      {isSelected ? (
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" /> Actif
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5 hover:text-slate-700">
                          Basculez <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-slate-800 text-[11px] mt-0.5">{acc.name}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flow explanation */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Cycle de vie d'une prise en charge médicale (Exemple concret) :</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
            <li>
              <strong>Patient (Koffi)</strong> prend un rendez-vous en ligne en Cardiologie.
            </li>
            <li>
              <strong>Secrétariat (Mariam)</strong> reçoit la demande en attente, vérifie la
              disponibilité et la confirme.
            </li>
            <li>
              <strong>Médecin (Dr. Yao)</strong> reçoit le rendez-vous dans son planning, démarre la
              consultation, enregistre les constantes (Tension, Pouls), rédige l'ordonnance et prescrit
              un examen.
            </li>
            <li>
              <strong>Laboratoire (Ibrahim)</strong> saisit les résultats de l'examen et les transmet.
            </li>
            <li>
              <strong>Dr. Yao / Médecin</strong> valide les résultats et les publie.
            </li>
            <li>
              <strong>Patient (Koffi)</strong> reçoit une notification en direct, consulte son compte
              rendu et télécharge son ordonnance certifiée !
            </li>
          </ol>
        </div>

        {/* Security & Regulatory Notice */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Conformité Réglementaire & Sécurité :</strong>
            <p className="text-amber-800 mt-0.5">
              Toutes les données présentées sont des données de démonstration identifiées.
              L'architecture respecte la séparation stricte des rôles et l'accès cloisonné aux dossiers
              médicaux avant le déploiement en production en Côte d'Ivoire.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
