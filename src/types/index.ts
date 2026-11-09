export type UserRole = 'admin' | 'secretary' | 'doctor' | 'lab' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  matricule?: string;
}

export interface Patient {
  id: string;
  patientCode: string; // e.g. PT-2026-001
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup?: string; // e.g. 'O+', 'A-', etc.
  allergies?: string[];
  chronicDiseases?: string[];
  assignedDoctorId?: string;
  assignmentHistory?: {
    doctorId: string;
    doctorName: string;
    assignedAt: string;
    assignedBy: string;
    notes?: string;
  }[];
  registeredAt: string;
  avatar?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  matricule: string;
  specialtyId: string;
  specialtyName: string;
  phone: string;
  email: string;
  photoUrl: string;
  room: string;
  consultationHours: {
    start: string; // e.g. "08:00"
    end: string;   // e.g. "17:00"
    slotDurationMinutes: number; // e.g. 30
  };
  availableDays: ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi')[];
  isActive: boolean;
  biography?: string;
  assignedPatientsCount?: number;
}

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  phone: string;
  email: string;
  matricule: string;
  joinedAt: string;
  isActive: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  code: string;
  description: string;
  iconName: string;
  doctorCount?: number;
  isActive: boolean;
}

export type AppointmentStatus =
  | 'en_attente'       // Patient requested or pending admin review
  | 'confirme'         // Confirmed by clinic
  | 'refuse'           // Refused
  | 'reporte'          // Postponed
  | 'arrive'           // Patient arrived in clinic waiting room
  | 'en_consultation'  // Currently in consultation with doctor
  | 'termine'          // Consultation completed
  | 'annule';          // Cancelled

export interface Appointment {
  id: string;
  code: string; // e.g. RDV-2026-0142
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Consultation {
  id: string;
  code: string; // CS-2026-0089
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  date: string;
  time: string;
  reason: string;
  clinicalObservations: string;
  vitals?: {
    bloodPressure?: string; // e.g. "120/80"
    pulse?: number;         // bpm
    temperature?: number;   // °C
    weight?: number;        // kg
    glycemia?: string;      // g/L
  };
  diagnosis: string;
  treatment: string;
  examsRequested?: string[];
  recommendations: string;
  followUpDate?: string;
  prescriptionId?: string;
  status: 'en_cours' | 'cloturee';
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;       // e.g. "500 mg"
  frequency: string;    // e.g. "1 comprimé 3 fois par jour"
  duration: string;     // e.g. "7 jours"
  instructions?: string;// e.g. "Pendant les repas"
}

export interface Prescription {
  id: string;
  code: string; // ORD-2026-0312
  consultationId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorMatricule: string;
  date: string;
  validUntil: string;
  medications: PrescriptionItem[];
  instructions?: string;
  signatureDate?: string;
  isSigned: boolean;
}

export type ExamStatus =
  | 'en_attente'       // Prescribed, waiting sample/patient
  | 'en_cours'         // In progress in laboratory
  | 'disponible'       // Results ready internally
  | 'en_validation'    // In doctor or biologist validation
  | 'valide'           // Validated by doctor/biologist
  | 'publie';          // Published and visible to patient

export interface MedicalExam {
  id: string;
  code: string; // EX-2026-042
  patientId: string;
  patientName: string;
  prescribingDoctorId: string;
  prescribingDoctorName: string;
  examType: string;
  category: 'biologie' | 'imagerie' | 'cardiologie' | 'autre';
  description: string;
  requestedAt: string;
  performedAt?: string;
  validatedAt?: string;
  publishedAt?: string;
  status: ExamStatus;
  labTechName?: string;
  findings?: string;
  normalValues?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string; // mock or data url
}

export interface Notification {
  id: string;
  userId: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  type: 'appointment' | 'result' | 'prescription' | 'system' | 'message';
  linkTarget?: string;
  createdAt: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: 'Patient' | 'Rendez-vous' | 'Médecin' | 'Consultation' | 'Ordonnance' | 'Examen' | 'Attribution' | 'Personnel' | 'Authentification';
  details: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  patientId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}
