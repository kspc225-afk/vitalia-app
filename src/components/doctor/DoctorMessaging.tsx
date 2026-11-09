import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { MessageSquare, Send, User, Clock, CheckCheck } from 'lucide-react';

export const DoctorMessaging: React.FC = () => {
  const { currentUser, doctors, patients, messages, sendMessage } = useStore();

  const currentDoctor =
    doctors.find((d) => d.userId === currentUser.id) ||
    doctors.find((d) => d.id === 'doc-1') ||
    doctors[0];

  // Patients who have exchanged messages with this doctor or are assigned to him
  const assignedPatients = patients.filter((p) => p.assignedDoctorId === currentDoctor.id);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    assignedPatients[0]?.id || patients[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Filter messages between current doctor and active patient
  const conversationMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activePatient?.userId) ||
      (m.senderId === activePatient?.userId && m.receiverId === currentUser.id) ||
      m.patientId === activePatient?.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePatient) return;

    sendMessage(activePatient.userId || activePatient.id, activePatient.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Messagerie Médicale Sécurisée
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Canal d'échange direct et confidentiel avec vos patients suivis.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Left: Patient Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Discussions Patients
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {assignedPatients.map((pat) => {
              const isSelected = pat.id === activePatient?.id;
              const lastMsg = [...messages]
                .filter((m) => m.patientId === pat.id)
                .slice(-1)[0];

              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatientId(pat.id)}
                  className={`p-3.5 transition-all cursor-pointer ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-l-[#0a6b63]' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {pat.firstName.charAt(0)}{pat.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {pat.firstName} {pat.lastName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {pat.patientCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.content : 'Nouvelle conversation'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Messages View & Input (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            {activePatient && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0a6b63] font-bold text-xs flex items-center justify-center">
                  {activePatient.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {activePatient.firstName} {activePatient.lastName}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Patient ID : {activePatient.patientCode} · Tél : {activePatient.phone}
                  </p>
                </div>
              </div>
            )}
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Canal Chiffré OSIRIX
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[380px]">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Aucun message échangé pour le moment. Vous pouvez envoyer un mot d'accueil ci-dessous.
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#0a6b63] text-white rounded-br-none shadow-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                      {new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message médical à l'attention du patient..."
              className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#0a6b63]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#0a6b63] hover:bg-[#075952] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
