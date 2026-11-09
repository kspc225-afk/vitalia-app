import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Doctor,
  Patient,
  Specialty,
  Appointment,
  AppointmentStatus,
  Consultation,
  Prescription,
  MedicalExam,
  ExamStatus,
  Notification,
  AuditLog,
  StaffMember,
  Message,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SPECIALTIES,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_STAFF,
  INITIAL_APPOINTMENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_EXAMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MESSAGES,
} from '../data/initialData';

interface StoreContextType {
  currentUser: User;
  users: User[];
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  staff: StaffMember[];
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  exams: MedicalExam[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  messages: Message[];

  // Auth / Role management
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string) => boolean;

  // Specialties
  addSpecialty: (specialty: Omit<Specialty, 'id' | 'doctorCount'>) => void;
  updateSpecialty: (id: string, specialty: Partial<Specialty>) => void;
  toggleSpecialtyActive: (id: string) => void;

  // Doctors
  addDoctor: (doctor: Omit<Doctor, 'id' | 'assignedPatientsCount'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  toggleDoctorActive: (id: string) => void;

  // Patients
  addPatient: (patient: Omit<Patient, 'id' | 'patientCode' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  assignPatientToDoctor: (patientId: string, doctorId: string, notes?: string) => void;

  // Staff
  addStaff: (member: Omit<StaffMember, 'id' | 'joinedAt'>) => void;
  updateStaff: (id: string, member: Partial<StaffMember>) => void;
  toggleStaffActive: (id: string) => void;

  // Appointments
  createAppointment: (data: {
    patientId: string;
    doctorId: string;
    specialtyId: string;
    date: string;
    time: string;
    durationMinutes?: number;
    reason: string;
    notes?: string;
  }) => { success: boolean; message?: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string, notes?: string) => { success: boolean; message?: string };
  assignDoctorToAppointment: (appointmentId: string, doctorId: string) => void;

  // Consultations & Prescriptions
  createConsultation: (consultationData: Omit<Consultation, 'id' | 'code' | 'createdAt'>, prescriptionData?: Omit<Prescription, 'id' | 'code'>) => Consultation;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'code'>) => Prescription;

  // Medical Exams
  createExam: (exam: Omit<MedicalExam, 'id' | 'code' | 'requestedAt' | 'status'>) => MedicalExam;
  updateExamStatus: (id: string, status: ExamStatus, updates?: Partial<MedicalExam>) => void;
  publishExamResult: (id: string) => void;

  // Messages & Notifications
  sendMessage: (receiverId: string, patientId: string, content: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Audit Logs
  logAction: (action: string, entity: AuditLog['entity'], details: string) => void;

  // Reset
  resetDatabase: () => void;
}

const STORAGE_KEY = 'vitalia_medical_store_v1';

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state or fallback to initial data
  const loadInitial = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
    return {
      currentUser: INITIAL_USERS[0], // Dr. Amadou Touré (Admin)
      users: INITIAL_USERS,
      specialties: INITIAL_SPECIALTIES,
      doctors: INITIAL_DOCTORS,
      patients: INITIAL_PATIENTS,
      staff: INITIAL_STAFF,
      appointments: INITIAL_APPOINTMENTS,
      consultations: INITIAL_CONSULTATIONS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      exams: INITIAL_EXAMS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      messages: INITIAL_MESSAGES,
    };
  };

  const [state, setState] = useState(loadInitial);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }, [state]);

  const logAction = (action: string, entity: AuditLog['entity'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userRole: state.currentUser.role,
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
    };
    setState((prev: any) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs],
    }));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setState((prev: any) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  // Switch role / user
  const switchUser = (userId: string) => {
    const user = state.users.find((u: User) => u.id === userId);
    if (user) {
      setState((prev: any) => ({ ...prev, currentUser: user }));
      logAction('Connexion utilisateur', 'Authentification', `Connexion sous l’identité ${user.name} (${user.role}).`);
    }
  };

  const switchRole = (role: UserRole) => {
    // Find the primary demo user for this role
    const user = state.users.find((u: User) => u.role === role);
    if (user) {
      setState((prev: any) => ({ ...prev, currentUser: user }));
      logAction('Changement de rôle', 'Authentification', `Bascule vers le profil rôle : ${role.toUpperCase()}.`);
    }
  };

  const login = (email: string): boolean => {
    const user = state.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setState((prev: any) => ({ ...prev, currentUser: user }));
      logAction('Connexion réussie', 'Authentification', `Session ouverte pour ${user.email}`);
      return true;
    }
    return false;
  };

  // Specialties
  const addSpecialty = (data: Omit<Specialty, 'id' | 'doctorCount'>) => {
    const newSpecialty: Specialty = {
      ...data,
      id: `spec-${Date.now()}`,
      doctorCount: 0,
    };
    setState((prev: any) => ({
      ...prev,
      specialties: [...prev.specialties, newSpecialty],
    }));
    logAction('Création de spécialité', 'Personnel', `Création du service ${data.name} (${data.code}).`);
  };

  const updateSpecialty = (id: string, updates: Partial<Specialty>) => {
    setState((prev: any) => ({
      ...prev,
      specialties: prev.specialties.map((s: Specialty) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    logAction('Modification de spécialité', 'Personnel', `Mise à jour de la spécialité ID: ${id}.`);
  };

  const toggleSpecialtyActive = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      specialties: prev.specialties.map((s: Specialty) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      ),
    }));
  };

  // Doctors
  const addDoctor = (data: Omit<Doctor, 'id' | 'assignedPatientsCount'>) => {
    const newDocId = `doc-${Date.now()}`;
    const newDoctor: Doctor = {
      ...data,
      id: newDocId,
      assignedPatientsCount: 0,
    };
    // If not existing user, create user account as well
    const existingUser = state.users.find((u: User) => u.id === data.userId);
    let updatedUsers = state.users;
    if (!existingUser) {
      const newUser: User = {
        id: `user-doc-${Date.now()}`,
        name: `Dr. ${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        role: 'doctor',
        matricule: data.matricule,
        avatar: data.photoUrl,
      };
      newDoctor.userId = newUser.id;
      updatedUsers = [...updatedUsers, newUser];
    }

    setState((prev: any) => ({
      ...prev,
      users: updatedUsers,
      doctors: [...prev.doctors, newDoctor],
      specialties: prev.specialties.map((s: Specialty) =>
        s.id === data.specialtyId ? { ...s, doctorCount: (s.doctorCount || 0) + 1 } : s
      ),
    }));
    logAction('Ajout de médecin', 'Médecin', `Nouveau médecin enregistré : Dr. ${data.firstName} ${data.lastName} (${data.specialtyName}).`);
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setState((prev: any) => ({
      ...prev,
      doctors: prev.doctors.map((d: Doctor) => (d.id === id ? { ...d, ...updates } : d)),
    }));
    logAction('Modification profil médecin', 'Médecin', `Mise à jour du profil médecin ID: ${id}.`);
  };

  const toggleDoctorActive = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      doctors: prev.doctors.map((d: Doctor) => (d.id === id ? { ...d, isActive: !d.isActive } : d)),
    }));
    logAction('Statut médecin modifié', 'Médecin', `Activation/Désactivation médecin ID: ${id}.`);
  };

  // Patients
  const addPatient = (data: Omit<Patient, 'id' | 'patientCode' | 'registeredAt'>): Patient => {
    const codeNum = state.patients.length + 1;
    const patientCode = `PT-2026-${String(codeNum).padStart(3, '0')}`;
    const newPatId = `pat-${Date.now()}`;
    const userId = data.userId || `user-pat-${Date.now()}`;

    const newPatient: Patient = {
      ...data,
      id: newPatId,
      patientCode,
      userId,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    // Ensure user account exists
    let updatedUsers = state.users;
    if (!state.users.some((u: User) => u.id === userId)) {
      const newUser: User = {
        id: userId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        role: 'patient',
      };
      updatedUsers = [...updatedUsers, newUser];
    }

    setState((prev: any) => ({
      ...prev,
      users: updatedUsers,
      patients: [newPatient, ...prev.patients],
    }));

    logAction('Enregistrement patient', 'Patient', `Création du dossier pour ${data.firstName} ${data.lastName} (${patientCode}).`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setState((prev: any) => ({
      ...prev,
      patients: prev.patients.map((p: Patient) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    logAction('Modification dossier patient', 'Patient', `Mise à jour des informations pour le patient ID: ${id}.`);
  };

  const assignPatientToDoctor = (patientId: string, doctorId: string, notes?: string) => {
    const doc = state.doctors.find((d: Doctor) => d.id === doctorId);
    const pat = state.patients.find((p: Patient) => p.id === patientId);
    if (!doc || !pat) return;

    const assignmentEntry = {
      doctorId,
      doctorName: `Dr. ${doc.firstName} ${doc.lastName}`,
      assignedAt: new Date().toISOString(),
      assignedBy: `${state.currentUser.name} (${state.currentUser.role})`,
      notes: notes || 'Attribution clinique',
    };

    setState((prev: any) => ({
      ...prev,
      patients: prev.patients.map((p: Patient) =>
        p.id === patientId
          ? {
              ...p,
              assignedDoctorId: doctorId,
              assignmentHistory: [assignmentEntry, ...(p.assignmentHistory || [])],
            }
          : p
      ),
      doctors: prev.doctors.map((d: Doctor) =>
        d.id === doctorId ? { ...d, assignedPatientsCount: (d.assignedPatientsCount || 0) + 1 } : d
      ),
    }));

    // Notify doctor
    addNotification({
      userId: doc.userId,
      targetRole: 'doctor',
      title: 'Nouveau patient attribué',
      message: `Le patient ${pat.firstName} ${pat.lastName} vous a été attribué par ${state.currentUser.name}.`,
      type: 'system',
    });

    logAction(
      'Attribution patient',
      'Attribution',
      `Attribution de ${pat.firstName} ${pat.lastName} à Dr. ${doc.firstName} ${doc.lastName}. Note: ${notes || 'Aucune'}`
    );
  };

  // Staff
  const addStaff = (data: Omit<StaffMember, 'id' | 'joinedAt'>) => {
    const newStaff: StaffMember = {
      ...data,
      id: `st-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setState((prev: any) => ({
      ...prev,
      staff: [...prev.staff, newStaff],
    }));
    logAction('Ajout membre du personnel', 'Personnel', `Enregistrement de ${data.name} au département ${data.department}.`);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setState((prev: any) => ({
      ...prev,
      staff: prev.staff.map((s: StaffMember) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    logAction('Modification personnel', 'Personnel', `Mise à jour du membre de personnel ID: ${id}.`);
  };

  const toggleStaffActive = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      staff: prev.staff.map((s: StaffMember) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    }));
  };

  // Appointments
  const createAppointment = (data: {
    patientId: string;
    doctorId: string;
    specialtyId: string;
    date: string;
    time: string;
    durationMinutes?: number;
    reason: string;
    notes?: string;
  }): { success: boolean; message?: string; appointment?: Appointment } => {
    // DOUBLE BOOKING PREVENTION: Check if doctor already has an active appointment at that date & time
    const conflict = state.appointments.find(
      (a: Appointment) =>
        a.doctorId === data.doctorId &&
        a.date === data.date &&
        a.time === data.time &&
        a.status !== 'annule' &&
        a.status !== 'refuse'
    );

    if (conflict) {
      return {
        success: false,
        message: `Le créneau du ${data.date} à ${data.time} est déjà réservé pour ce médecin. Veuillez choisir un autre créneau.`,
      };
    }

    const patient = state.patients.find((p: Patient) => p.id === data.patientId);
    const doctor = state.doctors.find((d: Doctor) => d.id === data.doctorId);
    const specialty = state.specialties.find((s: Specialty) => s.id === data.specialtyId);

    const newCode = `RDV-2026-${String(state.appointments.length + 140).padStart(4, '0')}`;
    const isPatientSelfBooking = state.currentUser.role === 'patient';
    const status: AppointmentStatus = isPatientSelfBooking ? 'en_attente' : 'confirme';

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      code: newCode,
      patientId: data.patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Inconnu',
      doctorId: data.doctorId,
      doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Médecin',
      specialtyId: data.specialtyId,
      specialtyName: specialty ? specialty.name : doctor?.specialtyName || 'Consultation',
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes || 30,
      reason: data.reason,
      status,
      notes: data.notes || (isPatientSelfBooking ? 'Demande soumise en ligne par le patient.' : 'Rendez-vous fixé par le secrétariat.'),
      createdBy: state.currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      appointments: [newAppointment, ...prev.appointments],
    }));

    // Notifications
    if (doctor) {
      addNotification({
        userId: doctor.userId,
        targetRole: 'doctor',
        title: status === 'confirme' ? 'Nouveau rendez-vous confirmé' : 'Nouvelle demande de rendez-vous',
        message: `${newAppointment.patientName} le ${data.date} à ${data.time} (${data.reason}).`,
        type: 'appointment',
      });
    }

    if (isPatientSelfBooking) {
      addNotification({
        userId: 'admin',
        targetRole: 'admin',
        title: 'Demande de rendez-vous à valider',
        message: `Demande de ${newAppointment.patientName} avec Dr. ${doctor?.lastName} pour le ${data.date} à ${data.time}.`,
        type: 'appointment',
      });
    }

    logAction(
      'Création de rendez-vous',
      'Rendez-vous',
      `Création ${newCode} (${newAppointment.patientName} avec ${newAppointment.doctorName}) le ${data.date} à ${data.time}. Statut: ${status}`
    );

    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, notes?: string) => {
    const apt = state.appointments.find((a: Appointment) => a.id === id);
    if (!apt) return;

    setState((prev: any) => ({
      ...prev,
      appointments: prev.appointments.map((a: Appointment) =>
        a.id === id
          ? {
              ...a,
              status,
              notes: notes !== undefined ? notes : a.notes,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));

    // Notify patient
    const patient = state.patients.find((p: Patient) => p.id === apt.patientId);
    if (patient && patient.userId) {
      let statusLabel: string = status;
      if (status === 'confirme') statusLabel = 'confirmé par la clinique';
      if (status === 'refuse') statusLabel = 'refusé';
      if (status === 'annule') statusLabel = 'annulé';
      if (status === 'reporte') statusLabel = 'reporté';
      if (status === 'en_consultation') statusLabel = 'en cours de consultation';

      addNotification({
        userId: patient.userId,
        targetRole: 'patient',
        title: `Rendez-vous ${apt.code} : ${status.toUpperCase()}`,
        message: `Votre rendez-vous du ${apt.date} à ${apt.time} est désormais ${statusLabel}.`,
        type: 'appointment',
      });
    }

    logAction(
      'Mise à jour statut RDV',
      'Rendez-vous',
      `RDV ${apt.code} (${apt.patientName}) passé au statut "${status}". Note: ${notes || 'Aucune'}`
    );
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTime: string,
    notes?: string
  ): { success: boolean; message?: string } => {
    const apt = state.appointments.find((a: Appointment) => a.id === id);
    if (!apt) return { success: false, message: 'Rendez-vous introuvable' };

    // Check conflict
    const conflict = state.appointments.find(
      (a: Appointment) =>
        a.id !== id &&
        a.doctorId === apt.doctorId &&
        a.date === newDate &&
        a.time === newTime &&
        a.status !== 'annule' &&
        a.status !== 'refuse'
    );
    if (conflict) {
      return {
        success: false,
        message: `Ce créneau (${newDate} à ${newTime}) est déjà occupé pour ce médecin.`,
      };
    }

    setState((prev: any) => ({
      ...prev,
      appointments: prev.appointments.map((a: Appointment) =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              time: newTime,
              status: 'reporte',
              notes: notes || `Reporté au ${newDate} à ${newTime}.`,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));

    // Notify patient
    const patient = state.patients.find((p: Patient) => p.id === apt.patientId);
    if (patient && patient.userId) {
      addNotification({
        userId: patient.userId,
        targetRole: 'patient',
        title: 'Rendez-vous reporté',
        message: `Votre rendez-vous ${apt.code} a été reporté au ${newDate} à ${newTime}.`,
        type: 'appointment',
      });
    }

    logAction(
      'Report de rendez-vous',
      'Rendez-vous',
      `RDV ${apt.code} (${apt.patientName}) déplacé au ${newDate} à ${newTime}.`
    );

    return { success: true };
  };

  const assignDoctorToAppointment = (appointmentId: string, doctorId: string) => {
    const doctor = state.doctors.find((d: Doctor) => d.id === doctorId);
    const apt = state.appointments.find((a: Appointment) => a.id === appointmentId);
    if (!doctor || !apt) return;

    setState((prev: any) => ({
      ...prev,
      appointments: prev.appointments.map((a: Appointment) =>
        a.id === appointmentId
          ? {
              ...a,
              doctorId: doctor.id,
              doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
              specialtyId: doctor.specialtyId,
              specialtyName: doctor.specialtyName,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));

    addNotification({
      userId: doctor.userId,
      targetRole: 'doctor',
      title: 'Rendez-vous réassigné',
      message: `Le rendez-vous ${apt.code} (${apt.patientName}) vous a été affecté pour le ${apt.date} à ${apt.time}.`,
      type: 'appointment',
    });

    logAction(
      'Réassignation médecin pour RDV',
      'Rendez-vous',
      `Affectation du RDV ${apt.code} à Dr. ${doctor.firstName} ${doctor.lastName}.`
    );
  };

  // Consultations & Prescriptions
  const createConsultation = (
    consultationData: Omit<Consultation, 'id' | 'code' | 'createdAt'>,
    prescriptionData?: Omit<Prescription, 'id' | 'code'>
  ): Consultation => {
    const newCsCode = `CS-2026-${String(state.consultations.length + 90).padStart(4, '0')}`;
    const newCsId = `cs-${Date.now()}`;

    let newPrescription: Prescription | undefined;
    if (prescriptionData && prescriptionData.medications.length > 0) {
      const newOrdCode = `ORD-2026-${String(state.prescriptions.length + 313).padStart(4, '0')}`;
      newPrescription = {
        ...prescriptionData,
        id: `ord-${Date.now()}`,
        code: newOrdCode,
        consultationId: newCsId,
      };
    }

    const newConsultation: Consultation = {
      ...consultationData,
      id: newCsId,
      code: newCsCode,
      prescriptionId: newPrescription?.id,
      createdAt: new Date().toISOString(),
    };

    // If associated with an appointment, mark appointment as 'termine'
    let updatedAppointments = state.appointments;
    if (consultationData.appointmentId) {
      updatedAppointments = updatedAppointments.map((a: Appointment) =>
        a.id === consultationData.appointmentId ? { ...a, status: 'termine' } : a
      );
    }

    // If exams are requested during consultation, auto-create exam records in 'en_attente' status!
    const newExams: MedicalExam[] = [];
    if (consultationData.examsRequested && consultationData.examsRequested.length > 0) {
      consultationData.examsRequested.forEach((examName, idx) => {
        const isImagerie = examName.toLowerCase().includes('écho') || examName.toLowerCase().includes('radio') || examName.toLowerCase().includes('scanner');
        newExams.push({
          id: `ex-${Date.now()}-${idx}`,
          code: `EX-2026-${String(state.exams.length + 45 + idx).padStart(3, '0')}`,
          patientId: consultationData.patientId,
          patientName: consultationData.patientName,
          prescribingDoctorId: consultationData.doctorId,
          prescribingDoctorName: consultationData.doctorName,
          examType: examName,
          category: isImagerie ? 'imagerie' : 'biologie',
          description: `Prescrit au cours de la consultation ${newCsCode}.`,
          requestedAt: new Date().toISOString(),
          status: 'en_attente',
        });
      });
    }

    setState((prev: any) => ({
      ...prev,
      consultations: [newConsultation, ...prev.consultations],
      prescriptions: newPrescription ? [newPrescription, ...prev.prescriptions] : prev.prescriptions,
      appointments: updatedAppointments,
      exams: [...newExams, ...prev.exams],
    }));

    // Notify patient
    const patient = state.patients.find((p: Patient) => p.id === consultationData.patientId);
    if (patient && patient.userId) {
      addNotification({
        userId: patient.userId,
        targetRole: 'patient',
        title: 'Compte rendu de consultation disponible',
        message: `Dr. ${consultationData.doctorName} a enregistré le compte rendu de votre consultation.`,
        type: 'prescription',
      });
      if (newPrescription) {
        addNotification({
          userId: patient.userId,
          targetRole: 'patient',
          title: 'Nouvelle ordonnance médicale',
          message: `Votre ordonnance ${newPrescription.code} est disponible au téléchargement.`,
          type: 'prescription',
        });
      }
    }

    // Notify Lab if exams were requested
    if (newExams.length > 0) {
      addNotification({
        userId: 'lab',
        targetRole: 'lab',
        title: 'Nouvelles analyses prescrites',
        message: `${newExams.length} examen(s) prescrit(s) pour ${consultationData.patientName} par Dr. ${consultationData.doctorName}.`,
        type: 'result',
      });
    }

    logAction(
      'Clôture consultation',
      'Consultation',
      `Compte rendu ${newCsCode} enregistré pour ${consultationData.patientName}. Diagnostic: ${consultationData.diagnosis}.`
    );

    return newConsultation;
  };

  const createPrescription = (prescription: Omit<Prescription, 'id' | 'code'>): Prescription => {
    const newOrdCode = `ORD-2026-${String(state.prescriptions.length + 313).padStart(4, '0')}`;
    const newPrescription: Prescription = {
      ...prescription,
      id: `ord-${Date.now()}`,
      code: newOrdCode,
    };
    setState((prev: any) => ({
      ...prev,
      prescriptions: [newPrescription, ...prev.prescriptions],
    }));

    logAction(
      'Rédaction ordonnance',
      'Ordonnance',
      `Ordonnance ${newOrdCode} rédigée pour ${prescription.patientName} (${prescription.medications.length} médicament(s)).`
    );

    return newPrescription;
  };

  // Medical Exams
  const createExam = (data: Omit<MedicalExam, 'id' | 'code' | 'requestedAt' | 'status'>): MedicalExam => {
    const newCode = `EX-2026-${String(state.exams.length + 45).padStart(3, '0')}`;
    const newExam: MedicalExam = {
      ...data,
      id: `ex-${Date.now()}`,
      code: newCode,
      requestedAt: new Date().toISOString(),
      status: 'en_attente',
    };

    setState((prev: any) => ({
      ...prev,
      exams: [newExam, ...prev.exams],
    }));

    addNotification({
      userId: 'lab',
      targetRole: 'lab',
      title: 'Nouvel examen programmé',
      message: `${data.examType} pour ${data.patientName}.`,
      type: 'result',
    });

    logAction('Prescription examen', 'Examen', `Demande d'examen ${newCode} (${data.examType}) pour ${data.patientName}.`);
    return newExam;
  };

  const updateExamStatus = (id: string, status: ExamStatus, updates?: Partial<MedicalExam>) => {
    const exam = state.exams.find((e: MedicalExam) => e.id === id);
    if (!exam) return;

    setState((prev: any) => ({
      ...prev,
      exams: prev.exams.map((e: MedicalExam) =>
        e.id === id
          ? {
              ...e,
              ...updates,
              status,
              ...(status === 'disponible' && !e.performedAt ? { performedAt: new Date().toISOString() } : {}),
              ...(status === 'valide' && !e.validatedAt ? { validatedAt: new Date().toISOString() } : {}),
              ...(status === 'publie' && !e.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
            }
          : e
      ),
    }));

    // If validated or published, notify prescriber and patient
    if (status === 'publie') {
      const patient = state.patients.find((p: Patient) => p.id === exam.patientId);
      if (patient && patient.userId) {
        addNotification({
          userId: patient.userId,
          targetRole: 'patient',
          title: 'Résultat d’examen disponible',
          message: `Vos résultats pour ${exam.examType} ont été validés et publiés dans votre espace.`,
          type: 'result',
        });
      }
    }

    logAction(
      'Mise à jour statut examen',
      'Examen',
      `Examen ${exam.code} (${exam.examType}) passé à "${status.toUpperCase()}".`
    );
  };

  const publishExamResult = (id: string) => {
    updateExamStatus(id, 'publie', {
      validatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    });
  };

  // Messages
  const sendMessage = (receiverId: string, patientId: string, content: string) => {
    const receiver = state.users.find((u: User) => u.id === receiverId);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: state.currentUser.id,
      senderName: state.currentUser.name,
      senderRole: state.currentUser.role,
      receiverId,
      receiverName: receiver ? receiver.name : 'Destinataire',
      patientId,
      content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    addNotification({
      userId: receiverId,
      title: `Nouveau message de ${state.currentUser.name}`,
      message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
      type: 'message',
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      notifications: prev.notifications.map((n: Notification) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev: any) => ({
      ...prev,
      notifications: prev.notifications.map((n: Notification) => ({ ...n, isRead: true })),
    }));
  };

  // Reset database to initial pristine state
  const resetDatabase = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setState({
      currentUser: INITIAL_USERS[0],
      users: INITIAL_USERS,
      specialties: INITIAL_SPECIALTIES,
      doctors: INITIAL_DOCTORS,
      patients: INITIAL_PATIENTS,
      staff: INITIAL_STAFF,
      appointments: INITIAL_APPOINTMENTS,
      consultations: INITIAL_CONSULTATIONS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      exams: INITIAL_EXAMS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      messages: INITIAL_MESSAGES,
    });
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser: state.currentUser,
        users: state.users,
        specialties: state.specialties,
        doctors: state.doctors,
        patients: state.patients,
        staff: state.staff,
        appointments: state.appointments,
        consultations: state.consultations,
        prescriptions: state.prescriptions,
        exams: state.exams,
        notifications: state.notifications,
        auditLogs: state.auditLogs,
        messages: state.messages,

        switchUser,
        switchRole,
        login,

        addSpecialty,
        updateSpecialty,
        toggleSpecialtyActive,

        addDoctor,
        updateDoctor,
        toggleDoctorActive,

        addPatient,
        updatePatient,
        assignPatientToDoctor,

        addStaff,
        updateStaff,
        toggleStaffActive,

        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        assignDoctorToAppointment,

        createConsultation,
        createPrescription,

        createExam,
        updateExamStatus,
        publishExamResult,

        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,

        logAction,
        resetDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
