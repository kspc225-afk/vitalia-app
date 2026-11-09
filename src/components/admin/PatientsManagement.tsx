import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { Patient } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Pill,
  Microscope,
  Clock,
  Edit2,
  Stethoscope,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const PatientsManagement: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    consultations,
    prescriptions,
    exams,
    addPatient,
    updatePatient,
    assignPatientToDoctor,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');
  const [selectedBloodFilter, setSelectedBloodFilter] = useState('all');

  // Selected patient for detail dossier view
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients[0]?.id || null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  // Add Patient Form State
  const [newPatientData, setNewPatientData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '1990-01-01',
    gender: 'M' as 'M' | 'F',
    phone: '',
    email: '',
    address: '',
    city: 'Abidjan',
    emergencyContactName: '',
    emergencyContactRel: 'Conjoint(e)',
    emergencyContactPhone: '',
    bloodGroup: 'O+',
    allergies: '',
    chronicDiseases: '',
    assignedDoctorId: '',
  });

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      `${p.firstName} ${p.lastName} ${p.patientCode} ${p.phone} ${p.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesDoctor =
      selectedDoctorFilter === 'all' || p.assignedDoctorId === selectedDoctorFilter;
    const matchesBlood =
      selectedBloodFilter === 'all' || p.bloodGroup === selectedBloodFilter;
    return matchesSearch && matchesDoctor && matchesBlood;
  });

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Active patient related clinical data
  const patientAppointments = appointments.filter((a) => a.patientId === activePatient?.id);
  const patientConsultations = consultations.filter((c) => c.patientId === activePatient?.id);
  const patientPrescriptions = prescriptions.filter((pr) => pr.patientId === activePatient?.id);
  const patientExams = exams.filter((e) => e.patientId === activePatient?.id);
  const assignedDoctor = doctors.find((d) => d.id === activePatient?.assignedDoctorId);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.phone) return;

    const created = addPatient({
      userId: '',
      firstName: newPatientData.firstName,
      lastName: newPatientData.lastName,
      birthDate: newPatientData.birthDate,
      gender: newPatientData.gender,
      phone: newPatientData.phone,
      email: newPatientData.email || `${newPatientData.firstName.toLowerCase()}.${newPatientData.lastName.toLowerCase()}@vitalia-patient.ci`,
      address: newPatientData.address,
      city: newPatientData.city,
      emergencyContact: {
        name: newPatientData.emergencyContactName || 'Non renseigné',
        relationship: newPatientData.emergencyContactRel || 'Proche',
        phone: newPatientData.emergencyContactPhone || newPatientData.phone,
      },
      bloodGroup: newPatientData.bloodGroup,
      allergies: newPatientData.allergies ? newPatientData.allergies.split(',').map((s) => s.trim()) : [],
      chronicDiseases: newPatientData.chronicDiseases ? newPatientData.chronicDiseases.split(',').map((s) => s.trim()) : [],
      assignedDoctorId: newPatientData.assignedDoctorId || undefined,
    });

    if (newPatientData.assignedDoctorId) {
      assignPatientToDoctor(created.id, newPatientData.assignedDoctorId, 'Attribution lors de la création du dossier');
    }

    setSelectedPatientId(created.id);
    setIsAddModalOpen(false);
    // Reset form
    setNewPatientData({
      firstName: '',
      lastName: '',
      birthDate: '1990-01-01',
      gender: 'M',
      phone: '',
      email: '',
      address: '',
      city: 'Abidjan',
      emergencyContactName: '',
      emergencyContactRel: 'Conjoint(e)',
      emergencyContactPhone: '',
      bloodGroup: 'O+',
      allergies: '',
      chronicDiseases: '',
      assignedDoctorId: '',
    });
  };

  const handleOpenEdit = (p: Patient) => {
    setPatientToEdit(p);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientToEdit) return;
    updatePatient(patientToEdit.id, patientToEdit);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestion des Patients & Dossiers Médicaux
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossier individuel unique, antécédents, historique des rendez-vous et coordination des soins.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Patient</span>
        </button>
      </div>

      {/* Main Split: Left Column (List & Filters) | Right Column (Detailed Individual Dossier) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Patient List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, code PT, téléphone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <select
                  value={selectedDoctorFilter}
                  onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                  className="w-full text-xs bg-white py-1.5 px-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="all">Tous les médecins</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-32">
                <select
                  value={selectedBloodFilter}
                  onChange={(e) => setSelectedBloodFilter(e.target.value)}
                  className="w-full text-xs bg-white py-1.5 px-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="all">Groupe S.</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucun patient ne correspond aux critères de recherche.
              </div>
            ) : (
              filteredPatients.map((pat) => {
                const isSelected = pat.id === activePatient?.id;
                const doc = doctors.find((d) => d.id === pat.assignedDoctorId);
                return (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatientId(pat.id)}
                    className={`p-4 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-slate-100 border-l-4 border-l-slate-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {pat.avatar ? (
                          <img
                            src={pat.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          `${pat.firstName.charAt(0)}${pat.lastName.charAt(0)}`
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {pat.firstName} {pat.lastName}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-500 font-medium">
                            {pat.patientCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Tél : <span className="font-mono">{pat.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">
                          {doc ? `Dr. ${doc.firstName} ${doc.lastName}` : 'Aucun médecin attribué'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {pat.bloodGroup && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {pat.bloodGroup}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Active Patient Individual Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activePatient ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {/* Dossier Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {activePatient.avatar ? (
                      <img
                        src={activePatient.avatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      `${activePatient.firstName.charAt(0)}${activePatient.lastName.charAt(0)}`
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-slate-900">
                        {activePatient.firstName} {activePatient.lastName}
                      </h3>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {activePatient.patientCode}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Sexe : {activePatient.gender === 'M' ? 'Masculin' : 'Féminin'}</span>
                      <span>·</span>
                      <span>
                        Né(e) le{' '}
                        {new Date(activePatient.birthDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-slate-700">
                        Gr. Sanguin : {activePatient.bloodGroup || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(activePatient)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>
              </div>

              {/* Dossier Information Tabs / Body */}
              <div className="p-6 space-y-6">
                {/* Contact & Emergency info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                      Coordonnées Personnelles
                    </span>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{activePatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activePatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activePatient.address}, {activePatient.city}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                      Contact d'Urgence & Médecin Attribué
                    </span>
                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {activePatient.emergencyContact.name}
                      </span>{' '}
                      ({activePatient.emergencyContact.relationship}) :{' '}
                      <span className="font-mono">{activePatient.emergencyContact.phone}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                      <div className="text-slate-600">
                        Médecin référent :{' '}
                        <strong className="text-slate-900">
                          {assignedDoctor
                            ? `Dr. ${assignedDoctor.firstName} ${assignedDoctor.lastName}`
                            : 'Non attribué'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Alerts (Allergies & Pathologies) */}
                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Profil Médical & Facteurs de Vigilance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-amber-800">
                    <div>
                      <strong>Allergies signalées :</strong>{' '}
                      {activePatient.allergies && activePatient.allergies.length > 0 ? (
                        <span className="font-semibold text-rose-700">
                          {activePatient.allergies.join(', ')}
                        </span>
                      ) : (
                        'Aucune allergie connue'
                      )}
                    </div>
                    <div>
                      <strong>Affections chroniques :</strong>{' '}
                      {activePatient.chronicDiseases && activePatient.chronicDiseases.length > 0 ? (
                        <span className="font-semibold">
                          {activePatient.chronicDiseases.join(', ')}
                        </span>
                      ) : (
                        'Aucune affection déclarée'
                      )}
                    </div>
                  </div>
                </div>

                {/* Historique Médical Chronologique */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    Historique Médical & Traçabilité des Soins
                  </h4>

                  {/* Consultations */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-700" />
                      <span>Consultations Réalisées ({patientConsultations.length})</span>
                    </span>

                    {patientConsultations.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucune consultation clôturée.</p>
                    ) : (
                      patientConsultations.map((cs) => (
                        <div
                          key={cs.id}
                          className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {cs.code} — {cs.specialtyName}
                            </span>
                            <span className="text-slate-500 font-mono">
                              {cs.date} à {cs.time}
                            </span>
                          </div>
                          <p className="text-slate-700">
                            <strong>Diagnostic :</strong> {cs.diagnosis}
                          </p>
                          <p className="text-slate-600 text-[11px]">
                            <strong>Traitement :</strong> {cs.treatment}
                          </p>
                          <div className="text-[10px] text-slate-400">
                            Praticien : {cs.doctorName}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Résultats d'analyses */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Microscope className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Examens de Laboratoire & Imagerie ({patientExams.length})</span>
                    </span>

                    {patientExams.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucun examen enregistré.</p>
                    ) : (
                      patientExams.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{ex.examType}</div>
                            <div className="text-[11px] text-slate-500">
                              Prescrit par {ex.prescribingDoctorName} le{' '}
                              {new Date(ex.requestedAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <StatusBadge status={ex.status} size="sm" />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Historique Rendez-vous */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-700" />
                      <span>Historique des Rendez-vous ({patientAppointments.length})</span>
                    </span>

                    {patientAppointments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucun rendez-vous consigné.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {patientAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500">{apt.date} {apt.time}</span>
                              <span className="text-slate-800 font-medium">({apt.doctorName})</span>
                            </div>
                            <StatusBadge status={apt.status} size="sm" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
              Sélectionnez un patient dans la colonne de gauche pour afficher son dossier complet.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Patient */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Création d'un Nouveau Dossier Patient"
        subtitle="Enregistrement administratif et attribution de l'identifiant clinique unique"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={newPatientData.firstName}
                onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Ex: Jean-Marc"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom de famille *</label>
              <input
                type="text"
                required
                value={newPatientData.lastName}
                onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Ex: Koffi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date de naissance *</label>
              <input
                type="date"
                required
                value={newPatientData.birthDate}
                onChange={(e) => setNewPatientData({ ...newPatientData, birthDate: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sexe</label>
              <select
                value={newPatientData.gender}
                onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value as 'M' | 'F' })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Groupe Sanguin</label>
              <select
                value={newPatientData.bloodGroup}
                onChange={(e) => setNewPatientData({ ...newPatientData, bloodGroup: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="O+">O Rh D positif (O+)</option>
                <option value="A+">A Rh D positif (A+)</option>
                <option value="B+">B Rh D positif (B+)</option>
                <option value="AB+">AB Rh D positif (AB+)</option>
                <option value="O-">O Rh D négatif (O-)</option>
                <option value="A-">A Rh D négatif (A-)</option>
                <option value="B-">B Rh D négatif (B-)</option>
                <option value="AB-">AB Rh D négatif (AB-)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                value={newPatientData.phone}
                onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="+225 07 00 00 00 00"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Adresse E-mail</label>
              <input
                type="email"
                value={newPatientData.email}
                onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="patient@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Adresse de résidence</label>
              <input
                type="text"
                value={newPatientData.address}
                onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Cocody Angré 8ème Tranche"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                value={newPatientData.city}
                onChange={(e) => setNewPatientData({ ...newPatientData, city: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Abidjan"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Contact en cas d'urgence
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={newPatientData.emergencyContactName}
                  onChange={(e) => setNewPatientData({ ...newPatientData, emergencyContactName: e.target.value })}
                  placeholder="Nom & prénom"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newPatientData.emergencyContactRel}
                  onChange={(e) => setNewPatientData({ ...newPatientData, emergencyContactRel: e.target.value })}
                  placeholder="Lien de parenté (ex: Épouse)"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={newPatientData.emergencyContactPhone}
                  onChange={(e) => setNewPatientData({ ...newPatientData, emergencyContactPhone: e.target.value })}
                  placeholder="Numéro téléphone"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allergies connues (séparées par une virgule)
              </label>
              <input
                type="text"
                value={newPatientData.allergies}
                onChange={(e) => setNewPatientData({ ...newPatientData, allergies: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                placeholder="Pénicilline, Arachides..."
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Médecin référent initial
              </label>
              <select
                value={newPatientData.assignedDoctorId}
                onChange={(e) => setNewPatientData({ ...newPatientData, assignedDoctorId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="">Sélectionner un médecin (Optionnel)</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.specialtyName})
                  </option>
                ))}
              </select>
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
              Créer le dossier patient
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Patient */}
      {patientToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Modifier les informations : ${patientToEdit.firstName} ${patientToEdit.lastName}`}
          subtitle={`Dossier N° ${patientToEdit.patientCode}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={patientToEdit.phone}
                  onChange={(e) => setPatientToEdit({ ...patientToEdit, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={patientToEdit.email}
                  onChange={(e) => setPatientToEdit({ ...patientToEdit, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={patientToEdit.address}
                  onChange={(e) => setPatientToEdit({ ...patientToEdit, address: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={patientToEdit.city}
                  onChange={(e) => setPatientToEdit({ ...patientToEdit, city: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Médecin Référent</label>
              <select
                value={patientToEdit.assignedDoctorId || ''}
                onChange={(e) => setPatientToEdit({ ...patientToEdit, assignedDoctorId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="">Non attribué</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.specialtyName})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
