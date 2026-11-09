import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { History, Search, ShieldCheck, Filter, User } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      `${log.action} ${log.userName} ${log.details} ${log.entity}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const entitiesList = [
    'Patient',
    'Rendez-vous',
    'Médecin',
    'Consultation',
    'Ordonnance',
    'Examen',
    'Attribution',
    'Personnel',
    'Authentification',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Registre d'Audit & Traçabilité des Activités
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Journal immuable de conformité médicale : traçabilité des accès aux dossiers, attributions, prescriptions et publications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Traçabilité Active (Conformité Données de Santé)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par utilisateur, action, mot-clé..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs"
          />
        </div>

        <div>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">Toutes les entités</option>
            {entitiesList.map((ent) => (
              <option key={ent} value={ent}>
                {ent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Utilisateur Auteur</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entité</th>
                <th className="py-3 px-4">Détails de l'opération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-teal-800">
                    {log.userRole}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
