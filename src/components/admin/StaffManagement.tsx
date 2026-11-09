import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { StaffMember, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { Users, Plus, Shield, Phone, Mail, Building, CheckCircle2, XCircle } from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { staff, addStaff, toggleStaffActive } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: 'secretary' as UserRole,
    roleTitle: 'Secrétaire Médicale',
    department: 'Accueil & Admissions',
    phone: '+225 ',
    email: '',
    matricule: 'STF-OSX-',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffData.name || !newStaffData.email) return;

    addStaff({
      userId: `user-stf-${Date.now()}`,
      name: newStaffData.name,
      role: newStaffData.role,
      roleTitle: newStaffData.roleTitle,
      department: newStaffData.department,
      phone: newStaffData.phone,
      email: newStaffData.email,
      matricule: newStaffData.matricule || `STF-OSX-${Math.floor(100 + Math.random() * 900)}`,
      isActive: true,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Personnel Hospitalier & Comptes d'Accès
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administration des comptes pour le secrétariat, l'équipe de laboratoire et les cadres cliniques.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Collaborateur</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className={`bg-white rounded-xl border shadow-2xs p-5 flex flex-col justify-between transition-all ${
              member.isActive ? 'border-slate-200/80 hover:border-slate-400' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{member.name}</h3>
                  <div className="text-xs font-semibold text-slate-700 truncate">
                    {member.roleTitle}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {member.matricule}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span
                className={`font-semibold text-[11px] ${
                  member.isActive ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {member.isActive ? 'Compte Actif' : 'Accès Révoqué'}
              </span>

              <button
                onClick={() => toggleStaffActive(member.id)}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  member.isActive
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-slate-800 text-white hover:bg-slate-900'
                }`}
              >
                {member.isActive ? 'Suspendre' : 'Réactiver'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Staff */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un Membre du Personnel"
        subtitle="Création des identifiants et assignation des privilèges hospitaliers"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={newStaffData.name}
              onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              placeholder="Ex: Christian Kouamé"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rôle Système *</label>
              <select
                value={newStaffData.role}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  let title = 'Secrétaire Médicale';
                  let dept = 'Accueil & Admissions';
                  if (role === 'admin') {
                    title = 'Administrateur Adjoint';
                    dept = 'Direction Générale';
                  } else if (role === 'lab') {
                    title = 'Technicien de Laboratoire';
                    dept = 'Laboratoire d’Analyses';
                  }
                  setNewStaffData({ ...newStaffData, role, roleTitle: title, department: dept });
                }}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="secretary">Secrétaire Médicale</option>
                <option value="lab">Laboratoire / Biologie</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Matricule</label>
              <input
                type="text"
                value={newStaffData.matricule}
                onChange={(e) => setNewStaffData({ ...newStaffData, matricule: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Titre de fonction</label>
            <input
              type="text"
              value={newStaffData.roleTitle}
              onChange={(e) => setNewStaffData({ ...newStaffData, roleTitle: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">E-mail professionnel *</label>
              <input
                type="email"
                required
                value={newStaffData.email}
                onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="nom@clinique-vitalia.ci"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newStaffData.phone}
                onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Enregistrer le collaborateur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
