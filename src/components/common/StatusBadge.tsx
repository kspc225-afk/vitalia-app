import React from 'react';
import { AppointmentStatus, ExamStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  CalendarClock,
  UserCheck,
  Stethoscope,
  CheckCheck,
  AlertCircle,
  FileText,
  Send,
  Eye,
} from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus | ExamStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  // Appointment Status mappings
  switch (status) {
    case 'en_attente':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>En attente</span>
        </span>
      );
    case 'confirme':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Confirmé</span>
        </span>
      );
    case 'refuse':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/70 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Refusé</span>
        </span>
      );
    case 'reporte':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/70 ${sizeClasses}`}>
          <CalendarClock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Reporté</span>
        </span>
      );
    case 'arrive':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Patient arrivé</span>
        </span>
      );
    case 'en_consultation':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70 ${sizeClasses}`}>
          <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>En consultation</span>
        </span>
      );
    case 'termine':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70 ${sizeClasses}`}>
          <CheckCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Terminé</span>
        </span>
      );
    case 'annule':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/70 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Annulé</span>
        </span>
      );

    // Exam Status mappings
    case 'en_cours':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/70 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0 animate-spin" />
          <span>En cours d'analyse</span>
        </span>
      );
    case 'disponible':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/70 ${sizeClasses}`}>
          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Résultats saisis</span>
        </span>
      );
    case 'en_validation':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 ${sizeClasses}`}>
          <Eye className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>En validation médicale</span>
        </span>
      );
    case 'valide':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Validé par médecin</span>
        </span>
      );
    case 'publie':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Publié (Espace patient)</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
