import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Specialty } from '../../types';
import { Modal } from '../common/Modal';
import {
  Layers,
  Plus,
  Stethoscope,
  HeartPulse,
  Baby,
  ShieldAlert,
  Edit2,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';

export const SpecialtiesManagement: React.FC = () => {
  const { specialties, doctors, addSpecialty, updateSpecialty, toggleSpecialtyActive } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    iconName: 'Stethoscope',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    addSpecialty({
      name: formData.name,
      code: formData.code.toUpperCase(),
      description: formData.description,
      iconName: formData.iconName,
      isActive: true,
    });

    setIsAddModalOpen(false);
    setFormData({ name: '', code: '', description: '', iconName: 'Stethoscope' });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;
    updateSpecialty(editingSpecialty.id, editingSpecialty);
    setEditingSpecialty(null);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-amber-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-purple-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pôles & Spécialités Médicales
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisation des services cliniques, rattachement des praticiens et activation des filières de soins.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Spécialité</span>
        </button>
      </div>

      {/* Grid of specialties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialties.map((spec) => {
          const associatedDoctors = doctors.filter((d) => d.specialtyId === spec.id);
          return (
            <div
              key={spec.id}
              className={`bg-white rounded-xl border shadow-2xs p-5 space-y-4 flex flex-col justify-between transition-all ${
                spec.isActive
                  ? 'border-slate-200/80 hover:border-slate-400'
                  : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      {getIcon(spec.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{spec.name}</h3>
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        Code : {spec.code}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingSpecialty(spec)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{spec.description}</p>

                {/* Associated Doctors */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-700" />
                    <span>Praticiens rattachés ({associatedDoctors.length})</span>
                  </span>

                  {associatedDoctors.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Aucun praticien rattaché.</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {associatedDoctors.map((doc) => (
                        <span
                          key={doc.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Dr. {doc.firstName} {doc.lastName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Toggle */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Statut :{' '}
                  <strong className={spec.isActive ? 'text-slate-800' : 'text-slate-500'}>
                    {spec.isActive ? 'Service ouvert aux réservations' : 'Service suspendu'}
                  </strong>
                </span>

                <button
                  onClick={() => toggleSpecialtyActive(spec.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    spec.isActive
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {spec.isActive ? 'Suspendre' : 'Réactiver'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Specialty */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Créer un Pôle ou une Spécialité"
        subtitle="Ouverture d'un nouveau département de soins au sein de la clinique"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nom de la spécialité *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              placeholder="Ex: Neurologie & Neurochirurgie"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Code Service *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                placeholder="NEURO"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Icône</label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Stethoscope">Stéthoscope (Général)</option>
                <option value="HeartPulse">Cœur (Cardiologie)</option>
                <option value="Baby">Enfant (Pédiatrie)</option>
                <option value="ShieldAlert">Bouclier (Spécialités)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description clinique</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              placeholder="Prise en charge spécialisée..."
            />
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
              Créer la spécialité
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Specialty */}
      {editingSpecialty && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSpecialty(null)}
          title={`Modifier la spécialité : ${editingSpecialty.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom</label>
              <input
                type="text"
                value={editingSpecialty.name}
                onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingSpecialty.description}
                onChange={(e) => setEditingSpecialty({ ...editingSpecialty, description: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingSpecialty(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
